import { NextResponse } from "next/server";
import { startProductVideo, type VideoAspect } from "@/lib/veo";
import { createClient } from "@/lib/supabase/server";
import { reserveCredits, refundCredits, VIDEO_COST } from "@/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;

type StartRequest = {
  imageBase64?: string;
  imageMimeType?: string;
  prompt?: string;
  aspectRatio?: VideoAspect;
};

export async function POST(req: Request) {
  let body: StartRequest;
  try {
    body = (await req.json()) as StartRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { imageBase64, imageMimeType } = body;
  if (!imageBase64 || !imageMimeType) {
    return NextResponse.json({ error: "A product image is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const reserved = await reserveCredits(supabase, VIDEO_COST);
  if (!reserved.ok) {
    if (reserved.reason === "insufficient") {
      return NextResponse.json(
        { error: `Not enough credits — a video costs ${VIDEO_COST}.` },
        { status: 402 },
      );
    }
    console.error("[/api/video/start] credit reservation failed:", reserved.message);
    return NextResponse.json(
      { error: "Couldn't reserve credits — please try again." },
      { status: 503 },
    );
  }

  try {
    const operationName = await startProductVideo({
      imageBase64,
      mimeType: imageMimeType,
      prompt: body.prompt,
      aspectRatio: body.aspectRatio,
    });
    return NextResponse.json({ operationName, credits: reserved.balance });
  } catch (err) {
    // Failed before any work was done → give the credits back.
    await refundCredits(supabase, VIDEO_COST);
    console.error("[/api/video/start] Veo start failed:", err);
    return NextResponse.json(
      { error: "Couldn't start video generation. Please try again." },
      { status: 502 },
    );
  }
}
