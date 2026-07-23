"use client";

import { useState } from "react";
import { Section, Icon } from "./ui";
import { useDict } from "@/i18n/context";

const PRESETS = ["Infographic", "Lifestyle", "Studio", "Interior"] as const;
const TONES = ["oklch(0.34 0.07 200)", "oklch(0.36 0.08 25)", "oklch(0.3 0.03 250)", "oklch(0.33 0.06 130)"];
const PRESET_ICONS = ["sliders", "sparkle-fill", "image", "sofa"];

export default function TryItLive() {
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const t = useDict();
  const run = () => { setBusy(true); setTimeout(() => setBusy(false), 1600); };

  return (
    <Section id="demo">
      <div className="ab-card" style={{ borderRadius: 28, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative" }}>
        <div className="ab-glow" style={{ width: 420, height: 300, background: "var(--acc)", top: -120, left: "30%", opacity: 0.08 }} />
        <div className="ab-demo-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: 460 }}>
          {/* control panel */}
          <div className="ab-demo-panel" style={{ padding: 32, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <div className="ab-chip ab-chip-acc" style={{ alignSelf: "flex-start", marginBottom: 20 }}><Icon name="magic" size={12} /> {t.tryItLive.badge}</div>
            <div className="ab-h3" style={{ fontSize: 24 }}>{t.tryItLive.title}</div>
            <div className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>{t.tryItLive.sub}</div>

            <div className="ab-eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>{t.tryItLive.stylePreset}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {PRESETS.map((pre, i) => (
                <button key={pre} onClick={() => setSel(i)} style={{
                  padding: "14px 12px", borderRadius: 13, textAlign: "left", cursor: "pointer",
                  background: sel === i ? "var(--acc-soft)" : "var(--bg-2)",
                  border: `1.5px solid ${sel === i ? "var(--acc)" : "var(--border)"}`,
                  color: sel === i ? "var(--acc)" : "var(--t-2)", transition: "all .15s ease",
                }}>
                  <Icon name={PRESET_ICONS[i]} size={18} />
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{t.tryItLive.presets[pre]}</div>
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minHeight: 28 }} />
            <button onClick={run} disabled={busy} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 28 }}>
              {busy ? (
                <><span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid var(--acc-ink)", borderTopColor: "transparent", display: "inline-block", animation: "ab-spin .7s linear infinite" }} /> {t.tryItLive.generating}</>
              ) : (
                <><Icon name="sparkle-fill" size={17} /> {t.tryItLive.generate}</>
              )}
            </button>
          </div>
          {/* preview */}
          <div style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ width: "100%", maxWidth: 460, aspectRatio: "4/3", borderRadius: 18, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative", background: TONES[sel], transition: "background .4s ease" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 11px)" }} />
              <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "40%", height: "78%", borderRadius: "46% 46% 0 0 / 26% 26% 0 0", background: "radial-gradient(ellipse at 50% 28%, oklch(1 0 0 / 0.18), transparent)" }} />
              {busy && <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, background: "var(--acc)", boxShadow: "0 0 20px var(--acc)", animation: "ab-blink 0.8s ease infinite" }} />}
              <div style={{ position: "absolute", top: 14, left: 14, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: busy ? "var(--acc)" : "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.45)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 100, fontWeight: 600 }}>
                {busy ? t.tryItLive.rendering : `${t.tryItLive.presets[PRESETS[sel]].toUpperCase()} · ${t.tryItLive.ready}`}
              </div>
              <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", gap: 7 }}>
                <button style={{ width: 36, height: 36, borderRadius: 10, background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(8px)", border: "1px solid oklch(1 0 0 / 0.15)", color: "oklch(1 0 0 / 0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="download" size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
