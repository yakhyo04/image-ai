"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField } from "./AuthShared";
import { requestResetAction, type AuthState } from "@/app/actions/auth";

export default function Forgot() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(requestResetAction, {});
  const sent = Boolean(state.message);

  return (
    <AuthLayout variant="forgot">
      {!sent ? (
        <>
          <Link href="/login" className="ab-btn ab-btn-text" style={{ marginLeft: -10, marginBottom: 8 }}><Icon name="arrow-left" size={16} /> Back to log in</Link>
          <div className="ab-eyebrow">Reset password</div>
          <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>Forgot your password?</h2>
          <p className="ab-body" style={{ fontSize: 14.5, marginTop: 10 }}>Enter the email on your account and we’ll send a secure link to reset your password.</p>
          <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
            <AuthField label="Email" icon="mail" type="email" name="email" placeholder="you@store.com" required />
            {state.error && <p className="ab-body" style={{ fontSize: 13, color: "var(--err)" }}>{state.error}</p>}
            <button type="submit" disabled={pending} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ opacity: pending ? 0.7 : 1 }}><Icon name="send" size={16} /> {pending ? "Sending…" : "Send reset link"}</button>
          </form>
          <p className="ab-body" style={{ fontSize: 13, marginTop: 24, textAlign: "center" }}>Remembered it? <Link href="/login" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>Log in instead</Link></p>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--acc-soft)", border: "1px solid var(--acc-line)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Icon name="mail" size={32} /></div>
          <div className="ab-eyebrow">Check your inbox</div>
          <h2 className="ab-h2" style={{ fontSize: 28, marginTop: 10 }}>Reset link sent</h2>
          <p className="ab-body" style={{ fontSize: 14.5, marginTop: 12 }}>{state.message} The link expires in 30 minutes.</p>
          <a href="mailto:" className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 28 }}><Icon name="mail" size={16} /> Open email app</a>
          <Link href="/login" className="ab-btn ab-btn-ghost ab-btn-full" style={{ marginTop: 10 }}>Back to log in</Link>
        </div>
      )}
    </AuthLayout>
  );
}
