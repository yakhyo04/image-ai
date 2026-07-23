"use client";

import { Icon } from "@/components/landing/ui";
import { Toggle } from "../controls";
import { SettingsScaffold } from "./SettingsShared";
import { useDict } from "@/i18n/context";

const TOGGLES = [
  { e: true, p: true, s: false },
  { e: true, p: true, s: true },
  { e: true, p: false, s: false },
  { e: true, p: false, s: false },
  { e: false, p: false, s: false },
  { e: true, p: false, s: true },
];

export default function Notifications() {
  const t = useDict();
  const n = t.dash.settings.notif;
  return (
    <SettingsScaffold active="notif" title={n.title} sub={n.sub}>
      <div className="ab-card" style={{ overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 90px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}>
          <span className="ab-eyebrow" style={{ fontSize: 10 }}>{n.event}</span>
          {[n.email, n.push, n.sms].map((c) => <span key={c} className="ab-eyebrow" style={{ fontSize: 10, textAlign: "center" }}>{c}</span>)}
        </div>
        {TOGGLES.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px 90px", alignItems: "center", padding: "16px 20px", borderBottom: i < TOGGLES.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>{n.rows[i].k}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 2 }}>{n.rows[i].d}</div></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.e} /></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.p} /></div>
            <div style={{ display: "flex", justifyContent: "center" }}><Toggle on={r.s} /></div>
          </div>
        ))}
      </div>
      <div className="ab-card" style={{ padding: 20, marginBottom: 0, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="bell" size={19} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{n.quietHours}</div><div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>{n.quietHoursSub}</div></div>
        <Toggle on={true} />
      </div>
    </SettingsScaffold>
  );
}
