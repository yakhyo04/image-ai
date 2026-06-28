"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "../DashFrame";
import { Toggle } from "../controls";

export const SETTINGS_NAV = [
  { id: "profile", icon: "user", label: "Profile", href: "/dashboard/settings" },
  { id: "brand", icon: "palette", label: "Brand kit", href: "/dashboard/settings/brand" },
  { id: "prefs", icon: "sliders", label: "Preferences", href: "/dashboard/settings/preferences" },
  { id: "notif", icon: "bell", label: "Notifications", href: "/dashboard/settings/notifications" },
];

export function SettingsScaffold({ active, title, sub, children, footer = true }: { active: string; title: string; sub: string; children: ReactNode; footer?: boolean }) {
  return (
    <DashFrame active="settings" title="Settings">
      <div className="ab-dash-settings" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100%" }}>
        <div className="ab-settings-nav" style={{ borderRight: "1px solid var(--border)", padding: 20, alignSelf: "start", position: "sticky", top: 0 }}>
          {SETTINGS_NAV.map((n) => {
            const on = n.id === active;
            return (
              <Link key={n.id} href={n.href} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderRadius: 11, cursor: "pointer", marginBottom: 2, textDecoration: "none", background: on ? "var(--bg-2)" : "transparent", color: on ? "var(--t-1)" : "var(--t-3)", border: on ? "1px solid var(--border)" : "1px solid transparent" }}>
                <Icon name={n.icon} size={18} style={{ color: on ? "var(--acc)" : "var(--t-3)" }} />
                <span style={{ fontSize: 13.5, fontWeight: on ? 600 : 500 }}>{n.label}</span>
              </Link>
            );
          })}
        </div>
        <div style={{ padding: "28px 32px", minWidth: 0 }}>
          <div className="ab-h3" style={{ fontSize: 20, marginBottom: 4 }}>{title}</div>
          <div className="ab-body" style={{ fontSize: 13.5, marginBottom: 24 }}>{sub}</div>
          {children}
          {footer && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 28 }}>
              <button className="ab-btn ab-btn-ghost">Cancel</button>
              <button className="ab-btn ab-btn-primary"><Icon name="check" size={16} stroke={2.4} /> Save changes</button>
            </div>
          )}
        </div>
      </div>
    </DashFrame>
  );
}

export function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
      <div className="ab-eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{label}</div>
      <div style={{ height: 44, padding: "0 14px", display: "flex", alignItems: "center", borderRadius: 11, background: "var(--bg)", border: "1px solid var(--border-mid)", fontSize: 14 }}>{value}</div>
    </div>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="ab-card" style={{ padding: 24, marginBottom: 24, ...style }}>{children}</div>;
}

export function RowToggle({ k, d, on, last }: { k: string; d: string; on: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div><div style={{ fontSize: 14, fontWeight: 500 }}>{k}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 2 }}>{d}</div></div>
      <Toggle on={on} />
    </div>
  );
}

export function SubHead({ children }: { children: ReactNode }) {
  return <div className="ab-h4" style={{ fontSize: 16, marginBottom: 14 }}>{children}</div>;
}
