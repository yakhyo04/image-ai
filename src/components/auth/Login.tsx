"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField, PwField } from "./AuthShared";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { useDict } from "@/i18n/context";

export default function Login() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(loginAction, {});
  const l = useDict().auth.login;

  return (
    <AuthLayout variant="login">
      <div className="ab-eyebrow">{l.eyebrow}</div>
      <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>{l.title}</h2>
      <p className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>
        {l.newHere} <Link href="/signup" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>{l.createAccount}</Link>
      </p>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
        <AuthField label={l.email} icon="mail" type="email" name="email" placeholder="you@store.com" required />
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="ab-eyebrow" style={{ fontSize: 10 }}>{l.password}</span>
            <Link href="/forgot-password" style={{ fontSize: 12, color: "var(--acc)", fontWeight: 500, textDecoration: "none" }}>{l.forgot}</Link>
          </div>
          <PwField label="" />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={13} stroke={3} /></span>
          <span className="ab-body" style={{ fontSize: 13.5 }}>{l.keepSignedIn}</span>
        </label>
        {state.error && <p className="ab-body" style={{ fontSize: 13, color: "var(--err)" }}>{state.error}</p>}
        <button type="submit" disabled={pending} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 4, opacity: pending ? 0.7 : 1 }}>{pending ? l.loggingIn : l.logIn} <Icon name="arrow-right" size={17} stroke={2.2} /></button>
      </form>
      <p className="ab-body" style={{ fontSize: 12, marginTop: 28, textAlign: "center" }}>{l.termsNote}</p>
    </AuthLayout>
  );
}
