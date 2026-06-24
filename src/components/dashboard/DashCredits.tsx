"use client";

import { useState } from "react";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { GENERATION_COST } from "@/lib/credits";

const PLANS = [
  { name: "Starter", price: "0", credits: "30", creditsNum: 30, per: "Free forever" },
  { name: "Pro", price: "24", credits: "500", creditsNum: 500, per: "For active sellers" },
  { name: "Business", price: "79", credits: "2,000", creditsNum: 2000, per: "For teams" },
];
const CURRENT_PLAN = 0; // Starter — the only plan until billing exists.

const PACKS = [
  { c: 100, p: "$6", per: "Quick top-up" },
  { c: 500, p: "$24", per: "Same as Pro", best: true },
  { c: 2000, p: "$79", per: "Same as Business" },
];

const TOOL_LABELS: Record<string, string> = {
  infographics: "Infographics",
  editor: "Photo edits",
  interior: "Interior",
  mockups: "Mockups",
  backgrounds: "Backgrounds",
  patterns: "Patterns",
};

type Gen = { tool: string | null; createdAt: string };

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DashCredits({ credits, joinedAt, gens }: { credits: number; joinedAt: string | null; gens: Gen[] }) {
  const [plan, setPlan] = useState(CURRENT_PLAN);
  const [pack, setPack] = useState(1); // best

  // Usage this month, derived from real generations.
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const thisMonth = gens.filter((g) => new Date(g.createdAt).getTime() >= monthStart);
  const usedThisMonth = thisMonth.length * GENERATION_COST;
  const allowance = PLANS[CURRENT_PLAN].creditsNum;
  const pct = allowance ? Math.min(100, Math.round((usedThisMonth / allowance) * 100)) : 0;

  // Top tools used this month.
  const tally = new Map<string, number>();
  for (const g of thisMonth) {
    const key = g.tool ?? "other";
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  const topTools = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Transaction history: each generation is a spend; the sign-up bonus is a top-up.
  const txns = [
    ...gens.slice(0, 6).map((g) => ({
      k: "spend" as const,
      t: `${TOOL_LABELS[g.tool ?? ""] ?? "Generation"} · 1 image`,
      m: "Generation",
      d: fmtDate(g.createdAt),
      delta: `−${GENERATION_COST}`,
    })),
    { k: "topup" as const, t: "Welcome credits", m: "Sign-up bonus", d: fmtDate(joinedAt), delta: "+30" },
  ];

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
                <span style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>{credits}</span>
                <span className="ab-body" style={{ fontSize: 15 }}>credits</span>
              </div>
              <div className="ab-body" style={{ fontSize: 13, marginTop: 8 }}>≈ {Math.floor(credits / GENERATION_COST)} generations · {GENERATION_COST} credits each</div>
              <button className="ab-btn ab-btn-primary" style={{ marginTop: 18 }}><Icon name="plus" size={16} stroke={2.4} /> Buy more credits</button>
            </div>
          </div>
          <div className="ab-card" style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="ab-eyebrow">Usage this month</div>
              <span className="ab-chip ab-chip-acc"><Icon name="crown" size={12} /> {PLANS[CURRENT_PLAN].name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{usedThisMonth} / {allowance} used</span>
              <span className="ab-mono" style={{ color: "var(--acc)", fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 100, background: "var(--bg-3)", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--acc-2), var(--acc))" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 22 }}>
              {topTools.length === 0 ? (
                <div className="ab-body" style={{ fontSize: 12.5, gridColumn: "1 / -1" }}>No generations yet this month.</div>
              ) : (
                topTools.map(([key, count], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em" }}>{count}</div>
                    <div className="ab-body" style={{ fontSize: 11.5, marginTop: 2 }}>{TOOL_LABELS[key] ?? "Other"}</div>
                  </div>
                ))
              )}
            </div>
            <div className="ab-body" style={{ fontSize: 12, marginTop: 18 }}>Starter plan · {allowance} credits included each month</div>
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
            <div className="ab-card" style={{ padding: 22, textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "var(--bg-3)", color: "var(--t-3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><Icon name="gem" size={20} /></div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>No payment methods yet</div>
              <div className="ab-body" style={{ fontSize: 12, marginTop: 4 }}>Add one when you’re ready to upgrade or buy credits.</div>
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
              {txns.map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i < txns.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: tx.k === "topup" ? "var(--acc-soft)" : "var(--bg-2)", color: tx.k === "topup" ? "var(--acc)" : "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={tx.k === "topup" ? "plus" : "sparkle-fill"} size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{tx.t}</div>
                    <div className="ab-body" style={{ fontSize: 11.5, marginTop: 1 }}>{tx.m} · {tx.d}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="ab-mono" style={{ fontSize: 14, fontWeight: 700, color: tx.k === "topup" ? "var(--ok)" : "var(--t-1)" }}>{tx.delta} <span style={{ fontSize: 10, color: "var(--t-3)" }}>cr</span></div>
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
