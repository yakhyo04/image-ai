"use client";

import { Icon } from "@/components/landing/ui";
import ThemeSwitch from "@/components/ThemeSwitch";
import { SegRow } from "../controls";
import { SettingsScaffold, Card, RowToggle, SubHead } from "./SettingsShared";
import { useDict, useLocale } from "@/i18n/context";
import { LOCALE_LABELS, LOCALE_COOKIE, type Locale } from "@/i18n/config";

// Order shown in the interface-language segmented control.
const LANG_ORDER: Locale[] = ["uz", "ru", "en"];

export default function Preferences() {
  const t = useDict();
  const p = t.dash.settings.prefs;
  const active = useLocale();

  function chooseLang(l: Locale) {
    if (l === active) return;
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  const SEGS = [
    { k: p.exportFormat, opts: ["JPG", "PNG", "WEBP"], def: 0 },
    { k: p.quality, opts: [p.qualityStandard, "HD", "4K"], def: 1 },
    { k: p.aspect, opts: ["1:1", "3:4", "9:16"], def: 1 },
  ];

  return (
    <SettingsScaffold active="prefs" title={p.title} sub={p.sub}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Interface language — actually switches the app locale. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{p.interfaceLanguage}</span>
          <div style={{ width: 230, maxWidth: "55%" }}>
            <SegRow
              items={LANG_ORDER.map((l) => LOCALE_LABELS[l])}
              value={LANG_ORDER.indexOf(active)}
              onChange={(i) => chooseLang(LANG_ORDER[i])}
            />
          </div>
        </div>
        {SEGS.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{r.k}</span>
            <div style={{ width: 230, maxWidth: "55%" }}><SegRow items={r.opts} def={r.def} /></div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div><div style={{ fontSize: 14, fontWeight: 500 }}>{p.darkMode}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 2 }}>{p.darkModeSub}</div></div>
          <ThemeSwitch />
        </div>
        <RowToggle k={p.autoSave} d={p.autoSaveSub} on={true} />
        <RowToggle k={p.showCost} d={p.showCostSub} on={true} />
        <RowToggle k={p.reducedMotion} d={p.reducedMotionSub} on={false} last />
      </Card>
      <SubHead>{p.dangerZone}</SubHead>
      <Card style={{ borderColor: "oklch(0.7 0.21 22 / 0.25)", marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>{p.deleteAccount}</div><div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>{p.deleteAccountSub}</div></div>
          <button className="ab-btn ab-btn-ghost" style={{ color: "var(--err)", borderColor: "oklch(0.7 0.21 22 / 0.3)" }}><Icon name="trash" size={15} /> {p.deleteAccount}</button>
        </div>
      </Card>
    </SettingsScaffold>
  );
}
