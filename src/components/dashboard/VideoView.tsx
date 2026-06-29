"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { resizeAndEncodeImage } from "./lib";
import { triggerDownload } from "@/lib/imageExport";
import { resizeVideo, VIDEO_SIZES } from "@/lib/videoExport";
import { useCredits } from "@/store/credits";
import { VIDEO_COST } from "@/lib/credits";

type Aspect = "9:16" | "16:9";
type Phase = "idle" | "working" | "done" | "error";

const POLL_INTERVAL = 8000;
const MAX_POLLS = 60; // ~8 minutes

// Quick-fill animation styles. Veo needs explicit motion language, so each
// preset is a strong, specific motion description the user can still edit.
const ANIM_PRESETS = [
  { key: "zoom", label: "Slow zoom-in", prompt: "Cinematic slow dolly zoom pushing in toward the product with gentle parallax, soft studio lighting and bright highlights sweeping across the surface, shallow depth of field, the product stays centered and sharp, continuous smooth motion, premium commercial, no text." },
  { key: "turntable", label: "360° turntable", prompt: "The product rotates slowly and smoothly a full 360 degrees on an invisible turntable, staying centered, studio lighting with reflections sweeping across the surface, clean seamless background, premium product commercial, continuous motion, no text." },
  { key: "orbit", label: "Camera orbit", prompt: "The camera slowly orbits around the product in a smooth cinematic arc while the product stays centered, soft studio lighting with shifting shadows, shallow depth of field, premium look, continuous motion, no text." },
  { key: "float", label: "Float & rotate", prompt: "The product gently floats and rotates in mid-air with a slow elegant spin, soft light sweeping across it, subtle particles and a clean studio background, premium commercial animation, continuous motion, no text." },
  { key: "reveal", label: "Dynamic reveal", prompt: "Dynamic reveal: the camera pushes in with a slight parallax as soft light sweeps across the product and highlights bloom, the product stays centered and sharp, energetic but smooth, premium ad style, continuous motion, no text." },
];

export default function VideoView() {
  const [image, setImage] = useState<string | null>(null);
  const [imageParts, setImageParts] = useState<{ base64: string; mimeType: string } | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("9:16");
  const [phase, setPhase] = useState<Phase>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [sizeLabel, setSizeLabel] = useState(VIDEO_SIZES[1].label); // default 1080×1920
  const [exporting, setExporting] = useState(false);

  const setCredits = useCredits((s) => s.setCredits);
  const fileRef = useRef<HTMLInputElement>(null);
  const cancelled = useRef(false);

  // Stop polling if the component unmounts.
  useEffect(() => () => { cancelled.current = true; }, []);

  // Elapsed-time ticker while rendering.
  useEffect(() => {
    if (phase !== "working") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  async function loadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      const { dataUrl, base64, mimeType } = await resizeAndEncodeImage(file);
      setImage(dataUrl);
      setImageParts({ base64, mimeType });
      setError(null);
      setVideoUrl(null);
      setPhase("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read image");
    }
  }
  function onInput(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
    e.target.value = "";
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  }

  async function generate() {
    if (!imageParts) return;
    cancelled.current = false;
    setError(null);
    setVideoUrl(null);
    setElapsed(0);
    setPhase("working");

    try {
      const startRes = await fetch("/api/video/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageParts.base64,
          imageMimeType: imageParts.mimeType,
          prompt: prompt.trim() || undefined,
          aspectRatio: aspect,
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error ?? `HTTP ${startRes.status}`);
      if (typeof startData.credits === "number") setCredits(startData.credits);

      const operationName: string = startData.operationName;

      // Poll until the render finishes.
      for (let i = 0; i < MAX_POLLS; i++) {
        if (cancelled.current) return;
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        if (cancelled.current) return;

        const res = await fetch("/api/video/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName, prompt: prompt.trim() || undefined }),
        });
        const data = await res.json();
        if (data.status === "done") {
          if (cancelled.current) return;
          setVideoUrl(data.url);
          setPhase("done");
          return;
        }
        if (data.status === "failed" || !res.ok) {
          throw new Error(data.error ?? "Video generation failed.");
        }
        // else pending → keep polling
      }
      throw new Error("Video is taking longer than expected. Check your gallery shortly.");
    } catch (e) {
      if (cancelled.current) return;
      setError(e instanceof Error ? e.message : "Video generation failed.");
      setPhase("error");
    }
  }

  async function download() {
    if (!videoUrl) return;
    const size = VIDEO_SIZES.find((s) => s.label === sizeLabel) ?? VIDEO_SIZES[0];
    setExporting(true);
    setError(null);
    try {
      let blob: Blob;
      let suffix: string;
      if (size.w === 0) {
        blob = await (await fetch(videoUrl)).blob();
        suffix = "original";
      } else {
        blob = await resizeVideo(videoUrl, size.w, size.h);
        suffix = `${size.w}x${size.h}`;
      }
      triggerDownload(blob, `artboard-video-${suffix}.mp4`);
    } catch {
      setError("Couldn't export at that size. Try 'Original', or check your connection.");
    } finally {
      setExporting(false);
    }
  }

  function reset() {
    cancelled.current = true;
    setImage(null);
    setImageParts(null);
    setPrompt("");
    setVideoUrl(null);
    setError(null);
    setPhase("idle");
  }

  const working = phase === "working";
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <DashFrame active="video" title="Product Video">
      <div className="ab-dash-cols" style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "100%" }}>
        {/* LEFT — controls */}
        <div style={{ borderRight: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · Product image</div>
          <div
            onClick={() => !working && fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => !working && onDrop(e)}
            style={{ aspectRatio: "4/3", borderRadius: 14, border: "1.5px dashed var(--border-strong)", background: "var(--bg-1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--t-2)", position: "relative", overflow: "hidden", cursor: working ? "default" : "pointer" }}
          >
            {image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="product" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                {!working && <span style={{ position: "absolute", bottom: 8, right: 8, padding: "4px 9px", borderRadius: 8, background: "oklch(0 0 0 / 0.55)", color: "oklch(1 0 0 / 0.92)", fontSize: 11, fontWeight: 600 }}>Replace</span>}
              </>
            ) : (
              <>
                <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", top: "40%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1 }} />
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="upload" size={24} stroke={2} /></div>
                <div style={{ fontSize: 13.5, fontWeight: 600, position: "relative" }}>Drop or browse</div>
                <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10.5, position: "relative" }}>JPG · PNG · WEBP</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onInput} />

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>02 · Orientation</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["9:16", "16:9"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAspect(a)}
                disabled={working}
                style={{ padding: "10px 0", borderRadius: 11, cursor: working ? "default" : "pointer", fontWeight: 600, fontSize: 13, border: `1.5px solid ${aspect === a ? "var(--acc)" : "var(--border)"}`, background: aspect === a ? "var(--acc-soft)" : "var(--bg-1)", color: aspect === a ? "var(--acc)" : "var(--t-2)" }}
              >
                {a === "9:16" ? "Vertical 9:16" : "Wide 16:9"}
              </button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>03 · Animation style</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {ANIM_PRESETS.map((p) => {
              const on = prompt === p.prompt;
              return (
                <button
                  key={p.key}
                  onClick={() => setPrompt(on ? "" : p.prompt)}
                  disabled={working}
                  style={{ padding: "6px 11px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: working ? "default" : "pointer", border: `1px solid ${on ? "var(--acc)" : "var(--border)"}`, background: on ? "var(--acc-soft)" : "var(--bg-1)", color: on ? "var(--acc)" : "var(--t-2)" }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={working}
            placeholder="Pick a style above, or describe your own animation…"
            rows={4}
            style={{ width: "100%", resize: "none", borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--t-1)", padding: "10px 12px", fontSize: 13.5, fontFamily: "var(--font)", outline: "none" }}
          />
          <div className="ab-body" style={{ fontSize: 11.5, marginTop: 6 }}>Tip: clear motion words (rotate, zoom, orbit) give livelier results. 5-second clip.</div>

          <button onClick={generate} disabled={working || !image} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 16, opacity: working || !image ? 0.6 : 1 }}>
            {working ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Rendering…</> : <><Icon name="sparkle-fill" size={18} /> Generate video · {VIDEO_COST} credits</>}
          </button>
          {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "oklch(0.7 0.21 22 / 0.12)", border: "1px solid oklch(0.7 0.21 22 / 0.4)", color: "var(--err)", fontSize: 12.5 }}>{error}</div>}
        </div>

        {/* CENTER — preview */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: "4px 10px" }}>
              {working ? <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink .8s ease infinite" }} /> Rendering</> : <><Icon name="sparkle-fill" size={12} /> {phase === "done" ? "Ready" : "Idle"}</>}
            </span>
            {working && <span className="ab-mono" style={{ color: "var(--t-3)" }}>{mins}:{String(secs).padStart(2, "0")} elapsed</span>}
            <div style={{ flex: 1 }} />
            {phase === "done" && videoUrl && <button onClick={download} disabled={exporting} className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> {exporting ? "Exporting…" : "Download"}</button>}
          </div>

          <div style={{ flex: 1, minHeight: "calc(100dvh - 116px)", position: "relative", backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px", display: "flex", alignItems: "center", justifyContent: "center", padding: 36, overflow: "hidden" }}>
            {phase === "done" && videoUrl ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: "100%" }}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={videoUrl} controls autoPlay loop muted playsInline style={{ maxWidth: "100%", maxHeight: "62vh", borderRadius: 14, border: "1px solid var(--border-mid)", background: "#000" }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
                  <select
                    value={sizeLabel}
                    onChange={(e) => setSizeLabel(e.target.value)}
                    disabled={exporting}
                    aria-label="Download size"
                    style={{ height: 40, borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--t-1)", padding: "0 12px", fontSize: 13, fontFamily: "var(--font)", cursor: exporting ? "default" : "pointer" }}
                  >
                    {VIDEO_SIZES.map((s) => (
                      <option key={s.label} value={s.label}>{s.label}</option>
                    ))}
                  </select>
                  <button onClick={download} disabled={exporting} className="ab-btn ab-btn-primary" style={{ opacity: exporting ? 0.7 : 1 }}>
                    {exporting ? <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Exporting…</> : <><Icon name="download" size={16} stroke={2} /> Download MP4</>}
                  </button>
                  <Link href="/dashboard/gallery" className="ab-btn ab-btn-ghost"><Icon name="gallery" size={16} /> View in gallery</Link>
                  <button onClick={reset} disabled={exporting} className="ab-btn ab-btn-ghost"><Icon name="plus" size={15} /> New video</button>
                </div>
                <div className="ab-body" style={{ fontSize: 12 }}>Saved to your gallery at the original size. Resizing happens in your browser — the first export loads a small converter.</div>
              </div>
            ) : working ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, color: "var(--t-1)", textAlign: "center", maxWidth: 360 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", border: "3px solid var(--bg-3)", borderTopColor: "var(--acc)", animation: "ab-spin .7s linear infinite" }} />
                <div style={{ fontSize: 15, fontWeight: 600 }}>Rendering your video…</div>
                <div className="ab-body" style={{ fontSize: 13 }}>Veo usually takes 1–3 minutes. You can stay on this page — the video appears here and in your gallery when it's ready.</div>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ textAlign: "center", color: "var(--t-3)", cursor: "pointer", maxWidth: 340 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "var(--acc)" }}><Icon name="sparkle-fill" size={28} /></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t-1)" }}>Turn a product photo into a video</div>
                <div className="ab-body" style={{ fontSize: 13, marginTop: 6 }}>Upload a product image and we&apos;ll animate it into a 5-second clip — perfect for listings and ads.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
