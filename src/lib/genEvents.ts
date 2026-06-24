import type { SupabaseClient } from "@supabase/supabase-js";

// Records a generation attempt so we can compute a real success rate.
// Best-effort: never throws, so it can't break the generation response.
export async function logGenerationEvent(
  supabase: SupabaseClient,
  userId: string,
  tool: string | undefined,
  status: "success" | "failed",
): Promise<void> {
  try {
    await supabase.from("generation_events").insert({
      user_id: userId,
      tool: tool ?? null,
      status,
    });
  } catch (err) {
    console.error("[logGenerationEvent] failed:", err);
  }
}
