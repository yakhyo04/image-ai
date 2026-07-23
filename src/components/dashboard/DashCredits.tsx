"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { GENERATION_COST } from "@/lib/credits";
import { PLANS, PACKS } from "@/lib/billing";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/store/credits";
import { useDict } from "@/i18n/context";
import type { Dict } from "@/i18n";

type Txn = {
  amount: number;
  kind: string;
  source: string | null;
  description: string | null;
  createdAt: string;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function txnLabel(tx: Txn, c: Dict["dash"]["credits"]): string {
  if (tx.description) return tx.description;
  if (tx.kind === "spend") return c.txn.generation;
  if (tx.kind === "refund") return c.txn.refund;
  if (tx.source === "subscription") return c.txn.subscription;
  if (tx.source === "signup") return c.txn.welcome;
  return c.txn.purchase;
}

export default function DashCredits({
  credits,
  joinedAt,
  plan,
  subscriptionStatus,
  periodEnd,
  txns,
}: {
  credits: number;
  joinedAt: string | null;
  plan: string;
  subscriptionStatus: string | null;
  periodEnd: string | null;
  txns: Txn[];
}) {
  const params = useSearchParams();
  const status = params.get("status");
  const router = useRouter();
  const setStoreCredits = useCredits((s) => s.setCredits);
  const t = useDict();
  const c = t.dash.credits;

  // After returning from a successful checkout, the credits are granted by the
  // Polar webhook a moment later. Poll the balance until it changes, then
  // refresh the page data and the top-bar badge so it updates without a manual
  // reload.
  useEffect(() => {
    if (status !== "success") return;
    const supabase = createClient();
    const initial = credits;
    let active = true;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      tries += 1;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (active && user) {
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (active && data && data.credits !== initial) {
          setStoreCredits(data.credits); // updates the sidebar + top-bar badge
          router.refresh(); // re-fetch balance, usage, and transactions
          return;
        }
      }
      if (active && tries < 12) timer = setTimeout(tick, 2000);
    };

    timer = setTimeout(tick, 1500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
    // Only re-arm when the status flips to success; `credits` is captured as the
    // pre-purchase baseline on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const currentPlanIdx = Math.max(0, PLANS.findIndex((p) => p.key === plan));
  const [selectedPlan, setSelectedPlan] = useState(currentPlanIdx);
  const hasSubscription = currentPlanIdx > 0;

  // Usage this month, derived from real debits in the ledger. Credits now
  // accumulate (packs + each subscription cycle), so usage is measured against
  // the full pool available this month (spent + still-remaining), not a fixed
  // monthly allowance — that keeps the bar between 0 and 100%.
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const debitsThisMonth = txns.filter(
    (t) => t.amount < 0 && new Date(t.createdAt).getTime() >= monthStart,
  );
  const usedThisMonth = debitsThisMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const gensThisMonth = debitsThisMonth.length;
  const pool = usedThisMonth + credits; // total credits available this month
  const pct = pool > 0 ? Math.round((usedThisMonth / pool) * 100) : 0;
  const allowance = PLANS[currentPlanIdx].credits;

  return (
    <DashFrame active="credits" title="Credits & Billing">
      <div style={{ padding: 28, position: "relative" }}>
        <div className="ab-glow" style={{ width: 420, height: 320, background: "var(--acc)", top: -150, right: -100, opacity: 0.08 }} />

        {/* purchase status banner */}
        {status === "success" && (
          <div className="ab-card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, border: "1.5px solid var(--ok)", background: "color-mix(in srgb, var(--ok) 8%, var(--bg-1))" }}>
            <Icon name="check" size={18} stroke={2.6} style={{ color: "var(--ok)" }} />
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.paymentReceived}</span>
          </div>
        )}
        {status === "error" && (
          <div className="ab-card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, border: "1.5px solid var(--err, #e5484d)" }}>
            <Icon name="close" size={18} stroke={2.6} style={{ color: "var(--err, #e5484d)" }} />
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.checkoutFailed}</span>
          </div>
        )}

        {/* balance + usage */}
        <div className="ab-dash-stats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
          <div className="ab-card" style={{ padding: 26, position: "relative", overflow: "hidden" }}>
            <div className="ab-glow" style={{ width: 180, height: 180, background: "var(--acc)", bottom: -80, right: -40, opacity: 0.14 }} />
            <div style={{ position: "relative" }}>
              <div className="ab-eyebrow">{c.balanceCurrent}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
                <span style={{ fontSize: 64, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>{credits}</span>
                <span className="ab-body" style={{ fontSize: 15 }}>{c.creditsWord}</span>
              </div>
              <div className="ab-body" style={{ fontSize: 13, marginTop: 8 }}>{c.approxGen.replace("{n}", String(Math.floor(credits / GENERATION_COST))).replace("{c}", String(GENERATION_COST))}</div>
              <a href="#packs" className="ab-btn ab-btn-primary" style={{ marginTop: 18, textDecoration: "none" }}><Icon name="plus" size={16} stroke={2.4} /> {c.buyMore}</a>
            </div>
          </div>
          <div className="ab-card" style={{ padding: 26 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div className="ab-eyebrow">{c.usageThisMonth}</div>
              <span className="ab-chip ab-chip-acc"><Icon name="crown" size={12} /> {PLANS[currentPlanIdx].name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{c.usedLine.replace("{used}", String(usedThisMonth)).replace("{g}", String(gensThisMonth)).replace("{word}", gensThisMonth === 1 ? c.generation : c.generations)}</span>
              <span className="ab-mono" style={{ color: "var(--acc)", fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 100, background: "var(--bg-3)", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 100, background: "linear-gradient(90deg, var(--acc-2), var(--acc))" }} />
            </div>
            <div className="ab-body" style={{ fontSize: 12.5, marginTop: 18 }}>
              {hasSubscription ? (
                <>
                  {c.planCycle.replace("{name}", PLANS[currentPlanIdx].name).replace("{n}", String(allowance))}
                  {subscriptionStatus === "canceled" && periodEnd
                    ? ` · ${c.endsOn.replace("{date}", fmtDate(periodEnd))}`
                    : periodEnd
                    ? ` · ${c.renewsOn.replace("{date}", fmtDate(periodEnd))}`
                    : ""}
                </>
              ) : (
                <>{c.starterLine.replace("{n}", String(allowance))}</>
              )}
            </div>
            {hasSubscription && (
              <a href="/portal" className="ab-btn ab-btn-ghost ab-btn-sm" style={{ marginTop: 14, textDecoration: "none" }}>
                <Icon name="settings" size={14} /> {c.manageSubscription}
              </a>
            )}
          </div>
        </div>

        {/* plans */}
        <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>{c.yourPlan}</div>
        <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 30 }}>
          {PLANS.map((p, i) => {
            const on = selectedPlan === i;
            const current = i === currentPlanIdx;
            return (
              <div
                key={p.key}
                onClick={() => setSelectedPlan(i)}
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
                {current && <div style={{ position: "absolute", top: -11, left: 22, background: "var(--acc)", color: "var(--acc-ink)", fontSize: 9, fontWeight: 700, padding: "4px 11px", borderRadius: 100, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>{c.currentPlanBadge}</div>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="ab-h4" style={{ fontSize: 17 }}>{p.name}</div>
                  {on && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check" size={12} stroke={3} /></span>}
                </div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>{c.planBlurbs[p.key]}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--t-3)" }}>$</span>
                  <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.04em" }}>{p.price}</span>
                  <span className="ab-body" style={{ fontSize: 13 }}>{c.perMonth}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 12, padding: "8px 12px", background: "var(--bg-2)", borderRadius: 11 }}>
                  <Icon name="bolt" size={15} style={{ color: "var(--acc)" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.creditsPerMonth.replace("{n}", p.credits.toLocaleString())}</span>
                </div>
                {current ? (
                  <button disabled className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm" style={{ marginTop: 14, opacity: 0.7 }}>{c.currentPlanBtn}</button>
                ) : p.productId ? (
                  <a
                    href={`/checkout?plan=${p.key}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ab-btn ab-btn-primary ab-btn-full ab-btn-sm"
                    style={{ marginTop: 14, textDecoration: "none" }}
                  >
                    {c.switchTo.replace("{name}", p.name)}
                  </a>
                ) : (
                  // Downgrade to the free plan = cancel the subscription via portal.
                  <a
                    href="/portal"
                    onClick={(e) => e.stopPropagation()}
                    className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm"
                    style={{ marginTop: 14, textDecoration: "none" }}
                  >
                    {c.downgrade}
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* credit packs */}
        <div id="packs" className="ab-h4" style={{ fontSize: 17, marginBottom: 16, scrollMarginTop: 90 }}>{c.buyPacks}</div>
        <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 30 }}>
          {PACKS.map((p) => (
            <div
              key={p.key}
              style={{
                padding: 22, borderRadius: 18, position: "relative",
                background: p.best ? "linear-gradient(160deg, var(--acc-soft), var(--bg-1))" : "var(--bg-1)",
                border: `1.5px solid ${p.best ? "var(--acc)" : "var(--border)"}`,
                boxShadow: p.best ? "0 24px 60px -34px var(--acc-line)" : "none",
              }}
            >
              {p.best && <div style={{ position: "absolute", top: -11, left: 22, background: "var(--acc)", color: "var(--acc-ink)", fontSize: 9, fontWeight: 700, padding: "4px 11px", borderRadius: 100, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>{c.bestValue}</div>}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="bolt" size={20} style={{ color: "var(--acc)" }} />
                  <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.04em" }}>{p.credits.toLocaleString()}</span>
                </div>
                <span className="ab-mono" style={{ color: "var(--t-3)", fontSize: 11 }}>{c.packBlurbs[p.key]}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                <span style={{ fontSize: 22, fontWeight: 600 }}>${p.price}</span>
                <a href={`/checkout?pack=${p.key}`} className={p.best ? "ab-btn ab-btn-primary ab-btn-sm" : "ab-btn ab-btn-ghost ab-btn-sm"} style={{ textDecoration: "none" }}>{c.buy}</a>
              </div>
            </div>
          ))}
        </div>

        {/* transaction history */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="ab-h4" style={{ fontSize: 17 }}>{c.txnHistory}</div>
          <div className="ab-body" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 7 }}><Icon name="shield" size={14} style={{ color: "var(--acc)" }} /> {c.securedByPolar}</div>
        </div>
        <div className="ab-card" style={{ overflow: "hidden" }}>
          {txns.length === 0 ? (
            <div style={{ padding: "28px 18px", textAlign: "center" }} className="ab-body">{c.noTxns}</div>
          ) : (
            txns.map((tx, i) => {
              const credit = tx.amount >= 0;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: i < txns.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: credit ? "var(--acc-soft)" : "var(--bg-2)", color: credit ? "var(--acc)" : "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={credit ? "plus" : "sparkle-fill"} size={16} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{txnLabel(tx, c)}</div>
                    <div className="ab-body" style={{ fontSize: 11.5, marginTop: 1, textTransform: "capitalize" }}>{c.kind[tx.kind as keyof typeof c.kind] ?? tx.kind} · {fmtDate(tx.createdAt)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="ab-mono" style={{ fontSize: 14, fontWeight: 700, color: credit ? "var(--ok)" : "var(--t-1)" }}>{credit ? "+" : "−"}{Math.abs(tx.amount)} <span style={{ fontSize: 10, color: "var(--t-3)" }}>{c.crShort}</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashFrame>
  );
}
