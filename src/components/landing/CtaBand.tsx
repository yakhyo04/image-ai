import Link from "next/link";
import { Section, Icon } from "./ui";
import { getDict } from "@/i18n/server";

export default async function CtaBand() {
  const t = await getDict();
  return (
    <Section id="cta" pad="40px 100px 24px">
      <div style={{ position: "relative", borderRadius: 32, overflow: "hidden", background: "var(--grad)", padding: "64px 56px", textAlign: "center", color: "var(--acc-ink)" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(0 0 0 / 0.04) 0 1px, transparent 1px 16px)" }} />
        <div style={{ position: "relative" }}>
          <h2 className="ab-h1 ab-cta-title" style={{ fontSize: 46, color: "var(--acc-ink)" }}>
            {t.cta.titleA}<br />{t.cta.titleB}
          </h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="ab-btn ab-btn-lg" style={{ background: "var(--acc-ink)", color: "var(--acc)" }}>{t.cta.primary} <Icon name="arrow-right" size={17} stroke={2.2} /></Link>
            <Link href="/dashboard" className="ab-btn ab-btn-lg" style={{ background: "oklch(0 0 0 / 0.12)", color: "var(--acc-ink)", border: "1px solid oklch(0 0 0 / 0.2)" }}>{t.cta.demo}</Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
