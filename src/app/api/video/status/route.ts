import { NextResponse } from "next/server";
import { pollVideo } from "@/lib/veo";
import { createClient } from "@/lib/supabase/server";
import { refundCredits, VIDEO_COST } from "@/lib/credits";
import { persistVideo } from "@/lib/persistGeneration";

export const runtime = "nodejs";
export const maxDuration = 60;

type StatusRequest = { operationName?: string; prompt?: string };

export async function POST(req: Request) {
  let body: StatusRequest;
  try {
    body = (await req.json()) as StatusRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const operationName = body.operationName?.trim();
  if (!operationName) {
    return NextResponse.json({ error: "operationName is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let result;
  try {
    result = await pollVideo(operationName);
  } catch (err) {
    console.error("[/api/video/status] poll failed:", err);
    // Transient lookup error — let the client keep polling rather than refund.
    return NextResponse.json({ status: "pending" });
  }

  if (result.status === "pending") {
    return NextResponse.json({ status: "pending" });
  }

  if (result.status === "failed") {
    await refundCredits(supabase, VIDEO_COST); // give credits back on failure
    return NextResponse.json({ status: "failed", error: result.message });
  }

  // Done — store the MP4 and return its URL.
  const url = await persistVideo({
    bytes: result.bytes,
    mimeType: result.mimeType,
    prompt: body.prompt,
  });
  if (!url) {
    return NextResponse.json(
      { status: "failed", error: "Video generated but couldn't be saved." },
      { status: 500 },
    );
  }
  return NextResponse.json({ status: "done", url });
}
