"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { resizeAndEncodeImage, downloadDataUrl, type InlineImage } from "./lib";
import type { InfographicStyle } from "@/lib/infographicStyles";

// design preset → real infographic style id
const PRESETS: { t: string; tone: string; style: InfographicStyle }[] = [
  { t: "Glass", tone: "oklch(0.34 0.07 200)", style: "glass" },
  { t: "Cards", tone: "oklch(0.36 0.08 25)", style: "cards" },
  { t: "Flagship", tone: "oklch(0.32 0.07 300)", style: "flagship" },
  { t: "Bold", tone: "oklch(0.34 0.09 340)", style: "vivid" },
  { t: "Minimal", tone: "oklch(0.3 0.03 250)", style: "studio" },
  { t: "Boutique", tone: "oklch(0.33 0.06 130)", style: "luxury" },
];
const RATIOS = ["1:1", "3:4", "4:3", "9:16"] as const;
const LANGS: Record<string, "en" | "ru" | "uz"> = { UZ: "uz", RU: "ru", EN: "en" };
const MAX_IMAGES = 4;

const EXPORTS: [string, string][] = [
  ["Uzum", "1024×1365"],
  ["Wildberries", "900×1200"],
  ["Ozon", "1000×1000"],
  ["Yandex", "1080×1440"],
];

export default function Workspace() {
  const [images, setImages] = useState<InlineImage[]>([]);
  const [preset, setPreset] = useState(0);
  const [ratio, setRatio] = useState<(typeof RATIOS)[number]>("3:4");
  const [advOpen, setAdvOpen] = useState(false);
  const [lang, setLang] = useState("UZ");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [variations, setVariations] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`Up to ${MAX_IMAGES} images.`);
      return;
    }
    try {
      const next: InlineImage[] = [];
      for (const f of list.slice(0, remaining)) next.push(await resizeAndEncodeImage(f));
      setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read image");
    }
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  async function generate() {
    if (!images.length) {
      setError("Upload a product image first.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map(({ base64, mimeType }) => ({ base64, mimeType })),
          aspectRatio: ratio,
          style: PRESETS[preset].style,
          language: LANGS[lang],
        }),
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

  const statusText = `${PRESETS[preset].t} · ${ratio} · ${lang}`;

  return (
    <DashFrame active="infographics" title="Marketplace Infographics">
      <div className="ab-dash-cols" style={{ display: "grid", gridTemplateColumns: "316px 1fr 296px", minHeight: "100%" }}>
        {/* LEFT — controls */}
        <div style={{ borderRight: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · Source image{images.length ? ` · ${images.length}/${MAX_IMAGES}` : ""}</div>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{ aspectRatio: "4/3", borderRadius: 14, border: "1.5px dashed var(--border-strong)", background: "var(--bg-1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--t-2)", position: "relative", overflow: "hidden", cursor: "pointer" }}
          >
            {images[0] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0].dataUrl} alt="source" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, oklch(0 0 0 / 0.5))" }} />
                <span style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", gap: 6 }}>
                  {images.map((im, i) => (
                    <span key={i} style={{ position: "relative", width: 30, height: 30, borderRadius: 7, overflow: "hidden", border: "1.5px solid oklch(1 0 0 / 0.5)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={im.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </span>
                  ))}
                  {images.length < MAX_IMAGES && <span style={{ width: 30, height: 30, borderRadius: 7, border: "1.5px dashed oklch(1 0 0 / 0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(1 0 0 / 0.9)" }}><Icon name="plus" size={14} /></span>}
                </span>
              </>
            ) : (
              <>
                <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", top: "40%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1 }} />
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><Icon name="upload" size={24} stroke={2} /></div>
                <div style={{ fontSize: 13.5, fontWeight: 600, position: "relative" }}>Drop or browse</div>
                <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10.5, position: "relative" }}>JPG · PNG · WEBP · up to 4</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onInput} />

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>02 · Style preset</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {PRESETS.map((pr, i) => (
              <button key={pr.t} onClick={() => setPreset(i)} style={{ borderRadius: 11, overflow: "hidden", border: `1.5px solid ${preset === i ? "var(--acc)" : "var(--border)"}`, cursor: "pointer", background: "var(--bg-1)", padding: 0 }}>
                <div style={{ height: 52, background: pr.tone, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.07) 0 1px, transparent 1px 6px)" }} />
                  {preset === i && <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} stroke={3} /></div>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: "6px 4px", color: preset === i ? "var(--t-1)" : "var(--t-3)" }}>{pr.t}</div>
              </button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>03 · Aspect ratio</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {RATIOS.map((r) => (
              <button key={r} onClick={() => setRatio(r)} style={{ height: 60, borderRadius: 10, border: `1px solid ${ratio === r ? "var(--acc)" : "var(--border)"}`, background: ratio === r ? "var(--acc-soft)" : "var(--bg-1)", color: ratio === r ? "var(--acc)" : "var(--t-2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
                <div style={{ width: r === "1:1" ? 16 : r === "9:16" ? 11 : 14, height: r === "1:1" ? 16 : r === "9:16" ? 20 : 14, border: "1.4px solid currentColor", borderRadius: 2 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>{r}</span>
              </button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>04 · On-image text language</div>
          <div style={{ display: "flex", gap: 6, padding: 4, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 11 }}>
            {["UZ", "RU", "EN"].map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, background: lang === l ? "var(--acc)" : "transparent", color: lang === l ? "var(--acc-ink)" : "var(--t-3)" }}>{l}</button>
            ))}
          </div>

          <button onClick={() => setAdvOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, padding: "12px 0", background: "none", border: "none", borderTop: "1px solid var(--border)", cursor: "pointer", color: "var(--t-2)" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Advanced options</span>
            <Icon name="chevron-down" size={16} style={{ transform: advOpen ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} />
          </button>
          {advOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
              {[["Variants", "1"], ["Quality", "HD"], ["Seed", "Random"], ["Model", "Nano Banana Pro"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "var(--t-3)" }}>{k}</span>
                  <span style={{ color: "var(--t-1)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={generate} disabled={busy} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 20, opacity: busy ? 0.7 : 1 }}>
            {busy ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Generating…</> : <><Icon name="sparkle-fill" size={18} /> Generate · 10 credits</>}
          </button>
          {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "oklch(0.7 0.21 22 / 0.12)", border: "1px solid oklch(0.7 0.21 22 / 0.4)", color: "var(--err)", fontSize: 12.5 }}>{error}</div>}
        </div>

        {/* CENTER — canvas */}
        <div className="ab-canvas-col" style={{ display: "flex", flexDirection: "column", minWidth: 0, alignSelf: "start", position: "sticky", top: 0, height: "calc(100dvh - 64px)" }}>
          <div style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: "4px 10px" }}>
              {busy ? <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink .8s ease infinite" }} /> Rendering</> : <><Icon name="check" size={12} stroke={3} /> {result ? "Ready" : "Idle"}</>}
            </span>
            <span className="ab-mono" style={{ color: "var(--t-3)" }}>{statusText}</span>
            <div style={{ flex: 1 }} />
            {result && <button onClick={() => downloadDataUrl(result, "infographic.png")} className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> Save</button>}
          </div>
          <div style={{ flex: 1, minHeight: "calc(100dvh - 116px)", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 36, position: "relative", backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px", overflow: "hidden" }}>
            {busy ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, color: "var(--t-2)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid var(--bg-3)", borderTopColor: "var(--acc)", animation: "ab-spin .7s linear infinite" }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Generating infographic…</div>
                <div className="ab-mono" style={{ fontSize: 11, color: "var(--t-3)" }}>Nano Banana Pro · up to ~60s</div>
              </div>
            ) : result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result} alt="Generated infographic" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: 14, border: "1px solid var(--border-mid)", boxShadow: "var(--sh-2)" }} />
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ textAlign: "center", color: "var(--t-3)", cursor: "pointer", maxWidth: 320 }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "var(--acc)" }}><Icon name="image" size={28} /></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t-1)" }}>Upload a product photo to start</div>
                <div className="ab-body" style={{ fontSize: 13, marginTop: 6 }}>Pick a style and aspect ratio, then hit Generate. The AI reads the product from your photos.</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — variations + export */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>Variations</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const v = variations[i];
              return (
                <div key={i} onClick={() => v && setResult(v)} style={{ aspectRatio: "3/4", borderRadius: 11, background: "var(--bg-2)", border: v && v === result ? "2px solid var(--acc)" : "1px solid var(--border-mid)", position: "relative", overflow: "hidden", cursor: v ? "pointer" : "default" }}>
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
          <button onClick={generate} disabled={busy || !images.length} className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm" style={{ marginTop: 12, opacity: busy || !images.length ? 0.5 : 1 }}><Icon name="sparkle" size={14} /> Regenerate</button>

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>Export</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EXPORTS.map(([m, s]) => (
              <div key={m} onClick={() => result && downloadDataUrl(result, `${m.toLowerCase()}-infographic.png`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", cursor: result ? "pointer" : "default", opacity: result ? 1 : 0.55 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-2)" }}><Icon name="image" size={15} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div>
                  <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10 }}>{s}</div>
                </div>
                <Icon name="download" size={16} style={{ color: "var(--t-3)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => result && downloadDataUrl(result, "infographic-hd.png")} disabled={!result} className="ab-btn ab-btn-primary ab-btn-full" style={{ marginTop: 14, opacity: result ? 1 : 0.5 }}><Icon name="download" size={16} stroke={2} /> Download HD</button>
        </div>
      </div>
    </DashFrame>
  );
}
