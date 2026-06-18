"use client";

import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField, PwField, SocialRow, OrDivider } from "./AuthShared";

export default function Login() {
  return (
    <AuthLayout variant="login">
      <div className="ab-eyebrow">Sign in</div>
      <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>Log in to Artboard</h2>
      <p className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>
        New here? <Link href="/signup" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 30 }}>
        <AuthField label="Email" icon="mail" type="email" placeholder="you@store.com" defaultValue="dilnoza@brio.uz" />
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="ab-eyebrow" style={{ fontSize: 10 }}>Password</span>
            <Link href="/forgot-password" style={{ fontSize: 12, color: "var(--acc)", fontWeight: 500, textDecoration: "none" }}>Forgot?</Link>
          </div>
          <PwField label="" />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={13} stroke={3} /></span>
          <span className="ab-body" style={{ fontSize: 13.5 }}>Keep me signed in</span>
        </label>
        <Link href="/dashboard" className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 4 }}>Log in <Icon name="arrow-right" size={17} stroke={2.2} /></Link>
        <OrDivider />
        <SocialRow />
      </div>
      <p className="ab-body" style={{ fontSize: 12, marginTop: 28, textAlign: "center" }}>
        By continuing you agree to our <span style={{ color: "var(--t-2)", textDecoration: "underline", cursor: "pointer" }}>Terms</span> &amp; <span style={{ color: "var(--t-2)", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
      </p>
    </AuthLayout>
  );
}
