import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError
} from "@supabase/supabase-js";
import { requireSupabaseClient } from "@/lib/supabase";
import type { PlannerOutput, PlannerTrigger } from "@/types/domain";

interface PlannerInvocationResponse {
  plan: PlannerOutput;
  persisted_plan_id: string;
  source: "ai" | "fallback";
}

async function resolveAccessToken(providedToken?: string | null) {
  if (providedToken) {
    return providedToken;
  }

  const client = requireSupabaseClient();
  const {
    data: { session }
  } = await client.auth.getSession();

  if (session?.access_token) {
    return session.access_token;
  }

  const refreshResult = await client.auth.refreshSession().catch(() => null);
  const refreshedToken = refreshResult?.data.session?.access_token;

  if (refreshedToken) {
    return refreshedToken;
  }

  const {
    data: { user }
  } = await client.auth.getUser().catch(() => ({ data: { user: null } }));

  if (!user) {
    throw new Error(
      "La sessione non risulta valida per generare il piano. Esci e rientra in Mirya, poi riprova."
    );
  }

  throw new Error(
    "La tua sessione è presente, ma il token non è stato riallineato in tempo. Ricarica la pagina e riprova."
  );
}

async function resolvePlannerError(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    const response = error.context;
    const status = response.status;
    const payload = await response
      .clone()
      .json()
      .catch(async () => ({ error: await response.clone().text().catch(() => "") }));
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "";

    if (status === 401) {
      return new Error(
        message || "La sessione non risulta valida per generare il piano. Esci e rientra in Mirya, poi riprova."
      );
    }

    if (status === 403) {
      return new Error(
        message || "Questo aggiornamento del percorso non è disponibile con il tuo accesso attuale."
      );
    }

    if (status >= 500) {
      return new Error(
        message || "La funzione che genera il piano ha avuto un problema interno. Ora riusciamo almeno a capire che l'errore arriva dal server."
      );
    }

    return new Error(message || "La generazione del piano non è riuscita.");
  }

  if (error instanceof FunctionsFetchError || error instanceof FunctionsRelayError) {
    return new Error(
      "La funzione che genera il piano non è raggiungibile in questo momento. Controlla che `plan-personalization` sia pubblicata su Supabase e che il progetto risponda correttamente."
    );
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Non siamo riusciti a generare il piano in questo momento.");
}

export async function generatePersonalizedPlan(
  trigger: PlannerTrigger,
  accessToken?: string | null
) {
  const client = requireSupabaseClient();
  const resolvedAccessToken = await resolveAccessToken(accessToken);
  const { data, error } = await client.functions.invoke<PlannerInvocationResponse>(
    "plan-personalization",
    {
      body: { trigger },
      headers: {
        Authorization: `Bearer ${resolvedAccessToken}`
      }
    }
  );

  if (error) {
    throw await resolvePlannerError(error);
  }

  if (!data?.plan) {
    throw new Error("Il planner non ha restituito un piano valido.");
  }

  return data;
}
