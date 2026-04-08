import { requireSupabaseClient } from "@/lib/supabase";
import type { PlannerOutput, PlannerTrigger } from "@/types/domain";

interface PlannerInvocationResponse {
  plan: PlannerOutput;
  persisted_plan_id: string;
  source: "ai" | "fallback";
}

function resolvePlannerError(error: unknown) {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("failed to send a request to the edge function") ||
      message.includes("failed to fetch")
    ) {
      return new Error(
        "La funzione che genera il piano non è ancora attiva o non è raggiungibile. Va pubblicata su Supabase la Edge Function `plan-personalization` con le sue variabili server."
      );
    }

    if (message.includes("edge function returned a non-2xx status code")) {
      return new Error(
        "La funzione di generazione ha risposto con un errore. Controlla su Supabase che `plan-personalization` sia pubblicata e che i secret server siano configurati."
      );
    }
  }

  return error instanceof Error
    ? error
    : new Error("Non siamo riusciti a generare il piano in questo momento.");
}

export async function generatePersonalizedPlan(trigger: PlannerTrigger) {
  const client = requireSupabaseClient();
  const { data, error } = await client.functions.invoke<PlannerInvocationResponse>(
    "plan-personalization",
    {
      body: { trigger }
    }
  );

  if (error) {
    throw resolvePlannerError(error);
  }

  if (!data?.plan) {
    throw new Error("Il planner non ha restituito un piano valido.");
  }

  return data;
}
