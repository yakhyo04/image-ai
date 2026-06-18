"use client";

import { useState } from "react";
import { Section, SectionHead } from "./ui";

const ITEMS = [
  { h: 300, label: "Infographic", style: "Glass", tone: "oklch(0.34 0.07 200)", group: "Infographics" },
  { h: 220, label: "Interior", style: "Boutique", tone: "oklch(0.33 0.06 130)", group: "Interiors" },
  { h: 260, label: "Mockup", style: "Flagship", tone: "oklch(0.32 0.07 300)", group: "Mockups" },
  { h: 240, label: "Lifestyle", style: "Cards", tone: "oklch(0.36 0.08 25)", group: "Mockups" },
  { h: 300, label: "Pattern", style: "Textile", tone: "oklch(0.34 0.08 70)", group: "Patterns" },
  { h: 220, label: "Background", style: "Studio", tone: "oklch(0.32 0.05 250)", group: "Mockups" },
  { h: 260, label: "Infographic", style: "Bold", tone: "oklch(0.34 0.09 340)", group: "Infographics" },
  { h: 240, label: "Interior", style: "Minimal", tone: "oklch(0.3 0.04 200)", group: "Interiors" },
];

const TABS = ["All", "Infographics", "Interiors", "Mockups", "Patterns"];

export default function Gallery() {
  const [tab, setTab] = useState("All");
  const shown = tab === "All" ? ITEMS : ITEMS.filter((i) => i.group === tab);

  return (
    <Section id="gallery">
      <div className="ab-gallery-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
        <SectionHead tag="Gallery" title="Made with Artboard" sub="Real outputs across every tool and style preset." />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={t === tab ? "ab-chip ab-chip-acc" : "ab-chip"} style={{ cursor: "pointer" }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="ab-gallery-cols" style={{ columnCount: 4, columnGap: 18 }}>
        {shown.map((it, i) => (
          <div key={`${it.label}-${it.style}-${i}`} style={{ breakInside: "avoid", marginBottom: 18, borderRadius: 16, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative", cursor: "pointer" }}>
            <div style={{ height: it.h, background: it.tone, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)" }} />
              <div className="ab-glow" style={{ width: 160, height: 100, background: "oklch(1 0 0)", top: -40, right: -20, opacity: 0.06 }} />
              <div style={{ position: "absolute", top: 12, left: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.4)", backdropFilter: "blur(8px)", padding: "4px 9px", borderRadius: 100 }}>{it.label.toUpperCase()}</div>
              <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "oklch(1 0 0 / 0.92)" }}>{it.style}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
