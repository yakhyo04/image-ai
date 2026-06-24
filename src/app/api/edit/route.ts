import { NextResponse } from "next/server";
import { editImage, type Turn } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { persistGeneration } from "@/lib/persistGeneration";
import { reserveCredits, refundCredits, costForTool } from "@/lib/credits";
import { logGenerationEvent } from "@/lib/genEvents";

export const runtime = "nodejs";
export const maxDuration = 60;

type EditRequest = {
  imageBase64: string;
  imageMimeType?: string;
  prompt: string;
  selectionMode?: boolean;
  history?: Turn[];
  tool?: string;
};

function buildSelectionPrompt(userPrompt: string): string {
  return [
    "You are editing the attached image.",
    "A specific region has been highlighted with a translucent bright magenta (#ff00ff) overlay.",
    "Apply the following change to ONLY the magenta-highlighted region:",
    "",
    `"${userPrompt}"`,
    "",
    "Hard rules — follow exactly:",
    "1. The output image MUST NOT contain any magenta highlight. Replace it with the real edit.",
    "2. If the instruction is to remove, erase, or delete: fill the highlighted area with a natural, seamless continuation of the surrounding scene (matching colors, textures, lighting, and perspective). It must look like nothing was ever there.",
    "3. Pixels OUTSIDE the highlighted region must be pixel-identical to the source. Do not restyle, recolor, or recompose anything else.",
    "4. Preserve the original aspect ratio and resolution.",
    "5. Output a single edited image. Do not add borders, captions, or watermarks.",
  ].join("\n");
}

export async function POST(req: Request) {
  let body: EditRequest;
  try {
    body = (await req.json()) as EditRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { imageBase64, imageMimeType, prompt, selectionMode, history } = body;

  if (!imageBase64 || !prompt) {
    return NextResponse.json(
      { error: "imageBase64 and prompt are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cost = costForTool(body.tool);
  const credits = await reserveCredits(supabase, cost);
  if (credits === null) {
    return NextResponse.json(
      { error: `Not enough credits — this costs ${cost}.` },
      { status: 402 },
    );
  }

  const turns: Turn[] = [...(history ?? [])];

  turns.push({
    role: "user",
    imageBase64,
    imageMimeType: imageMimeType ?? "image/png",
    text: selectionMode ? buildSelectionPrompt(prompt) : prompt,
  });

  try {
    const result = await editImage(turns);
    await persistGeneration({
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
      tool: body.tool ?? "editor",
      prompt,
    });
    await logGenerationEvent(supabase, user.id, body.tool ?? "editor", "success");
    return NextResponse.json({ ...result, credits });
  } catch (err) {
    await refundCredits(supabase, cost);
    await logGenerationEvent(supabase, user.id, body.tool ?? "editor", "failed");
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
