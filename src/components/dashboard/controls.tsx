"use client";

import { useState } from "react";
import { Icon } from "@/components/landing/ui";

/** Controlled when `value`/`onChange` are passed, otherwise self-managed. */
function useSelect(def: number, value?: number, onChange?: (i: number) => void) {
  const [internal, setInternal] = useState(def);
  const sel = value ?? internal;
  const set = (i: number) => { if (onChange) onChange(i); else setInternal(i); };
  return [sel, set] as const;
}

export function PresetGrid({ items, cols = 3, def = 0, value, onChange }: { items: { t: string; tone: string }[]; cols?: number; def?: number; value?: number; onChange?: (i: number) => void }) {
  const [sel, set] = useSelect(def, value, onChange);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {items.map((it, i) => (
        <button key={i} onClick={() => set(i)} style={{ borderRadius: 11, overflow: "hidden", border: `1.5px solid ${sel === i ? "var(--acc)" : "var(--border)"}`, cursor: "pointer", background: "var(--bg-1)", padding: 0 }}>
          <div style={{ height: 50, background: it.tone, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.07) 0 1px, transparent 1px 6px)" }} />
            {sel === i && <div style={{ position: "absolute", top: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} stroke={3} /></div>}
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 600, padding: "6px 4px", color: sel === i ? "var(--t-1)" : "var(--t-3)" }}>{it.t}</div>
        </button>
      ))}
    </div>
  );
}

export function ChipRow({ items, def = 0, value, onChange }: { items: string[]; def?: number; value?: number; onChange?: (i: number) => void }) {
  const [sel, set] = useSelect(def, value, onChange);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((it, i) => (
        <button key={i} onClick={() => set(i)} className={sel === i ? "ab-chip ab-chip-acc" : "ab-chip"} style={{ cursor: "pointer", padding: "8px 14px" }}>{it}</button>
      ))}
    </div>
  );
}

export function SegRow({ items, def = 1, value, onChange }: { items: string[]; def?: number; value?: number; onChange?: (i: number) => void }) {
  const [sel, set] = useSelect(def, value, onChange);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8 }}>
      {items.map((it, i) => (
        <button key={i} onClick={() => set(i)} style={{ height: 44, borderRadius: 10, border: `1px solid ${sel === i ? "var(--acc)" : "var(--border)"}`, background: sel === i ? "var(--acc-soft)" : "var(--bg-1)", color: sel === i ? "var(--acc)" : "var(--t-2)", fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{it}</button>
      ))}
    </div>
  );
}

export function Toggle({ on: defOn = false }: { on?: boolean }) {
  const [on, setOn] = useState(defOn);
  return (
    <button onClick={() => setOn((o) => !o)} aria-pressed={on} style={{ width: 42, height: 24, borderRadius: 100, border: "none", cursor: "pointer", background: on ? "var(--acc)" : "var(--bg-3)", position: "relative", transition: "background .15s ease", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: on ? "var(--acc-ink)" : "var(--t-2)", transition: "left .15s ease" }} />
    </button>
  );
}
