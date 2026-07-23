"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField } from "./AuthShared";
import { requestResetAction, type AuthState } from "@/app/actions/auth";
import { useDict } from "@/i18n/context";

export default function Forgot() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(requestResetAction, {});
  const sent = Boolean(state.message);
  const f = useDict().auth.forgot;

  return (
    <AuthLayout variant="forgot">
      {!sent ? (
        <>
          <Link href="/login" className="ab-btn ab-btn-text" style={{ marginLeft: -10, marginBottom: 8 }}><Icon name="arrow-left" size={16} /> {f.backToLogin}</Link>
          <div className="ab-eyebrow">{f.eyebrow}</div>
          <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>{f.title}</h2>
          <p className="ab-body" style={{ fontSize: 14.5, marginTop: 10 }}>{f.sub}</p>
          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
            <AuthField label={f.email} icon="mail" type="email" name="email" placeholder="you@store.com" required />
            {state.error && <p className="ab-body" style={{ fontSize: 13, color: "var(--err)" }}>{state.error}</p>}
            <button type="submit" disabled={pending} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ opacity: pending ? 0.7 : 1 }}><Icon name="send" size={16} /> {pending ? f.sending : f.sendLink}</button>
          </form>
          <p className="ab-body" style={{ fontSize: 13, marginTop: 24, textAlign: "center" }}>{f.remembered} <Link href="/login" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>{f.logInInstead}</Link></p>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--acc-soft)", border: "1px solid var(--acc-line)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Icon name="mail" size={32} /></div>
          <div className="ab-eyebrow">{f.checkInbox}</div>
          <h2 className="ab-h2" style={{ fontSize: 28, marginTop: 10 }}>{f.sentTitle}</h2>
          <p className="ab-body" style={{ fontSize: 14.5, marginTop: 12 }}>{state.message} {f.expires}</p>
          <a href="mailto:" className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 28 }}><Icon name="mail" size={16} /> {f.openEmail}</a>
          <Link href="/login" className="ab-btn ab-btn-ghost ab-btn-full" style={{ marginTop: 10 }}>{f.backToLogin}</Link>
        </div>
      )}
    </AuthLayout>
  );
}
