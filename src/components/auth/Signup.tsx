"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField, PwField } from "./AuthShared";
import { signupAction, type AuthState } from "@/app/actions/auth";
import { useDict } from "@/i18n/context";

export default function Signup() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signupAction, {});
  const s = useDict().auth.signup;

  return (
    <AuthLayout variant="signup">
      <div className="ab-eyebrow">{s.eyebrow}</div>
      <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>{s.title}</h2>
      <p className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>
        {s.haveOne} <Link href="/login" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>{s.logIn}</Link>
      </p>

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 26 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AuthField label={s.fullName} icon="user" name="full_name" placeholder="Dilnoza R." />
          <AuthField label={s.storeName} icon="shopping-bag" name="store_name" placeholder="Brio Outwear" />
        </div>
        <AuthField label={s.email} icon="mail" type="email" name="email" placeholder="you@store.com" required />
        <PwField label={s.password} meter />
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 2, cursor: "pointer" }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><Icon name="check" size={13} stroke={3} /></span>
          <span className="ab-body" style={{ fontSize: 13 }}>{s.agree}</span>
        </label>
        {state.error && <p className="ab-body" style={{ fontSize: 13, color: "var(--err)" }}>{state.error}</p>}
        {state.message && <p className="ab-body" style={{ fontSize: 13, color: "var(--ok)" }}>{state.message}</p>}
        <button type="submit" disabled={pending} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 4, opacity: pending ? 0.7 : 1 }}>{pending ? s.creating : s.createAccount} <Icon name="arrow-right" size={17} stroke={2.2} /></button>
      </form>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, padding: "12px 14px", background: "var(--acc-soft)", border: "1px solid var(--acc-line)", borderRadius: 12 }}>
        <Icon name="bolt" size={16} style={{ color: "var(--acc)" }} />
        <span className="ab-body" style={{ fontSize: 13, color: "var(--t-2)" }}>{s.freeCreditsPre} <span style={{ color: "var(--acc)", fontWeight: 600 }}>{s.freeCreditsHi}</span> {s.freeCreditsPost}</span>
      </div>
    </AuthLayout>
  );
}
