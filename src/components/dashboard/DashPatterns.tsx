"use client";

import { useState, type CSSProperties } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { ChipRow, SegRow } from "./controls";
import { downloadDataUrl } from "./lib";

/** CSS-only pattern tile so empty/placeholder previews read as a real repeat. */
function patternBg(hue: number, light = 0.42): CSSProperties {
  return {
    backgroundColor: `oklch(${light} 0.08 ${hue})`,
    backgroundImage: [
      `radial-gradient(circle at 25% 25%, oklch(0.92 0.18 ${hue} / 0.55) 0 5px, transparent 6px)`,
      `radial-gradient(circle at 75% 75%, oklch(0.92 0.18 ${hue} / 0.55) 0 5px, transparent 6px)`,
      `radial-gradient(circle at 75% 25%, oklch(0.2 0.04 ${hue} / 0.5) 0 3px, transparent 4px)`,
      `radial-gradient(circle at 25% 75%, oklch(0.2 0.04 ${hue} / 0.5) 0 3px, transparent 4px)`,
      `linear-gradient(45deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 8px)`,
    ].join(","),
    backgroundSize: "48px 48px, 48px 48px, 48px 48px, 48px 48px, 48px 48px",
  };
}

const MOTIFS = [
  { label: "Folk", hue: 25 }, { label: "Floral", hue: 70 }, { label: "Geometric", hue: 200 },
  { label: "Abstract", hue: 320 }, { label: "Tropical", hue: 140 }, { label: "Damask", hue: 280 },
];
const PALETTES = ["Terracotta", "Cream", "Sage", "Indigo", "Mono"];
const SCALES = ["Dense", "Medium", "Large"];
const QUICK = ["Seamless", "Hand-drawn", "Bold lines"];
const EXPORTS: [string, string][] = [
  ["Tile · PNG", "512×512"], ["Vector · SVG", "Repeat-ready"], ["Print sheet", "4096×4096"], ["Fabric repeat", "+ metadata"],
];

function TileSwatch({ hue, sel, onClick, label }: { hue: number; sel: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ borderRadius: 11, overflow: "hidden", border: `1.5px solid ${sel ? "var(--acc)" : "var(--border)"}`, cursor: "pointer", background: "var(--bg-1)", padding: 0 }}>
      <div style={{ height: 50, position: "relative", ...patternBg(hue) }}>
        {sel && <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} stroke={3} /></div>}
      </div>
      <div style={{ fontSize: 10.5, fontWeight: 600, padding: "6px 4px", color: sel ? "var(--t-1)" : "var(--t-3)" }}>{label}</div>
    </button>
  );
}

export default function DashPatterns() {
  const [desc, setDesc] = useState("Folk floral, terracotta & cream, small repeating blossoms with fine line stems");
  const [motif, setMotif] = useState(0);
  const [palette, setPalette] = useState(0);
  const [scale, setScale] = useState(1);
  const [ways, setWays] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [tiles, setTiles] = useState<string[]>([]);

  const hue = MOTIFS[motif].hue;
  const tilePx = [34, 48, 72][scale];

  function addQuick(q: string) {
    setDesc((d) => (d.toLowerCase().includes(q.toLowerCase()) ? d : `${d ? d + ", " : ""}${q.toLowerCase()}`).slice(0, 200));
  }

  async function generate() {
    const prompt =
      `Generate a seamless, perfectly tileable repeating ${MOTIFS[motif].label.toLowerCase()} surface pattern. ` +
      `${desc.trim()}. Palette: ${PALETTES[palette].toLowerCase()}. Motif scale: ${SCALES[scale].toLowerCase()} density. ` +
      `The tile MUST repeat edge-to-edge with no visible seams — the top edge matches the bottom and the left edge matches the right. ` +
      `Flat 2D surface-pattern design for textiles and packaging — no mockup, no 3D, no perspective, no text or watermark. ` +
      `Output a single square tile.`;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
      setResult(dataUrl);
      setTiles((prev) => [dataUrl, ...prev].slice(0, 6));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashFrame active="patterns" title="Pattern Design">
      <div className="ab-dash-cols" style={{ display: "grid", gridTemplateColumns: "316px 1fr 296px", minHeight: "100%" }}>
        {/* LEFT controls */}
        <div style={{ borderRight: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · Describe a motif</div>
          <div style={{ borderRadius: 13, border: "1px solid var(--border-mid)", background: "var(--bg-1)", padding: 14 }}>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="Describe the motif — e.g. folk floral, terracotta & cream, small blossoms…"
              style={{ width: "100%", resize: "none", border: "none", outline: "none", background: "transparent", color: "var(--t-1)", fontSize: 14, lineHeight: 1.5, fontFamily: "var(--font)" }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
              <button onClick={() => addQuick("seamless repeat")} className="ab-chip" style={{ padding: "5px 10px", fontSize: 11, cursor: "pointer" }}><Icon name="wand" size={12} /> Suggest</button>
              <div style={{ flex: 1 }} />
              <span className="ab-mono" style={{ color: "var(--t-4)", fontSize: 10 }}>{desc.length} / 200</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {QUICK.map((p) => <button key={p} onClick={() => addQuick(p)} className="ab-chip" style={{ padding: "6px 11px", fontSize: 11, cursor: "pointer" }}>{p}</button>)}
          </div>

          <div className="ab-eyebrow" style={{ margin: "22px 0 10px" }}>02 · Motif style</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {MOTIFS.map((m, i) => <TileSwatch key={i} hue={m.hue} label={m.label} sel={motif === i} onClick={() => setMotif(i)} />)}
          </div>

          <div className="ab-eyebrow" style={{ margin: "22px 0 10px" }}>03 · Palette</div>
          <ChipRow items={PALETTES} value={palette} onChange={setPalette} />

          <div className="ab-eyebrow" style={{ margin: "22px 0 10px" }}>04 · Scale & density</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {SCALES.map((s, i) => (
              <button key={s} onClick={() => setScale(i)} style={{ height: 44, borderRadius: 10, border: `1px solid ${scale === i ? "var(--acc)" : "var(--border)"}`, background: scale === i ? "var(--acc-soft)" : "var(--bg-1)", color: scale === i ? "var(--acc)" : "var(--t-2)", fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{s}</button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: "22px 0 10px" }}>05 · Colorways</div>
          <SegRow items={["1", "3", "6"]} value={ways} onChange={setWays} />

          <button onClick={generate} disabled={busy} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 20, opacity: busy ? 0.7 : 1 }}>
            {busy ? <><span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> Generating…</> : <><Icon name="sparkle-fill" size={18} /> Generate · 4 credits</>}
          </button>
          {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "oklch(0.7 0.21 22 / 0.12)", border: "1px solid oklch(0.7 0.21 22 / 0.4)", color: "var(--err)", fontSize: 12.5 }}>{error}</div>}
        </div>

        {/* CENTER — seamless tile canvas */}
        <div className="ab-canvas-col" style={{ display: "flex", flexDirection: "column", minWidth: 0, alignSelf: "start", position: "sticky", top: 0, height: "calc(100dvh - 64px)" }}>
          <div style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: "4px 10px" }}>
              {busy ? <><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink .8s ease infinite" }} /> Rendering</> : <><Icon name="check" size={12} stroke={3} /> Seamless</>}
            </span>
            <span className="ab-mono" style={{ color: "var(--t-3)" }}>{MOTIFS[motif].label} · tile 512px · repeat ∞</span>
            <div style={{ flex: 1 }} />
            {result && <button onClick={() => downloadDataUrl(result, "pattern-tile.png")} className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> Save</button>}
          </div>
          <div style={{ flex: 1, minHeight: "calc(100dvh - 116px)", minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 36, position: "relative", backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "22px 22px", overflow: "hidden" }}>
            {busy ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, color: "var(--t-2)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid var(--bg-3)", borderTopColor: "var(--acc)", animation: "ab-spin .7s linear infinite" }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Weaving your tile…</div>
                <div className="ab-mono" style={{ fontSize: 11, color: "var(--t-3)" }}>Nano Banana Pro · up to ~60s</div>
              </div>
            ) : (
              <div
                style={{
                  width: 520, height: 520, maxWidth: "100%", maxHeight: "100%", borderRadius: 16, position: "relative", overflow: "hidden", border: "1px solid var(--border-mid)", boxShadow: "var(--sh-2)",
                  ...(result
                    ? { backgroundImage: `url(${result})`, backgroundSize: "33.34% 33.34%", backgroundRepeat: "repeat" }
                    : { backgroundColor: `oklch(0.42 0.08 ${hue})`, backgroundImage: patternBg(hue).backgroundImage, backgroundSize: `${tilePx}px ${tilePx}px, ${tilePx}px ${tilePx}px, ${tilePx}px ${tilePx}px, ${tilePx}px ${tilePx}px, ${tilePx}px ${tilePx}px` }),
                }}
              >
                <div style={{ position: "absolute", top: 24, left: 24, width: result ? "33.34%" : tilePx * 3, height: result ? "33.34%" : tilePx * 3, border: "1.5px dashed oklch(1 0 0 / 0.55)", borderRadius: 6 }}>
                  <span style={{ position: "absolute", top: -22, left: 0, fontFamily: "var(--font-mono)", fontSize: 10, color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.45)", padding: "2px 7px", borderRadius: 100 }}>1 REPEAT</span>
                </div>
                <div style={{ position: "absolute", bottom: 14, right: 14, fontFamily: "var(--font-mono)", fontSize: 10, color: "oklch(1 0 0 / 0.9)", background: "oklch(0 0 0 / 0.45)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 100 }}>{MOTIFS[motif].label.toUpperCase()} · SEAMLESS</div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — colorways + export */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>Colorways</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const t = tiles[i];
              return (
                <div
                  key={i}
                  onClick={() => t && setResult(t)}
                  style={{
                    aspectRatio: "1/1", borderRadius: 11, position: "relative", overflow: "hidden", cursor: t ? "pointer" : "default",
                    border: t && t === result ? "2px solid var(--acc)" : "1px solid var(--border-mid)",
                    ...(t
                      ? { backgroundImage: `url(${t})`, backgroundSize: "50% 50%", backgroundRepeat: "repeat" }
                      : { backgroundColor: `oklch(0.42 0.08 ${[25, 70, 200, 320, 140][i]})`, backgroundImage: patternBg([25, 70, 200, 320, 140][i]).backgroundImage, backgroundSize: "28px 28px,28px 28px,28px 28px,28px 28px,28px 28px", opacity: 0.5 }),
                  }}
                >
                  <span style={{ position: "absolute", bottom: 6, left: 6, fontFamily: "var(--font-mono)", fontSize: 9, color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.4)", padding: "1px 5px", borderRadius: 4 }}>0{i + 1}</span>
                </div>
              );
            })}
            <button onClick={generate} disabled={busy} style={{ aspectRatio: "1/1", borderRadius: 11, border: "1.5px dashed var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-3)", cursor: "pointer", background: "transparent" }}><Icon name="plus" size={18} /></button>
          </div>
          <button onClick={generate} disabled={busy} className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm" style={{ marginTop: 12, opacity: busy ? 0.5 : 1 }}><Icon name="sparkle" size={14} /> Regenerate</button>

          <div className="ab-eyebrow" style={{ margin: "24px 0 12px" }}>Export</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {EXPORTS.map(([m, s]) => (
              <div key={m} onClick={() => result && downloadDataUrl(result, `${m.split(" ")[0].toLowerCase()}-pattern.png`)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", cursor: result ? "pointer" : "default", opacity: result ? 1 : 0.55 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-2)" }}><Icon name="palette" size={15} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div><div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10 }}>{s}</div></div>
                <Icon name="download" size={16} style={{ color: "var(--t-3)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => result && downloadDataUrl(result, "pattern-tile-hd.png")} disabled={!result} className="ab-btn ab-btn-primary ab-btn-full" style={{ marginTop: 14, opacity: result ? 1 : 0.5 }}><Icon name="download" size={16} stroke={2} /> Download tile</button>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="share" size={15} /> Share</button>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="heart" size={15} /> Save</button>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
