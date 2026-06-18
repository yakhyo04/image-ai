"use client";

import { Icon } from "@/components/landing/ui";
import ThemeSwitch from "@/components/ThemeSwitch";
import { SegRow } from "../controls";
import { SettingsScaffold, Card, RowToggle, SubHead } from "./SettingsShared";

const SEGS = [
  { k: "Interface language", opts: ["UZ", "RU", "EN"], def: 2 },
  { k: "Default export format", opts: ["JPG", "PNG", "WEBP"], def: 0 },
  { k: "Default quality", opts: ["Standard", "HD", "4K"], def: 1 },
  { k: "Default aspect", opts: ["1:1", "3:4", "9:16"], def: 1 },
];

export default function Preferences() {
  return (
    <SettingsScaffold active="prefs" title="Preferences" sub="Defaults applied to new generations and the interface.">
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {SEGS.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{r.k}</span>
            <div style={{ width: 230, maxWidth: "55%" }}><SegRow items={r.opts} def={r.def} /></div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div><div style={{ fontSize: 14, fontWeight: 500 }}>Dark mode</div><div className="ab-body" style={{ fontSize: 12, marginTop: 2 }}>Use the dark interface theme</div></div>
          <ThemeSwitch />
        </div>
        <RowToggle k="Auto-save generations" d="Keep every result in your gallery" on={true} />
        <RowToggle k="Show credit cost before generating" d="Confirm credits each run" on={true} />
        <RowToggle k="Reduced motion" d="Minimize interface animations" on={false} last />
      </Card>
      <SubHead>Danger zone</SubHead>
      <Card style={{ borderColor: "oklch(0.7 0.21 22 / 0.25)", marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>Delete account</div><div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>Permanently remove your account, generations, and data.</div></div>
          <button className="ab-btn ab-btn-ghost" style={{ color: "var(--err)", borderColor: "oklch(0.7 0.21 22 / 0.3)" }}><Icon name="trash" size={15} /> Delete account</button>
        </div>
      </Card>
    </SettingsScaffold>
  );
}
