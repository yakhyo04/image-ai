import { NextResponse } from "next/server";
import { editImage, type Turn } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { persistGeneration } from "@/lib/persistGeneration";
import { reserveCredits, refundCredits, GENERATION_COST } from "@/lib/credits";
import { logGenerationEvent } from "@/lib/genEvents";

export const runtime = "nodejs";
export const maxDuration = 120;

type GenerateRequest = { prompt?: string; tool?: string };

export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const credits = await reserveCredits(supabase);
  if (credits === null) {
    return NextResponse.json(
      { error: `Not enough credits — each generation costs ${GENERATION_COST}.` },
      { status: 402 },
    );
  }

  // Text-only turn → the image model generates from the prompt alone.
  const turns: Turn[] = [{ role: "user", text: prompt }];

  try {
    const result = await editImage(turns);
    await persistGeneration({
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
      tool: body.tool ?? "patterns",
      prompt,
    });
    await logGenerationEvent(supabase, user.id, body.tool ?? "patterns", "success");
    return NextResponse.json({ ...result, credits });
  } catch (err) {
    await refundCredits(supabase);
    await logGenerationEvent(supabase, user.id, body.tool ?? "patterns", "failed");
    console.error("[/api/generate] failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
