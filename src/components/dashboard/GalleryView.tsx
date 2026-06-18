"use client";

import { useState } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";

const HEIGHTS = [300, 240, 280, 320, 240, 300, 260, 240, 320, 280, 300, 240, 280, 260, 300];
const TYPES = ["Infographic", "Interior", "Mockup", "Pattern", "Background"];
const STYLES = ["Glass", "Boutique", "Flagship", "Bold", "Studio", "Minimal"];
const TONES = ["oklch(0.34 0.07 200)", "oklch(0.33 0.06 130)", "oklch(0.32 0.07 300)", "oklch(0.34 0.08 70)", "oklch(0.36 0.08 25)"];
const FILTERS = ["All", "Infographics", "Interiors", "Mockups", "Backgrounds", "Patterns"];
const STATS: [string, string, boolean?][] = [
  ["238", "Total generations"],
  ["96%", "Success rate", true],
  ["54", "Saved & exported"],
  ["1,240", "Credits used"],
];

export default function GalleryView() {
  const [filter, setFilter] = useState("All");
  const items = Array.from({ length: 15 }).map((_, i) => ({
    h: HEIGHTS[i],
    type: TYPES[i % 5],
    style: STYLES[i % 6],
    tone: TONES[i % 5],
    when: i < 3 ? "Today" : i < 7 ? "Yesterday" : `${i - 4}d ago`,
  }));
  const shown = filter === "All" ? items : items.filter((it) => `${it.type}s` === filter || it.type === filter);

  return (
    <DashFrame active="gallery" title="Gallery / History">
      <div style={{ padding: 24 }}>
        {/* stats */}
        <div className="ab-dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {STATS.map(([v, l, acc], i) => (
            <div key={i} className="ab-card" style={{ padding: 18 }}>
              <div className="ab-eyebrow" style={{ fontSize: 10, color: acc ? "var(--acc)" : "var(--t-3)" }}>{l}</div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 6, color: acc ? "var(--acc)" : "var(--t-1)" }}>{v}</div>
            </div>
          ))}
        </div>
        {/* filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, padding: 4, flexWrap: "wrap" }}>
            {FILTERS.map((t) => (
              <span key={t} onClick={() => setFilter(t)} style={{ padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", background: t === filter ? "var(--bg-3)" : "transparent", color: t === filter ? "var(--t-1)" : "var(--t-3)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="filter" size={15} /> Style</button>
            <button style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--t-1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="grid" size={17} /></button>
          </div>
        </div>
        {/* masonry */}
        <div className="ab-dash-masonry" style={{ columnCount: 5, columnGap: 16 }}>
          {shown.map((it, i) => (
            <div key={i} style={{ breakInside: "avoid", marginBottom: 16, borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative", cursor: "pointer" }}>
              <div style={{ height: it.h, background: it.tone, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)" }} />
                <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.4)", backdropFilter: "blur(8px)", padding: "3px 8px", borderRadius: 100 }}>{it.type.toUpperCase()}</div>
                <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "oklch(1 0 0 / 0.92)" }}>{it.style}</span>
                  <span className="ab-mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.7)" }}>{it.when}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashFrame>
  );
}
