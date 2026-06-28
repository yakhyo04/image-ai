import type { SupabaseClient } from "@supabase/supabase-js";

// Credits charged per generated image.
export const GENERATION_COST = 10;
// The photo editor is cheaper than a full generation.
export const EDITOR_COST = 5;

// Cost for a given tool. Editor edits are 5 credits; everything else is 10.
export function costForTool(tool?: string): number {
  return tool === "editor" ? EDITOR_COST : GENERATION_COST;
}

// Result of a credit reservation. `insufficient` is a normal user-facing
// state (empty balance); `error` is an actual backend failure (missing RPC,
// RLS, network) that must NOT be reported to the user as "out of credits".
export type ReserveResult =
  | { ok: true; balance: number }
  | { ok: false; reason: "insufficient" }
  | { ok: false; reason: "error"; message: string };

// Atomically reserves the cost up-front and reports the remaining balance.
export async function reserveCredits(
  supabase: SupabaseClient,
  cost: number = GENERATION_COST,
): Promise<ReserveResult> {
  const { data, error } = await supabase.rpc("spend_credits", { cost });
  if (error) {
    // A well-formed spend_credits RPC signals an empty balance with a clear
    // message; treat only that as "insufficient". Everything else is a real
    // backend failure and is surfaced as such.
    const msg = `${error.message ?? ""} ${error.code ?? ""}`.toLowerCase();
    if (
      msg.includes("insufficient") ||
      msg.includes("not enough") ||
      msg.includes("enough credit")
    ) {
      return { ok: false, reason: "insufficient" };
    }
    return {
      ok: false,
      reason: "error",
      message: error.message || "Credit service error.",
    };
  }
  const balance = typeof data === "number" ? data : Number(data);
  if (!Number.isFinite(balance) || balance < 0) {
    // RPC succeeded but the balance was too low to cover the cost.
    return { ok: false, reason: "insufficient" };
  }
  return { ok: true, balance };
}

// Returns reserved credits, e.g. when a generation fails after charging.
export async function refundCredits(
  supabase: SupabaseClient,
  cost: number = GENERATION_COST,
): Promise<void> {
  await supabase.rpc("spend_credits", { cost: -cost });
}
