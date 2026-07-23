"use client";

import { useActionState } from "react";
import { Icon } from "@/components/landing/ui";
import { SettingsScaffold, Card, Field, SubHead } from "./SettingsShared";
import { updateProfileAction, type ProfileState } from "@/app/actions/profile";
import { useDict } from "@/i18n/context";

const MARKETS: [string, "stores2" | "store1" | "notConnected", boolean][] = [
  ["Uzum", "stores2", true],
  ["Wildberries", "store1", true],
  ["Ozon", "notConnected", false],
  ["Yandex Market", "notConnected", false],
];

export function initialsFrom(name: string, email: string): string {
  const src = name.trim() || email.split("@")[0] || "";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (src.slice(0, 2) || "AB").toUpperCase();
}

export default function Profile({
  fullName,
  storeName,
  email,
  avatarUrl,
}: {
  fullName: string;
  storeName: string;
  email: string;
  avatarUrl: string | null;
}) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateProfileAction, {});
  const initials = initialsFrom(fullName, email);
  const t = useDict();
  const p = t.dash.settings.profile;

  return (
    <SettingsScaffold active="profile" title={p.title} sub={p.sub} footer={false}>
      <form action={formAction}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, overflow: "hidden", background: "var(--v-blue)", color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, border: "1px solid var(--border-mid)" }}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                initials
              )}
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div className="ab-h4" style={{ fontSize: 18 }}>{fullName || p.yourName}</div>
              <div className="ab-body" style={{ fontSize: 13, marginTop: 2 }}>{storeName ? `${storeName} · ` : ""}{email}</div>
            </div>
            <button type="button" className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="upload" size={14} /> {p.changeAvatar}</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
            <EditField label={p.fullName} name="full_name" defaultValue={fullName} placeholder={p.yourName} />
            <EditField label={p.storeName} name="store_name" defaultValue={storeName} placeholder={p.yourStore} />
            <Field label={p.email} value={email} />
            <Field label={p.phone} value="—" />
          </div>
          {state.error && <p className="ab-body" style={{ fontSize: 13, color: "var(--err)", marginTop: 16 }}>{state.error}</p>}
          {state.message && <p className="ab-body" style={{ fontSize: 13, color: "var(--ok)", marginTop: 16 }}>{state.message}</p>}
        </Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, marginTop: 4, marginBottom: 24 }}>
          <button type="submit" disabled={pending} className="ab-btn ab-btn-primary" style={{ opacity: pending ? 0.7 : 1 }}><Icon name="check" size={16} stroke={2.4} /> {pending ? t.dash.settings.saving : t.dash.settings.save}</button>
        </div>
      </form>
      <SubHead>{p.connectedMarkets}</SubHead>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {MARKETS.map(([m, s, c], i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: "var(--t-2)" }}>{m.slice(0, 2).toUpperCase()}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{m}</div><div className="ab-body" style={{ fontSize: 12, marginTop: 1, color: c ? "var(--ok)" : "var(--t-3)" }}>{p[s]}</div></div>
            <button className={c ? "ab-btn ab-btn-ghost ab-btn-sm" : "ab-btn ab-btn-primary ab-btn-sm"}>{c ? p.manage : p.connect}</button>
          </div>
        ))}
      </Card>
    </SettingsScaffold>
  );
}

function EditField({ label, name, defaultValue, placeholder }: { label: string; name: string; defaultValue: string; placeholder: string }) {
  return (
    <div>
      <div className="ab-eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{label}</div>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{ width: "100%", height: 44, padding: "0 14px", borderRadius: 11, background: "var(--bg)", border: "1px solid var(--border-mid)", fontSize: 14, color: "var(--t-1)", fontFamily: "var(--font)", outline: "none" }}
      />
    </div>
  );
}
