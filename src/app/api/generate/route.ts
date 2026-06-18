import { NextResponse } from "next/server";
import { editImage, type Turn } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 120;

type GenerateRequest = { prompt?: string };

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

  // Text-only turn → the image model generates from the prompt alone.
  const turns: Turn[] = [{ role: "user", text: prompt }];

  try {
    const result = await editImage(turns);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/generate] failed:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
