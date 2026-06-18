"use client";

import { Icon } from "@/components/landing/ui";
import { SettingsScaffold } from "./SettingsShared";

const MEMBERS = [
  { n: "Dilnoza Rashidova", e: "dilnoza@brio.uz", role: "Owner", init: "DR", tone: "var(--v-blue)" },
  { n: "Sardor Aliyev", e: "sardor@brio.uz", role: "Admin", init: "SA", tone: "var(--v-violet)" },
  { n: "Malika Yusupova", e: "malika@brio.uz", role: "Editor", init: "MY", tone: "var(--v-amber)" },
  { n: "Jasur Karimov", e: "jasur@brio.uz", role: "Editor", init: "JK", tone: "oklch(0.5 0.12 160)" },
  { n: "Nigora T.", e: "nigora@brio.uz", role: "Viewer", init: "NT", tone: "oklch(0.5 0.12 25)" },
];

const ROLES: [string, string][] = [
  ["Owner", "Full access + billing"],
  ["Admin", "Manage team & settings"],
  ["Editor", "Create & export"],
  ["Viewer", "View gallery only"],
];

export default function Team() {
  return (
    <SettingsScaffold active="team" title="Team" sub="Invite teammates and manage what they can do." footer={false}>
      {/* seats */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 20, borderRadius: 16, background: "linear-gradient(160deg, var(--acc-soft), var(--bg-1))", border: "1px solid var(--acc-line)", flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="crown" size={20} /></div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>5 of 5 seats used</div>
          <div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>Business plan · add seats for $12/mo each</div>
        </div>
        <button className="ab-btn ab-btn-primary"><Icon name="plus" size={16} stroke={2.4} /> Add seats</button>
      </div>
      {/* invite bar */}
      <div className="ab-team-invite" style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 10, height: 46, padding: "0 14px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border-mid)", color: "var(--t-3)" }}>
          <Icon name="mail" size={17} /><span style={{ fontSize: 14 }}>teammate@brio.uz</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 46, padding: "0 14px", borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border-mid)", fontSize: 14, fontWeight: 500 }}>Editor <Icon name="chevron-down" size={15} style={{ color: "var(--t-3)" }} /></div>
        <button className="ab-btn ab-btn-primary"><Icon name="send" size={15} /> Invite</button>
      </div>
      {/* members table */}
      <div className="ab-card" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 150px 40px", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-2)" }}>
          <span className="ab-eyebrow" style={{ fontSize: 10 }}>Member</span>
          <span className="ab-eyebrow" style={{ fontSize: 10 }}>Role</span>
          <span />
        </div>
        {MEMBERS.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 150px 40px", alignItems: "center", padding: "14px 20px", borderBottom: i < MEMBERS.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: m.tone, color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{m.init}</div>
              <div style={{ minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.n}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.e}</div></div>
            </div>
            <div>
              <span className="ab-chip" style={{ padding: "6px 12px", borderColor: m.role === "Owner" ? "var(--acc-line)" : "var(--border)", color: m.role === "Owner" ? "var(--acc)" : "var(--t-2)", background: m.role === "Owner" ? "var(--acc-soft)" : "var(--bg-2)", cursor: m.role === "Owner" ? "default" : "pointer" }}>{m.role} {m.role !== "Owner" && <Icon name="chevron-down" size={13} />}</span>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 9, background: "transparent", border: "none", color: "var(--t-3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      {/* roles legend */}
      <div className="ab-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
        {ROLES.map(([r, d]) => (
          <div key={r} className="ab-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{r}</div>
            <div className="ab-body" style={{ fontSize: 11.5, marginTop: 3 }}>{d}</div>
          </div>
        ))}
      </div>
    </SettingsScaffold>
  );
}
