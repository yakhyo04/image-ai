"use client";

import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";

const STEPS: { l: string; done?: boolean; loading?: boolean; pending?: boolean; eta?: string }[] = [
  { l: "Image analyzed", done: true },
  { l: "Subject isolated", done: true },
  { l: "Composing infographic layout", loading: true, eta: "~14s" },
  { l: "Rendering text · UZ", pending: true },
  { l: "Upscaling to HD", pending: true },
];

export default function Progress() {
  return (
    <DashFrame active="infographics" title="Generating…">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 760, padding: 40, position: "relative" }}>
        <div className="ab-glow" style={{ width: 460, height: 460, background: "var(--acc)", top: "20%", left: "42%", opacity: 0.12 }} />
        <div className="ab-dash-progress" style={{ display: "grid", gridTemplateColumns: "440px 380px", gap: 36, position: "relative", maxWidth: "100%" }}>
          {/* preview */}
          <div style={{ aspectRatio: "3/4", borderRadius: 22, border: "1px solid var(--border-mid)", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, oklch(0.4 0.07 200) 0%, oklch(0.4 0.07 200) 58%, oklch(0.24 0.04 200) 100%)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "58%", background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.08) 0 1px, transparent 1px 9px)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "58%", height: 3, background: "var(--acc)", boxShadow: "0 0 16px var(--acc), 0 0 36px var(--acc-line)" }} />
            <div style={{ position: "absolute", top: 14, left: 14, padding: "6px 11px", borderRadius: 100, background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(8px)", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--acc)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink 0.8s ease infinite" }} />RENDER · 58%
            </div>
            <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div className="ab-mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.6)" }}>GLASS · 3:4</div>
              <div className="ab-mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--acc)" }}>00:46</div>
            </div>
          </div>
          {/* steps */}
          <div>
            <div className="ab-chip ab-chip-acc" style={{ marginBottom: 18 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink 1s ease infinite" }} /> Processing · no queue</div>
            <div className="ab-h3" style={{ fontSize: 26 }}>Building your infographic</div>
            <div className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>This usually takes under a minute. We’ll notify you when all four variants are ready.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", borderRadius: 13, background: s.done || s.loading ? "var(--bg-1)" : "transparent", border: "1px solid var(--border)", opacity: s.pending ? 0.45 : 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.done ? "var(--acc)" : "transparent", border: s.loading ? "2px solid var(--acc)" : s.pending ? "1px solid var(--border-mid)" : "none", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.done ? <Icon name="check" size={13} stroke={3} /> : s.loading ? <div style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid var(--acc)", borderTopColor: "transparent", animation: "ab-spin .7s linear infinite" }} /> : null}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{s.l}</span>
                  {s.eta && <span className="ab-mono" style={{ color: "var(--acc)", fontSize: 12 }}>{s.eta}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                <span style={{ color: "var(--t-2)", fontWeight: 600 }}>Overall</span>
                <span className="ab-mono" style={{ color: "var(--acc)", fontWeight: 700 }}>58%</span>
              </div>
              <div style={{ height: 8, borderRadius: 100, background: "var(--bg-3)", overflow: "hidden" }}>
                <div style={{ width: "58%", height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--acc-2), var(--acc))" }} />
              </div>
            </div>
            <Link href="/dashboard" className="ab-btn ab-btn-ghost" style={{ marginTop: 16 }}>Back to workspace</Link>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
