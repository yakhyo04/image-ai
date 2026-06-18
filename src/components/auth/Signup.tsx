"use client";

import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import { AuthLayout, AuthField, PwField, SocialRow, OrDivider } from "./AuthShared";

export default function Signup() {
  return (
    <AuthLayout variant="signup">
      <div className="ab-eyebrow">Get started — free</div>
      <h2 className="ab-h2" style={{ fontSize: 30, marginTop: 10 }}>Create your account</h2>
      <p className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>
        Already have one? <Link href="/login" style={{ color: "var(--acc)", fontWeight: 600, textDecoration: "none" }}>Log in</Link>
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 26 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <AuthField label="Full name" icon="user" placeholder="Dilnoza R." defaultValue="Dilnoza R." />
          <AuthField label="Store name" icon="shopping-bag" placeholder="Brio Outwear" defaultValue="Brio Outwear" />
        </div>
        <AuthField label="Email" icon="mail" type="email" placeholder="you@store.com" defaultValue="dilnoza@brio.uz" />
        <PwField label="Password" meter />
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 2, cursor: "pointer" }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--acc)", color: "var(--acc-ink)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}><Icon name="check" size={13} stroke={3} /></span>
          <span className="ab-body" style={{ fontSize: 13 }}>I agree to the <span style={{ color: "var(--t-1)", textDecoration: "underline" }}>Terms of Service</span> and <span style={{ color: "var(--t-1)", textDecoration: "underline" }}>Privacy Policy</span>.</span>
        </label>
        <Link href="/dashboard" className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 4 }}>Create account <Icon name="arrow-right" size={17} stroke={2.2} /></Link>
        <OrDivider />
        <SocialRow />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, padding: "12px 14px", background: "var(--acc-soft)", border: "1px solid var(--acc-line)", borderRadius: 12 }}>
        <Icon name="bolt" size={16} style={{ color: "var(--acc)" }} />
        <span className="ab-body" style={{ fontSize: 13, color: "var(--t-2)" }}>Start with <span style={{ color: "var(--acc)", fontWeight: 600 }}>30 free credits</span> — no card required.</span>
      </div>
    </AuthLayout>
  );
}
