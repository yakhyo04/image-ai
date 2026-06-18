"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { PresetGrid, ChipRow, SegRow } from "./controls";
import { resizeAndEncodeImage, downloadDataUrl, type InlineImage } from "./lib";
import { TOOL_CONFIGS, type ToolSection } from "./toolConfigs";

function sectionDefault(s: ToolSection) {
  return s.def ?? (s.type === "seg" ? 1 : 0);
}
function sectionValue(s: ToolSection, idx: number) {
  return s.type === "presets" ? s.items[idx].t : s.items[idx];
}

export default function ToolWorkspace({ toolKey }: { toolKey: string }) {
  const cfg = TOOL_CONFIGS[toolKey];
  const [image, setImage] = useState<InlineImage | null>(null);
  const [sels, setSels] = useState<number[]>(() => cfg.sections.map(sectionDefault));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function setSel(i: number, v: number) {
    setSels((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  async function loadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    try {
      setImage(await resizeAndEncodeImage(file));
      setError(null);
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
    if (!image) {
      setError(`Upload ${cfg.sourceLabel.toLowerCase()} first.`);
      return;
    }
    const selMap: Record<string, string> = {};
    cfg.sections.forEach((s, i) => { selMap[s.label] = sectionValue(s, sels[i]); });
    const prompt = cfg.buildPrompt(selMap);
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: image.base64, imageMimeType: image.mimeType, prompt, selectionMode: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
      setResult(dataUrl);
      setVariations((prev) => [dataUrl, ...prev].slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashFrame active={cfg.active} title={cfg.title}>
      <div className="ab-dash-cols" style={{ display: "grid", gridTemplateColumns: "316px 1fr 296px", minHeight: "100%" }}>
        {/* LEFT controls */}
        <div style={{ borderRight: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · {cfg.sourceLabel}</div>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{ aspectRatio: "4/3", borderRadius: 14, border: "1.5px dashed var(--border-strong)", background: "var(--bg-1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--t-2)", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            {image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.dataUrl} alt="source" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", bottom: 8, right: 8, padding: "4px 9px", borderRadius: 8, background: "oklch(0 0 0 / 0.55)", color: "oklch(1 0 0 / 0.92)", fontSize: 11, fontWeight: 600 }}>Replace</span>
              </>
            ) : (
              <>
                <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", top: "40%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1 }} />
                <div style={{ width: 50, height: 50, borderRadius: 15, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="upload" size={23} stroke={2} /></div>
                <div style={{ fontSize: 13, fontWeight: 600, position: "relative" }}>{cfg.sourceHint}</div>
                <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10.5, position: "relative" }}>JPG · PNG · WEBP</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onInput} />

          {cfg.sections.map((s, i) => (
            <div key={i}>
              <div className="ab-eyebrow" style={{ margin: "22px 0 10px" }}>{String(i + 2).padStart(2, "0")} · {s.label}</div>
              {s.type === "presets" && <PresetGrid items={s.items} cols={s.cols ?? 3} value={sels[i]} onChange={(v) => setSel(i, v)} />}
              {s.type === "chips" && <ChipRow items={s.items} value={sels[i]} onChange={(v) => setSel(i, v)} />}
              {s.type === "seg" && <SegRow items={s.items} value={sels[i]} onChange={(v) => setSel(i, v)} />}
            </div>
          ))}

          <button onClick={generate} disabled={busy} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 20, opacity: busy ? 0.7 : 1 }}>
            {busy ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Generating…</> : <><Icon name="sparkle-fill" size={18} /> Generate · {cfg.cost} credits</>}
          </button>
          {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "oklch(0.7 0.21 22 / 0.12)", border: "1px solid oklch(0.7 0.21 22 / 0.4)", color: "var(--err)", fontSize: 12.5 }}>{error}</div>}
        </div>

        {/* CENTER canvas */}
        <div className="ab-canvas-col" style={{ display: "flex", flexDirection: "column", minWidth: 0, alignSelf: "start", position: "sticky", top: 0, height: "calc(100dvh - 64px)" }}>
          <div style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: "4px 10px" }}>
              {busy ? <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink .8s ease infinite" }} /> Rendering</> : <><Icon name="check" size={12} stroke={3} /> {result ? "Ready" : "Idle"}</>}
            </span>
            <span className="ab-mono" style={{ color: "var(--t-3)" }}>{cfg.canvasMeta}</span>
            <div style={{ flex: 1 }} />
            {result && <button onClick={() => downloadDataUrl(result, `${cfg.active}.png`)} className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> Save</button>}
          </div>
          <div style={{ flex: 1, minHeight: "calc(100dvh - 116px)", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 36, position: "relative", backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px", overflow: "hidden" }}>
            {busy ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, color: "var(--t-2)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid var(--bg-3)", borderTopColor: "var(--acc)", animation: "ab-spin .7s linear infinite" }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Generating…</div>
                <div className="ab-mono" style={{ fontSize: 11, color: "var(--t-3)" }}>Nano Banana Pro · up to ~60s</div>
              </div>
            ) : result || image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result ?? image!.dataUrl} alt="result" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: 14, border: "1px solid var(--border-mid)", boxShadow: "var(--sh-2)" }} />
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ textAlign: "center", color: "var(--t-3)", cursor: "pointer", maxWidth: 320 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "var(--acc)" }}><Icon name="image" size={28} /></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t-1)" }}>Upload {cfg.sourceLabel.toLowerCase()} to start</div>
                <div className="ab-body" style={{ fontSize: 13, marginTop: 6 }}>Pick your options on the left, then hit Generate.</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT variations + export */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>Variations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const v = variations[i];
              return (
                <div key={i} onClick={() => v && setResult(v)} style={{ aspectRatio: cfg.ratio || "3/4", borderRadius: 11, background: "var(--bg-2)", border: v && v === result ? "2px solid var(--acc)" : "1px solid var(--border-mid)", position: "relative", overflow: "hidden", cursor: v ? "pointer" : "default" }}>
                  {v ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v} alt={`Variation ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, var(--border) 0 1px, transparent 1px 8px)" }} />
                  )}
                  <span style={{ position: "absolute", bottom: 6, left: 6, fontFamily: "var(--font-mono)", fontSize: 9, color: "oklch(1 0 0 / 0.8)", background: "oklch(0 0 0 / 0.4)", padding: "1px 5px", borderRadius: 4 }}>0{i + 1}</span>
                </div>
              );
            })}
          </div>
          <button onClick={generate} disabled={busy || !image} className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm" style={{ marginTop: 12, opacity: busy || !image ? 0.5 : 1 }}><Icon name="sparkle" size={14} /> Regenerate</button>
          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>Export</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cfg.exports.map(([m, s]) => (
              <div key={m} onClick={() => result && downloadDataUrl(result, `${m.toLowerCase()}-${cfg.active}.png`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", cursor: result ? "pointer" : "default", opacity: result ? 1 : 0.55 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-2)" }}><Icon name="image" size={15} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div><div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10 }}>{s}</div></div>
                <Icon name="download" size={16} style={{ color: "var(--t-3)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => result && downloadDataUrl(result, `${cfg.active}-hd.png`)} disabled={!result} className="ab-btn ab-btn-primary ab-btn-full" style={{ marginTop: 14, opacity: result ? 1 : 0.5 }}><Icon name="download" size={16} stroke={2} /> Download HD</button>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="share" size={15} /> Share</button>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="heart" size={15} /> Save</button>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
