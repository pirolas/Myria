import { requireSupabaseClient } from "@/lib/supabase";
import type { PlannerOutput, PlannerTrigger } from "@/types/domain";

interface PlannerInvocationResponse {
  plan: PlannerOutput;
  persisted_plan_id: string;
  source: "ai" | "fallback";
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
    throw error;
  }

  if (!data?.plan) {
    throw new Error("Il planner non ha restituito un piano valido.");
  }

  return data;
}
