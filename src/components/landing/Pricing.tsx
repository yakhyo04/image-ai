"use client";

import { useState } from "react";
import Link from "next/link";
import { Section, SectionHead, Icon } from "./ui";

const TIERS = [
  { name: "Starter", price: "0", unit: "/mo", desc: "For trying things out", credits: "30 credits / mo", save: undefined as string | undefined,
    feats: ["All 6 tools", "Standard quality", "720p exports", "Community support"] },
  { name: "Pro", price: "24", unit: "/mo", desc: "For active sellers", credits: "500 credits / mo", save: "Most popular",
    feats: ["Everything in Starter", "Priority generation · 2×", "HD & 4K exports", "Marketplace size presets", "Commercial license", "No watermark"] },
  { name: "Business", price: "79", unit: "/mo", desc: "For teams & agencies", credits: "2,000 credits / mo", save: undefined,
    feats: ["Everything in Pro", "5 team seats", "Brand kit & presets", "API access", "Dedicated support"] },
];

export default function Pricing() {
  const [sel, setSel] = useState(1); // Pro

  return (
    <Section id="pricing">
      <SectionHead center tag="Pricing" title="Plans that scale with your store" sub="Start free. Upgrade when you’re ready. Cancel anytime — pay with Click, Payme, or card." />
      <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 48, alignItems: "start" }}>
        {TIERS.map((t, i) => {
          const on = sel === i;
          return (
            <div
              key={t.name}
              onClick={() => setSel(i)}
              role="button"
              aria-pressed={on}
              style={{
                padding: 28, borderRadius: 24, position: "relative", cursor: "pointer",
                transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease, transform .15s ease",
                background: on ? "linear-gradient(165deg, var(--acc-soft), var(--bg-1))" : "var(--bg-1)",
                border: `1.5px solid ${on ? "var(--acc)" : "var(--border)"}`,
                boxShadow: on ? "0 30px 70px -34px var(--acc-line)" : "none",
              }}
            >
              {t.save && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--acc)", color: "var(--acc-ink)", fontSize: 10, fontWeight: 700, padding: "5px 14px", borderRadius: 100, letterSpacing: "0.06em", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{t.save.toUpperCase()}</div>}
              <div className="ab-h4" style={{ fontSize: 18 }}>{t.name}</div>
              <div className="ab-body" style={{ fontSize: 13, marginTop: 4 }}>{t.desc}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 20 }}>
                <span style={{ fontSize: 17, fontWeight: 500, color: "var(--t-3)" }}>$</span>
                <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-0.04em" }}>{t.price}</span>
                <span className="ab-body" style={{ fontSize: 14 }}>{t.unit}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "10px 14px", background: "var(--bg-2)", borderRadius: 12 }}>
                <Icon name="bolt" size={16} style={{ color: "var(--acc)" }} />
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t.credits}</span>
              </div>
              <Link href="/signup" onClick={(e) => e.stopPropagation()} className={on ? "ab-btn ab-btn-primary ab-btn-full" : "ab-btn ab-btn-ghost ab-btn-full"} style={{ marginTop: 18 }}>{t.price === "0" ? "Start free" : `Choose ${t.name}`}</Link>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                {t.feats.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: on ? "var(--acc)" : "var(--bg-3)", color: on ? "var(--acc-ink)" : "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} stroke={3} /></span>
                    <span style={{ fontSize: 13.5, color: "var(--t-2)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
