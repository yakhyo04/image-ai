import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

// Single-threaded ffmpeg.wasm core (no cross-origin isolation required).
// Pinned to a core version known to work with @ffmpeg/ffmpeg 0.12.x.
const CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

let ffmpegPromise: Promise<FFmpeg> | null = null;

// Loads ffmpeg.wasm once and reuses it. The ~30MB core is fetched from the CDN
// on first use, so video export is lazy — nothing loads until the user exports.
async function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ffmpeg;
    })().catch((e) => {
      ffmpegPromise = null; // allow a retry on failure
      throw e;
    });
  }
  return ffmpegPromise;
}

// Re-encodes the source video to exactly width×height by scaling to cover and
// center-cropping the overflow (fills the frame, no black bars). Returns an MP4
// blob. Dimensions are forced even (H.264 requirement).
export async function resizeVideo(srcUrl: string, width: number, height: number): Promise<Blob> {
  const w = width % 2 === 0 ? width : width + 1;
  const h = height % 2 === 0 ? height : height + 1;

  const ffmpeg = await getFFmpeg();
  const inName = "input.mp4";
  const outName = "output.mp4";

  await ffmpeg.writeFile(inName, await fetchFile(srcUrl));
  await ffmpeg.exec([
    "-i", inName,
    "-vf", `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "ultrafast",
    "-movflags", "+faststart",
    "-an", // Veo 2 clips have no audio
    outName,
  ]);

  const data = (await ffmpeg.readFile(outName)) as Uint8Array;
  try {
    await ffmpeg.deleteFile(inName);
    await ffmpeg.deleteFile(outName);
  } catch {
    // non-fatal cleanup
  }
  return new Blob([data as unknown as BlobPart], { type: "video/mp4" });
}

export type SizePreset = { label: string; w: number; h: number };

// Common marketplace / social video sizes. `w: 0` means "keep original".
export const VIDEO_SIZES: SizePreset[] = [
  { label: "Original", w: 0, h: 0 },
  { label: "1080×1920 · 9:16", w: 1080, h: 1920 },
  { label: "1080×1440 · 3:4", w: 1080, h: 1440 },
  { label: "1080×1080 · 1:1", w: 1080, h: 1080 },
  { label: "1920×1080 · 16:9", w: 1920, h: 1080 },
  { label: "720×1280 · 9:16", w: 720, h: 1280 },
];
