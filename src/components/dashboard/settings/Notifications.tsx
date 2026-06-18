"use client";

import { Icon } from "@/components/landing/ui";
import { Toggle } from "../controls";
import { SettingsScaffold } from "./SettingsShared";

const ROWS = [
  { k: "Generation finished", d: "When a batch of variants is ready", e: true, p: true, s: false },
  { k: "Low credit balance", d: "When you drop below 50 credits", e: true, p: true, s: true },
  { k: "Weekly summary", d: "Your generations and usage each week", e: true, p: false, s: false },
  { k: "Product updates", d: "New tools, styles, and features", e: true, p: false, s: false },
  { k: "Tips & best practices", d: "Occasional advice to sell better", e: false, p: false, s: false },
  { k: "Billing & receipts", d: "Payments, renewals, and invoices", e: true, p: false, s: true },
];

export default function Notifications() {
  return (
    <SettingsScaffold active="notif" title="Notifications" sub="Choose what we tell you, and where.">
      <div className="ab-card" style={{ overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 90px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}>
          <span className="ab-eyebrow" style={{ fontSize: 10 }}>Event</span>
          {["Email", "Push", "SMS"].map((c) => <span key={c} className="ab-eyebrow" style={{ fontSize: 10, textAlign: "center" }}>{c}</span>)}
        </div>
        {ROWS.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 90px", alignItems: "center", padding: "16px 20px", borderBottom: i < ROWS.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>{r.k}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 2 }}>{r.d}</div></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.e} /></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.p} /></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.s} /></div>
          </div>
        ))}
      </div>
      <div className="ab-card" style={{ padding: 20, marginBottom: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="bell" size={19} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>Quiet hours</div><div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>Pause push and SMS between 22:00 and 08:00</div></div>
        <Toggle on={true} />
      </div>
    </SettingsScaffold>
  );
}
