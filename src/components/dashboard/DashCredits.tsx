"use client";

import { useState } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";

const PLANS = [
  { name: "Starter", price: "0", credits: "30", per: "Free forever" },
  { name: "Pro", price: "24", credits: "500", per: "For active sellers" },
  { name: "Business", price: "79", credits: "2,000", per: "For teams" },
];
const CURRENT_PLAN = 1; // Pro

const PACKS = [
  { c: 100, p: "$6", per: "Quick top-up" },
  { c: 500, p: "$24", per: "Same as Pro", best: true },
  { c: 2000, p: "$79", per: "Same as Business" },
];

const TXNS = [
  { k: "topup", t: "Credit top-up · 500", m: "Click", d: "May 1", delta: "+500", amt: "$24" },
  { k: "spend", t: "Infographics · 4 variants", m: "Glass", d: "May 1", delta: "−5", amt: "" },
  { k: "spend", t: "Background removal · batch", m: "10 images", d: "Apr 30", delta: "−30", amt: "" },
  { k: "spend", t: "Interior staging", m: "Scandi", d: "Apr 29", delta: "−6", amt: "" },
  { k: "topup", t: "Monthly Pro credits", m: "Subscription", d: "Apr 28", delta: "+500", amt: "$24" },
];

const METHODS: [string, string, boolean][] = [
  ["Click", "•••• 4821", true],
  ["Payme", "•••• 7390", false],
  ["Uzcard", "•••• 1265", false],
];

export default function DashCredits() {
  const [plan, setPlan] = useState(CURRENT_PLAN);
  const [pack, setPack] = useState(1); // best

  return (
    <DashFrame active="credits" title="Credits & Billing">
      <div style={{ padding: 28, position: "relative" }}>
        <div className="ab-glow" style={{ width: 420, height: 320, background: "var(--acc)", top: -150, right: -100, opacity: 0.08 }} />

        {/* balance + usage */}
        <div className="ab-dash-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
          <div className="ab-card" style={{ padding: 26, position: "relative", overflow: "hidden" }}>
            <div className="ab-glow" style={{ width: 180, height: 180, background: "var(--acc)", bottom: -80, right: -40, opacity: 0.14 }} />
            <div style={{ position: "relative" }}>
              <div className="ab-eyebrow">Current balance</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
                <span style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>500</span>
                <span className="ab-body" style={{ fontSize: 15 }}>credits</span>
              </div>
              <div className="ab-body" style={{ fontSize: 13, marginTop: 8 }}>≈ 100 infographics · 166 background removals</div>
              <button className="ab-btn ab-btn-primary" style={{ marginTop: 18 }}><Icon name="plus" size={16} stroke={2.4} /> Buy more credits</button>
            </div>
          </div>
          <div className="ab-card" style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="ab-eyebrow">Usage this month</div>
              <span className="ab-chip ab-chip-acc"><Icon name="crown" size={12} /> Pro</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>180 / 500 used</span>
              <span className="ab-mono" style={{ color: "var(--acc)", fontWeight: 700 }}>36%</span>
            </div>
            <div style={{ height: 10, borderRadius: 100, background: "var(--bg-3)", overflow: "hidden" }}>
              <div style={{ width: "36%", height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--acc-2), var(--acc))" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 22 }}>
              {[["Infographics", "110"], ["Backgrounds", "45"], ["Interior", "25"]].map(([k, v], i) => (
                <div key={i}>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em" }}>{v}</div>
                  <div className="ab-body" style={{ fontSize: 11.5, marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
            <div className="ab-body" style={{ fontSize: 12, marginTop: 18 }}>Renews May 28 · unused credits roll over 30 days</div>
          </div>
        </div>

        {/* plans — clickable */}
        <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>Your plan</div>
        <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 30 }}>
          {PLANS.map((p, i) => {
            const on = plan === i;
            const current = i === CURRENT_PLAN;
            return (
              <div
                key={p.name}
                onClick={() => setPlan(i)}
                role="button"
                aria-pressed={on}
                style={{
                  padding: 22, borderRadius: 18, position: "relative", cursor: "pointer",
                  transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
                  background: on ? "linear-gradient(160deg, var(--acc-soft), var(--bg-1))" : "var(--bg-1)",
                  border: `1.5px solid ${on ? "var(--acc)" : "var(--border)"}`,
                  boxShadow: on ? "0 24px 60px -34px var(--acc-line)" : "none",
                }}
              >
                {current && <div style={{ position: "absolute", top: -11, left: 22, background: "var(--acc)", color: "var(--acc-ink)", fontSize: 9, fontWeight: 700, padding: "4px 11px", borderRadius: 100, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>CURRENT PLAN</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="ab-h4" style={{ fontSize: 17 }}>{p.name}</div>
                  {on && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} stroke={3} /></span>}
                </div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>{p.per}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--t-3)" }}>$</span>
                  <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.04em" }}>{p.price}</span>
                  <span className="ab-body" style={{ fontSize: 13 }}>/mo</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, padding: "8px 12px", background: "var(--bg-2)", borderRadius: 11 }}>
                  <Icon name="bolt" size={15} style={{ color: "var(--acc)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{p.credits} credits / mo</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPlan(i); }}
                  disabled={current}
                  className={on && !current ? "ab-btn ab-btn-primary ab-btn-full ab-btn-sm" : "ab-btn ab-btn-ghost ab-btn-full ab-btn-sm"}
                  style={{ marginTop: 14, opacity: current ? 0.7 : 1 }}
                >
                  {current ? "Current plan" : `Switch to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* credit packs — clickable */}
        <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>Buy credit packs</div>
        <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 30 }}>
          {PACKS.map((p, i) => {
            const on = pack === i;
            return (
              <div
                key={i}
                onClick={() => setPack(i)}
                role="button"
                aria-pressed={on}
                style={{
                  padding: 22, borderRadius: 18, position: "relative", cursor: "pointer",
                  transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
                  background: on ? "linear-gradient(160deg, var(--acc-soft), var(--bg-1))" : "var(--bg-1)",
                  border: `1.5px solid ${on ? "var(--acc)" : "var(--border)"}`,
                  boxShadow: on ? "0 24px 60px -34px var(--acc-line)" : "none",
                }}
              >
                {p.best && <div style={{ position: "absolute", top: -11, left: 22, background: "var(--acc)", color: "var(--acc-ink)", fontSize: 9, fontWeight: 700, padding: "4px 11px", borderRadius: 100, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>BEST VALUE</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="bolt" size={20} style={{ color: "var(--acc)" }} />
                    <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.04em" }}>{p.c}</span>
                  </div>
                  <span className="ab-mono" style={{ color: "var(--t-3)", fontSize: 11 }}>{p.per}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                  <span style={{ fontSize: 22, fontWeight: 600 }}>{p.p}</span>
                  <button onClick={(e) => { e.stopPropagation(); setPack(i); }} className={on ? "ab-btn ab-btn-primary ab-btn-sm" : "ab-btn ab-btn-ghost ab-btn-sm"}>Buy</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* payment methods + transactions */}
        <div className="ab-dash-home-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
          <div>
            <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>Payment methods</div>
            <div className="ab-card" style={{ overflow: "hidden" }}>
              {METHODS.map(([m, n, def], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 40, height: 28, borderRadius: 7, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--t-2)" }}>{m.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m}</div>
                    <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 11 }}>{n}</div>
                  </div>
                  {def && <span className="ab-chip ab-chip-acc" style={{ padding: "3px 9px", fontSize: 10 }}>Default</span>}
                </div>
              ))}
            </div>
            <button className="ab-btn ab-btn-ghost ab-btn-full" style={{ marginTop: 12 }}><Icon name="plus" size={15} stroke={2.2} /> Add method</button>
            <div className="ab-body" style={{ fontSize: 12, marginTop: 14, display: "flex", alignItems: "center", gap: 7 }}><Icon name="shield" size={14} style={{ color: "var(--acc)" }} /> Payments secured · Click · Payme · Humo</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="ab-h4" style={{ fontSize: 17 }}>Transaction history</div>
              <button className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="download" size={14} /> Export</button>
            </div>
            <div className="ab-card" style={{ overflow: "hidden" }}>
              {TXNS.map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i < TXNS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: tx.k === "topup" ? "var(--acc-soft)" : "var(--bg-2)", color: tx.k === "topup" ? "var(--acc)" : "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={tx.k === "topup" ? "plus" : "sparkle-fill"} size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{tx.t}</div>
                    <div className="ab-body" style={{ fontSize: 11.5, marginTop: 1 }}>{tx.m} · {tx.d}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="ab-mono" style={{ fontSize: 14, fontWeight: 700, color: tx.k === "topup" ? "var(--ok)" : "var(--t-1)" }}>{tx.delta} <span style={{ fontSize: 10, color: "var(--t-3)" }}>cr</span></div>
                    {tx.amt && <div className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)", marginTop: 2 }}>{tx.amt}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
