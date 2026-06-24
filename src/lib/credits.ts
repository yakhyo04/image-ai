import type { SupabaseClient } from "@supabase/supabase-js";

// Credits charged per generated image.
export const GENERATION_COST = 10;
// The photo editor is cheaper than a full generation.
export const EDITOR_COST = 5;

// Cost for a given tool. Editor edits are 5 credits; everything else is 10.
export function costForTool(tool?: string): number {
  return tool === "editor" ? EDITOR_COST : GENERATION_COST;
}

// Atomically reserves the cost up-front. Returns the remaining balance, or
// null when the user doesn't have enough credits (or the call failed).
export async function reserveCredits(
  supabase: SupabaseClient,
  cost: number = GENERATION_COST,
): Promise<number | null> {
  const { data, error } = await supabase.rpc("spend_credits", { cost });
  if (error) return null;
  return data as number;
}

// Returns reserved credits, e.g. when a generation fails after charging.
export async function refundCredits(
  supabase: SupabaseClient,
  cost: number = GENERATION_COST,
): Promise<void> {
  await supabase.rpc("spend_credits", { cost: -cost });
}
