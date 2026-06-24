"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import ImageCanvas, { type ImageCanvasHandle } from "@/components/ImageCanvas";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { resizeAndEncodeImage, dataUrlToParts, downloadDataUrl } from "./lib";

export default function EditorView() {
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [brushEnabled, setBrushEnabled] = useState(false);
  const [brushSize, setBrushSize] = useState(44);
  const [hasMask, setHasMask] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef<ImageCanvasHandle>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      const { dataUrl } = await resizeAndEncodeImage(file);
      setImage(dataUrl);
      setHistory([dataUrl]);
      setBrushEnabled(false);
      setHasMask(false);
      setError(null);
      setCanvasKey((k) => k + 1);
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

  function setCurrent(dataUrl: string) {
    setImage(dataUrl);
    setBrushEnabled(false);
    setHasMask(false);
    setCanvasKey((k) => k + 1);
  }

  async function apply() {
    if (!image || !prompt.trim()) return;
    setError(null);
    setBusy(true);
    const masked = canvasRef.current?.exportMaskedSource() ?? null;
    const { base64, mimeType } = masked ?? dataUrlToParts(image);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, imageMimeType: mimeType, prompt: prompt.trim(), selectionMode: !!masked, tool: "editor" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      const next = `data:${data.mimeType};base64,${data.imageBase64}`;
      setHistory((prev) => [...prev, next]);
      setPrompt("");
      setCurrent(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Edit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashFrame active="editor" title="Photo Editor">
      <div className="ab-dash-cols" style={{ display: "grid", gridTemplateColumns: "316px 1fr 296px", minHeight: "100%" }}>
        {/* LEFT — controls */}
        <div style={{ borderRight: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · Source image</div>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{ aspectRatio: "4/3", borderRadius: 14, border: "1.5px dashed var(--border-strong)", background: "var(--bg-1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--t-2)", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            {image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="source" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", bottom: 8, right: 8, padding: "4px 9px", borderRadius: 8, background: "oklch(0 0 0 / 0.55)", color: "oklch(1 0 0 / 0.92)", fontSize: 11, fontWeight: 600 }}>Replace</span>
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

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>02 · Selection brush</div>
          <button
            onClick={() => { setBrushEnabled((b) => !b); if (brushEnabled) { canvasRef.current?.clearMask(); setHasMask(false); } }}
            disabled={!image}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0", borderRadius: 11, cursor: image ? "pointer" : "default", border: `1.5px solid ${brushEnabled ? "var(--acc)" : "var(--border)"}`, background: brushEnabled ? "var(--acc-soft)" : "var(--bg-1)", color: brushEnabled ? "var(--acc)" : "var(--t-2)", fontWeight: 600, fontSize: 13, opacity: image ? 1 : 0.5 }}
          >
            <Icon name="brush" size={16} /> {brushEnabled ? "Painting selection" : "Brush a region (optional)"}
          </button>
          {brushEnabled && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--t-3)", marginBottom: 6 }}><span>Brush size</span><span className="ab-mono">{brushSize}px</span></div>
              <input type="range" min={10} max={140} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--acc)" }} />
              <button onClick={() => { canvasRef.current?.clearMask(); setHasMask(false); }} className="ab-btn ab-btn-ghost ab-btn-sm ab-btn-full" style={{ marginTop: 10 }}>Clear selection</button>
              <div className="ab-body" style={{ fontSize: 11.5, marginTop: 8 }}>{hasMask ? "Region selected — describe the change below." : "Paint the area you want to change. Leave empty to edit the whole image."}</div>
            </div>
          )}

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>03 · Describe the edit</div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. remove the price tag, change background to white marble, add soft studio lighting…"
            rows={5}
            style={{ width: "100%", resize: "none", borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--t-1)", padding: "10px 12px", fontSize: 13.5, fontFamily: "var(--font)", outline: "none" }}
          />

          <button onClick={apply} disabled={busy || !image || !prompt.trim()} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 16, opacity: busy || !image || !prompt.trim() ? 0.6 : 1 }}>
            {busy ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Applying…</> : <><Icon name="magic" size={18} /> Apply edit · 5 credits</>}
          </button>
          {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "oklch(0.7 0.21 22 / 0.12)", border: "1px solid oklch(0.7 0.21 22 / 0.4)", color: "var(--err)", fontSize: 12.5 }}>{error}</div>}
        </div>

        {/* CENTER — canvas */}
        <div className="ab-canvas-col" style={{ display: "flex", flexDirection: "column", minWidth: 0, alignSelf: "start", position: "sticky", top: 0, height: "calc(100dvh - 64px)" }}>
          <div style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: "4px 10px" }}>
              {busy ? <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink .8s ease infinite" }} /> Editing</> : <><Icon name="magic" size={12} /> {image ? "Ready" : "Idle"}</>}
            </span>
            <span className="ab-mono" style={{ color: "var(--t-3)" }}>{brushEnabled ? "Brush mode" : "Whole image"}{history.length > 1 ? ` · ${history.length - 1} edits` : ""}</span>
            <div style={{ flex: 1 }} />
            {image && <button onClick={() => downloadDataUrl(image, "edited.png")} className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> Save</button>}
          </div>
          <div style={{ flex: 1, minHeight: "calc(100dvh - 116px)", minWidth: 0, position: "relative", backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px", display: "flex", alignItems: "center", justifyContent: "center", padding: image ? 0 : 36, overflow: "hidden" }}>
            {image ? (
              <ImageCanvas key={canvasKey} ref={canvasRef} imageDataUrl={image} brushEnabled={brushEnabled} brushSize={brushSize} onMaskChange={setHasMask} />
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ textAlign: "center", color: "var(--t-3)", cursor: "pointer", maxWidth: 320 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "var(--acc)" }}><Icon name="magic" size={28} /></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t-1)" }}>Upload a photo to edit</div>
                <div className="ab-body" style={{ fontSize: 13, marginTop: 6 }}>Brush a region (optional) and describe the change — inpaint, remove objects, recolor, or relight.</div>
              </div>
            )}
            {busy && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "oklch(0 0 0 / 0.4)", backdropFilter: "blur(2px)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "var(--t-1)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid var(--bg-3)", borderTopColor: "var(--acc)", animation: "ab-spin .7s linear infinite" }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Applying edit…</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — history */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>History</div>
          {history.length === 0 ? (
            <div className="ab-body" style={{ fontSize: 13 }}>Your original and each edit will appear here.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {history.map((h, i) => (
                <div key={i} onClick={() => setCurrent(h)} style={{ aspectRatio: "1", borderRadius: 11, overflow: "hidden", border: h === image ? "2px solid var(--acc)" : "1px solid var(--border-mid)", position: "relative", cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h} alt={i === 0 ? "Original" : `Edit ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", bottom: 5, left: 5, fontFamily: "var(--font-mono)", fontSize: 9, color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.45)", padding: "1px 5px", borderRadius: 4 }}>{i === 0 ? "ORIG" : `#${i}`}</span>
                </div>
              ))}
            </div>
          )}
          {image && (
            <>
              <button onClick={() => downloadDataUrl(image, "edited-hd.png")} className="ab-btn ab-btn-primary ab-btn-full" style={{ marginTop: 18 }}><Icon name="download" size={16} stroke={2} /> Download HD</button>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={() => { setImage(null); setHistory([]); setPrompt(""); }} className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="close" size={15} /> Reset</button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashFrame>
  );
}
