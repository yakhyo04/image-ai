"use client";

import { Icon } from "@/components/landing/ui";
import { SettingsScaffold, Card, Field, SubHead } from "./SettingsShared";

const MARKETS: [string, string, boolean][] = [
  ["Uzum", "Connected · 2 stores", true],
  ["Wildberries", "Connected · 1 store", true],
  ["Ozon", "Not connected", false],
  ["Yandex Market", "Not connected", false],
];

export default function Profile() {
  return (
    <SettingsScaffold active="profile" title="Profile" sub="How your account appears across Artboard.">
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--v-blue)", color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, border: "1px solid var(--border-mid)" }}>DR</div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div className="ab-h4" style={{ fontSize: 18 }}>Dilnoza Rashidova</div>
            <div className="ab-body" style={{ fontSize: 13, marginTop: 2 }}>Brio Outwear · Uzum seller · joined Apr 2026</div>
          </div>
          <button className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="upload" size={14} /> Change avatar</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <Field label="Full name" value="Dilnoza Rashidova" />
          <Field label="Store name" value="Brio Outwear" />
          <Field label="Email" value="dilnoza@brio.uz" />
          <Field label="Phone" value="+998 90 123 45 67" />
          <Field label="Country" value="Uzbekistan" />
          <Field label="Timezone" value="GMT+5 · Tashkent" />
        </div>
      </Card>
      <SubHead>Connected marketplaces</SubHead>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {MARKETS.map(([m, s, c], i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--t-2)" }}>{m.slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{m}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 1, color: c ? "var(--ok)" : "var(--t-3)" }}>{s}</div></div>
            <button className={c ? "ab-btn ab-btn-ghost ab-btn-sm" : "ab-btn ab-btn-primary ab-btn-sm"}>{c ? "Manage" : "Connect"}</button>
          </div>
        ))}
      </Card>
    </SettingsScaffold>
  );
}
