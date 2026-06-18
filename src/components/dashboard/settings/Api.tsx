"use client";

import { Icon } from "@/components/landing/ui";
import { Toggle } from "../controls";
import { SettingsScaffold } from "./SettingsShared";

const KEYS = [
  { name: "Production", key: "ab_live_8f3k••••••••2x9d", created: "Apr 12", last: "2h ago", live: true },
  { name: "Staging", key: "ab_test_2m7p••••••••5q1a", created: "Apr 03", last: "Yesterday", live: false },
];

const USAGE: [string, string, boolean?][] = [
  ["12,480", "Calls this month"],
  ["99.9%", "Uptime", true],
  ["142ms", "Avg. latency"],
];

export default function Api() {
  return (
    <SettingsScaffold active="api" title="API access" sub="Generate visuals programmatically and wire Artboard into your pipeline." footer={false}>
      <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {USAGE.map(([v, l, acc], i) => (
          <div key={i} className="ab-card" style={{ padding: 18 }}>
            <div className="ab-eyebrow" style={{ fontSize: 10, color: acc ? "var(--acc)" : "var(--t-3)" }}>{l}</div>
            <div className="ab-mono" style={{ fontSize: 26, fontWeight: 700, marginTop: 8, letterSpacing: "-0.02em", color: acc ? "var(--acc)" : "var(--t-1)" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div className="ab-h4" style={{ fontSize: 16 }}>API keys</div>
        <button className="ab-btn ab-btn-primary ab-btn-sm"><Icon name="plus" size={15} stroke={2.4} /> New key</button>
      </div>
      <div className="ab-card" style={{ overflow: "hidden", marginBottom: 24 }}>
        {KEYS.map((k, i) => (
          <div key={i} className="ab-api-key" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < KEYS.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: k.live ? "var(--acc-soft)" : "var(--bg-3)", color: k.live ? "var(--acc)" : "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="bolt" size={17} /></div>
            <div style={{ minWidth: 130 }}>
              <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>{k.name} {k.live && <span className="ab-chip ab-chip-acc" style={{ padding: "2px 8px", fontSize: 9 }}>LIVE</span>}</div>
              <div className="ab-body" style={{ fontSize: 11.5, marginTop: 1 }}>Created {k.created} · used {k.last}</div>
            </div>
            <div className="ab-mono" style={{ flex: 1, minWidth: 120, fontSize: 12.5, color: "var(--t-2)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.key}</div>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Icon name="eye" size={16} /></button>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--err)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}><Icon name="trash" size={16} /></button>
          </div>
        ))}
      </div>
      <div className="ab-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div className="ab-h4" style={{ fontSize: 16, marginBottom: 14 }}>Webhook endpoint</div>
          <div className="ab-card" style={{ padding: 18 }}>
            <div className="ab-mono" style={{ fontSize: 12.5, color: "var(--t-2)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 12px", wordBreak: "break-all" }}>https://brio.uz/api/artboard/hook</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Send events</div><Toggle on={true} />
            </div>
          </div>
        </div>
        <div>
          <div className="ab-h4" style={{ fontSize: 16, marginBottom: 14 }}>Documentation</div>
          <div className="ab-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "var(--bg-3)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="bolt" size={20} /></div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>API reference</div><div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>Endpoints, SDKs, and examples</div></div>
            <Icon name="arrow-up-right" size={18} style={{ color: "var(--t-3)" }} />
          </div>
        </div>
      </div>
    </SettingsScaffold>
  );
}
