import { getSupabaseEnv } from "@/lib/env";
import { requireSupabaseClient } from "@/lib/supabase";
import type { PlannerOutput, PlannerTrigger } from "@/types/domain";

interface PlannerInvocationResponse {
  plan: PlannerOutput;
  persisted_plan_id: string;
  source: "ai" | "fallback" | "cached";
}

const inFlightPlannerRequests = new Map<string, Promise<PlannerInvocationResponse>>();

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
    "La tua sessione è presente, ma il token non si è riallineato in tempo. Ricarica la pagina e riprova."
  );
}

function readPayloadError(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    return String(payload.error ?? "");
  }

  return "";
}

async function parseJsonResponse(response: Response) {
  return response
    .clone()
    .json()
    .catch(async () => ({ error: await response.clone().text().catch(() => "") }));
}

export async function generatePersonalizedPlan(
  trigger: PlannerTrigger,
  accessToken?: string | null
) {
  const requestKey = `planner:${trigger}`;
  const existingRequest = inFlightPlannerRequests.get(requestKey);

  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = (async () => {
    const { url, anonKey } = getSupabaseEnv();
    const client = requireSupabaseClient();

    const callPlanner = async (token: string) => {
      const response = await fetch(`${url}/functions/v1/plan-personalization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ trigger })
      }).catch(() => null);

      if (!response) {
        throw new Error(
          "La funzione che genera il piano non è raggiungibile in questo momento. Riprova tra un attimo."
        );
      }

      const payload = await parseJsonResponse(response);
      return { response, payload };
    };

    let tokenToUse = await resolveAccessToken(accessToken);
    let { response, payload } = await callPlanner(tokenToUse);
    let message = readPayloadError(payload);

    if (response.status === 401) {
      const refreshResult = await client.auth.refreshSession().catch(() => null);
      const refreshedToken = refreshResult?.data.session?.access_token;

      if (refreshedToken && refreshedToken !== tokenToUse) {
        tokenToUse = refreshedToken;
        const retried = await callPlanner(tokenToUse);
        response = retried.response;
        payload = retried.payload;
        message = readPayloadError(payload);
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          message ||
            "La sessione non risulta valida per generare il piano. Esci e rientra in Mirya, poi riprova."
        );
      }

      if (response.status === 403) {
        throw new Error(
          message ||
            "Questo aggiornamento del percorso non è disponibile con il tuo accesso attuale."
        );
      }

      if (response.status >= 500) {
        throw new Error(
          message || "La funzione che genera il piano ha avuto un problema interno."
        );
      }

      throw new Error(message || "La generazione del piano non è riuscita.");
    }

    const data = payload as PlannerInvocationResponse;

    if (!data?.plan) {
      throw new Error("Il planner non ha restituito un piano valido.");
    }

    return data;
  })();

  inFlightPlannerRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightPlannerRequests.delete(requestKey);
  }
}
