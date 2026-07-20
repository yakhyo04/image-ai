"use client";

import { Icon } from "@/components/landing/ui";
import { Toggle } from "../controls";
import { SettingsScaffold, Card, SubHead } from "./SettingsShared";

const COLORS: [string, string][] = [
  ["Primary", "var(--acc)"],
  ["Ink", "oklch(0.2 0.01 264)"],
  ["Coral", "oklch(0.6 0.18 25)"],
  ["Blue", "oklch(0.55 0.14 250)"],
  ["Cream", "oklch(0.92 0.02 90)"],
];

export default function Brand() {
  return (
    <SettingsScaffold active="brand" title="Brand kit" sub="Lock your colors, fonts, and logo so every generation stays on-brand.">
      <SubHead>Brand colors</SubHead>
      <Card>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {COLORS.map(([n, c]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 14, background: c, border: "1px solid var(--border-mid)", marginBottom: 8 }} />
              <div style={{ fontSize: 12, fontWeight: 600 }}>{n}</div>
              <div className="ab-mono" style={{ fontSize: 9.5, color: "var(--t-3)" }}>HEX</div>
            </div>
          ))}
          <div style={{ width: 72, height: 72, borderRadius: 14, border: "1.5px dashed var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-3)", cursor: "pointer" }}><Icon name="plus" size={22} /></div>
        </div>
      </Card>
      <div className="ab-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <SubHead>Typography</SubHead>
          <Card style={{ marginBottom: 0 }}>
            {[["Heading font", "Space Grotesk"], ["Body font", "Inter Tight"]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 16 }}>
                <div className="ab-eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{k}</div>
                <div style={{ height: 44, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 11, background: "var(--bg)", border: "1px solid var(--border-mid)" }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{v}</span><Icon name="chevron-down" size={15} style={{ color: "var(--t-3)" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <SubHead>Logo &amp; watermark</SubHead>
          <Card style={{ marginBottom: 0 }}>
            <div style={{ height: 96, borderRadius: 12, border: "1.5px dashed var(--border-strong)", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--t-2)" }}>
              <Icon name="upload" size={24} /><span style={{ fontSize: 13, fontWeight: 500 }}>Upload logo · PNG / SVG</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 16 }}>
              <div><div style={{ fontSize: 13.5, fontWeight: 500 }}>Auto-watermark exports</div><div className="ab-body" style={{ fontSize: 12, marginTop: 1 }}>Place your logo on generated images</div></div>
              <Toggle on={false} />
            </div>
          </Card>
        </div>
      </div>
    </SettingsScaffold>
  );
}
