"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  height?: number;
  beforeLabel?: string;
  afterLabel?: string;
  radius?: number;
  beforeTone?: string;
  afterTone?: string;
};

export default function BeforeAfter({
  height = 360,
  beforeLabel = "Plain product",
  afterLabel = "Generated",
  radius = 18,
  beforeTone = "var(--bg-2)",
  afterTone,
}: Props) {
  const [pos, setPos] = useState(52);
  const [width, setWidth] = useState(600);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const measure = () => ref.current && setWidth(ref.current.offsetWidth);
    measure();
    const mm = (e: MouseEvent | TouchEvent) => {
      if (!drag.current) return;
      const x = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      if (x != null) move(x);
    };
    const mu = () => { drag.current = false; };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", mm);
    window.addEventListener("touchend", mu);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", mm);
      window.removeEventListener("touchend", mu);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: "100%", height, borderRadius: radius, overflow: "hidden", border: "1px solid var(--border-mid)", cursor: "ew-resize", userSelect: "none" }}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; move(e.touches[0].clientX); }}
    >
      {/* AFTER (full, underneath) */}
      <div style={{ position: "absolute", inset: 0, background: afterTone || "linear-gradient(150deg, oklch(0.42 0.12 25), oklch(0.26 0.06 25))" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 10px)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "44%", height: "84%", borderRadius: "48% 48% 0 0 / 28% 28% 0 0", background: "radial-gradient(ellipse at 50% 28%, oklch(0.3 0.08 25), oklch(0.2 0.04 25))", opacity: 0.9 }} />
        <div className="ab-glow" style={{ width: 240, height: 130, background: "var(--v-amber)", top: "-6%", left: "50%", transform: "translateX(-50%)", opacity: 0.25 }} />
        <span style={{ position: "absolute", bottom: 12, right: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--acc)", background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(8px)", padding: "4px 9px", borderRadius: 100, fontWeight: 600 }}>{afterLabel.toUpperCase()}</span>
      </div>
      {/* BEFORE (clipped) */}
      <div style={{ position: "absolute", inset: 0, width: `${pos}%`, overflow: "hidden", borderRight: "2px solid var(--acc)" }}>
        <div style={{ position: "absolute", inset: 0, width, background: beforeTone, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.04) 0 1px, transparent 1px 12px)" }} />
          <div style={{ position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)", width: "38%", height: "60%", borderRadius: 12, background: "oklch(0.32 0.01 264)", border: "1px solid var(--border-mid)" }} />
          <span style={{ position: "absolute", bottom: 12, left: 12, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--t-2)", background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(8px)", padding: "4px 9px", borderRadius: 100 }}>{beforeLabel.toUpperCase()}</span>
        </div>
      </div>
      {/* handle */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, transform: "translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px oklch(0 0 0 / 0.4)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
        </div>
      </div>
    </div>
  );
}
