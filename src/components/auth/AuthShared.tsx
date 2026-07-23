"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon, ArtboardMark } from "@/components/landing/ui";
import { LangSwitch } from "@/components/landing/Nav";
import BeforeAfter from "@/components/landing/BeforeAfter";
import { useDict } from "@/i18n/context";

export function AuthField({
  label, icon, type = "text", placeholder, name, defaultValue, required, trailing,
}: { label?: string; icon?: string; type?: string; placeholder?: string; name?: string; defaultValue?: string; required?: boolean; trailing?: ReactNode }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      {label && <div className="ab-eyebrow" style={{ fontSize: 10, marginBottom: 8 }}>{label}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 48, padding: "0 14px", borderRadius: 12, background: "var(--bg)", border: `1.5px solid ${focus ? "var(--acc)" : "var(--border-mid)"}`, transition: "border-color .15s ease" }}>
        {icon && <Icon name={icon} size={18} style={{ color: focus ? "var(--acc)" : "var(--t-3)", flexShrink: 0 }} />}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--t-1)", fontFamily: "var(--font)", fontSize: 14.5, letterSpacing: "-0.01em" }}
        />
        {trailing}
      </div>
    </div>
  );
}

export function PwField({ label = "Password", placeholder = "••••••••", name = "password", meter = false }: { label?: string; placeholder?: string; name?: string; meter?: boolean }) {
  const [show, setShow] = useState(false);
  const t = useDict();
  return (
    <div>
      <AuthField
        label={label}
        icon="lock"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        required
        trailing={
          <button onClick={() => setShow((s) => !s)} type="button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--t-3)", display: "flex", padding: 0 }}>
            <Icon name={show ? "eye-off" : "eye"} size={18} />
          </button>
        }
      />
      {meter && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 100, background: i <= 3 ? "var(--acc)" : "var(--bg-3)" }} />)}
          </div>
          <span className="ab-mono" style={{ fontSize: 10, color: "var(--acc)" }}>{t.auth.strong}</span>
        </div>
      )}
    </div>
  );
}

function AuthBrand({ variant }: { variant: "login" | "signup" | "forgot" }) {
  const t = useDict();
  const copy = t.auth.brand[variant];
  return (
    <div className="ab-auth-brand" style={{ position: "relative", overflow: "hidden", background: "var(--bg-1)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: 48 }}>
      <div className="ab-glow" style={{ width: 420, height: 420, background: "var(--acc)", top: -120, left: -100, opacity: 0.16 }} />
      <div className="ab-glow" style={{ width: 340, height: 340, background: "var(--v-blue)", bottom: -120, right: -120, opacity: 0.12 }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}><ArtboardMark size={24} /></Link>
        <LangSwitch />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", maxWidth: 440, padding: "40px 0" }}>
        <h1 className="ab-display" style={{ fontSize: 46 }}>{copy.t}</h1>
        <p className="ab-body" style={{ fontSize: 16.5, marginTop: 18, maxWidth: 400 }}>{copy.s}</p>
        <div className="ab-card" style={{ marginTop: 36, padding: 12, borderRadius: 20, maxWidth: 380, boxShadow: "var(--sh-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 10px" }}>
            <div style={{ display: "flex", gap: 5 }}>{["var(--err)", "var(--warn)", "var(--ok)"].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }} />)}</div>
            <span className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10, marginLeft: 4 }}>artboard.ai</span>
          </div>
          <BeforeAfter height={200} radius={13} />
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex" }}>
          {["var(--v-blue)", "var(--v-violet)", "var(--v-amber)", "var(--acc)"].map((c, i) => <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: "2px solid var(--bg-1)", marginLeft: i ? -9 : 0 }} />)}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star-fill" size={13} style={{ color: "var(--acc)" }} />)}</div>
          <span className="ab-body" style={{ fontSize: 12.5, marginTop: 3 }}>{t.auth.trustedBy}</span>
        </div>
      </div>
    </div>
  );
}

export function AuthLayout({ variant, children }: { variant: "login" | "signup" | "forgot"; children: ReactNode }) {
  return (
    <div className="ab-auth" style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "1.05fr 1fr", background: "var(--bg)", color: "var(--t-1)", fontFamily: "var(--font)" }}>
      <AuthBrand variant={variant} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
      </div>
    </div>
  );
}
