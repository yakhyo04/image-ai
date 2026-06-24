import { NextResponse } from "next/server";
import {
  generateInfographic,
  INFOGRAPHIC_STYLES,
  INFOGRAPHIC_LANGUAGES,
  type InfographicAspect,
  type InfographicStyle,
  type InfographicLanguage,
  type InlineImage,
} from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { persistGeneration } from "@/lib/persistGeneration";
import { reserveCredits, refundCredits, GENERATION_COST } from "@/lib/credits";
import { logGenerationEvent } from "@/lib/genEvents";

export const runtime = "nodejs";
export const maxDuration = 120;

const ALLOWED_ASPECTS: InfographicAspect[] = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
];

type InfographicRequest = {
  images?: InlineImage[];
  description?: string;
  aspectRatio?: string;
  style?: string;
  language?: string;
};

export async function POST(req: Request) {
  let body: InfographicRequest;
  try {
    body = (await req.json()) as InfographicRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { images, description, aspectRatio, style, language } = body;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!Array.isArray(images) || images.length === 0) {
    return NextResponse.json(
      { error: "At least one product image is required." },
      { status: 400 },
    );
  }
  if (images.length > 4) {
    return NextResponse.json(
      { error: "Up to 4 product images are supported." },
      { status: 400 },
    );
  }
  for (const img of images) {
    if (!img?.base64 || !img?.mimeType) {
      return NextResponse.json(
        { error: "Each image must include base64 and mimeType." },
        { status: 400 },
      );
    }
  }
  const aspect = ALLOWED_ASPECTS.includes(aspectRatio as InfographicAspect)
    ? (aspectRatio as InfographicAspect)
    : "3:4";

  const chosenStyle = INFOGRAPHIC_STYLES.includes(style as InfographicStyle)
    ? (style as InfographicStyle)
    : "glass";

  const chosenLanguage = INFOGRAPHIC_LANGUAGES.includes(
    language as InfographicLanguage,
  )
    ? (language as InfographicLanguage)
    : "en";

  const credits = await reserveCredits(supabase);
  if (credits === null) {
    return NextResponse.json(
      { error: `Not enough credits — each generation costs ${GENERATION_COST}.` },
      { status: 402 },
    );
  }

  try {
    const result = await generateInfographic({
      images,
      description,
      aspectRatio: aspect,
      style: chosenStyle,
      language: chosenLanguage,
    });
    await persistGeneration({
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
      tool: "infographics",
      prompt: description,
    });
    await logGenerationEvent(supabase, user.id, "infographics", "success");
    return NextResponse.json({ ...result, credits });
  } catch (err) {
    await refundCredits(supabase);
    await logGenerationEvent(supabase, user.id, "infographics", "failed");
    console.error("[/api/infographic] failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
