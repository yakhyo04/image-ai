import { GenerateVideosOperation, GoogleGenAI } from "@google/genai";

// Constructed lazily on first use so `next build` (which evaluates route
// modules to collect page data) doesn't require GEMINI_API_KEY at build time —
// it's only needed at runtime when a video request actually hits this client.
let _ai: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment");
    }
    const useVertex = process.env.GEMINI_USE_VERTEX === "true";
    _ai = new GoogleGenAI(useVertex ? { apiKey, vertexai: true } : { apiKey });
  }
  return _ai;
}

// Veo 3.1 (fast tier) — image-to-video with audio. This key only has access to
// the Veo 3.1 family (veo-2.0 returns 404), so "fast" is the best quality/cost
// balance. Swap to "veo-3.1-generate-preview" for max quality or
// "veo-3.1-lite-generate-preview" for the cheapest tier.
export const VIDEO_MODEL = "veo-3.1-fast-generate-preview";

// Seconds per clip. Veo 3.1 only accepts 4, 6, or 8s (not 5).
export const VIDEO_DURATION = 8;

export type VideoAspect = "16:9" | "9:16";

// Default animation direction when the user doesn't write their own prompt.
// Veo image-to-video needs explicit, strong motion language or the product
// barely moves — so spell out clear camera + light motion.
const DEFAULT_VIDEO_PROMPT =
  "Cinematic product commercial. The camera slowly pushes in toward the product " +
  "with a smooth dolly motion and gentle parallax, then the product rotates a " +
  "little to show its form. Soft studio lighting with bright highlights and " +
  "reflections sweeping across the surface, subtle floating dust particles, shallow " +
  "depth of field. The product stays centered, sharp and unchanged. Continuous " +
  "smooth motion throughout, premium and dynamic, no text, no captions.";

type StartArgs = {
  imageBase64: string;
  mimeType: string;
  prompt?: string;
  aspectRatio?: VideoAspect;
};

// Kicks off a Veo image-to-video generation and returns the long-running
// operation name. The job itself completes asynchronously (~1–3 min) and is
// polled separately via pollVideo().
export async function startProductVideo(args: StartArgs): Promise<string> {
  const operation = await getAi().models.generateVideos({
    model: VIDEO_MODEL,
    prompt: args.prompt?.trim() || DEFAULT_VIDEO_PROMPT,
    image: { imageBytes: args.imageBase64, mimeType: args.mimeType },
    config: {
      numberOfVideos: 1,
      durationSeconds: VIDEO_DURATION,
      aspectRatio: args.aspectRatio ?? "9:16",
    },
  });
  if (!operation.name) throw new Error("Veo did not return an operation name");
  return operation.name;
}

export type PollResult =
  | { status: "pending" }
  | { status: "failed"; message: string }
  | { status: "done"; bytes: Buffer; mimeType: string };

// Checks a Veo operation by name. When finished, downloads the rendered MP4
// bytes so the caller can persist them.
export async function pollVideo(name: string): Promise<PollResult> {
  // We only carry the operation name across requests. The SDK needs a real
  // GenerateVideosOperation instance (it calls operation._fromAPIResponse), so
  // reconstruct one and set its name rather than passing a plain object.
  const operation = new GenerateVideosOperation();
  operation.name = name;
  const op = await getAi().operations.getVideosOperation({ operation });

  if (!op.done) return { status: "pending" };

  if (op.error) {
    const message =
      (op.error.message as string) ?? "Video generation failed. Please try again.";
    return { status: "failed", message };
  }

  const video = op.response?.generatedVideos?.[0]?.video;
  if (!video) {
    return { status: "failed", message: "Video was filtered or produced no output." };
  }

  const mimeType = video.mimeType ?? "video/mp4";

  if (video.videoBytes) {
    return { status: "done", bytes: Buffer.from(video.videoBytes, "base64"), mimeType };
  }

  if (video.uri) {
    // Developer-API file URIs need the API key appended to download the bytes.
    const apiKey = process.env.GEMINI_API_KEY ?? "";
    const sep = video.uri.includes("?") ? "&" : "?";
    const res = await fetch(`${video.uri}${sep}key=${apiKey}`);
    if (!res.ok) {
      return { status: "failed", message: `Couldn't download the video (HTTP ${res.status}).` };
    }
    return { status: "done", bytes: Buffer.from(await res.arrayBuffer()), mimeType };
  }

  return { status: "failed", message: "Video result had no downloadable content." };
}
