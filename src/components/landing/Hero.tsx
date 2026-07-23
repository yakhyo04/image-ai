import Link from "next/link";
import { Section, Icon } from "./ui";
import BeforeAfter from "./BeforeAfter";
import { getDict } from "@/i18n/server";

export default async function Hero() {
  const t = await getDict();
  const [titlePre, titlePost] = t.hero.title.split("{x}");
  return (
    <Section id="hero" pad="72px 100px 80px" style={{ overflow: "hidden" }}>
      <div className="ab-glow" style={{ width: 560, height: 420, background: "var(--acc)", top: -120, left: "50%", transform: "translateX(-50%)", opacity: 0.1 }} />
      <div className="ab-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", position: "relative" }}>
        <div>
          <div className="ab-chip ab-chip-acc" style={{ marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", animation: "ab-blink 1.5s ease infinite" }} />
            {t.hero.badge}
          </div>
          <h1 className="ab-display ab-hero-title">
            {titlePre}<span style={{ color: "var(--acc)" }}>{t.hero.titleAccent}</span>{titlePost}
          </h1>
          <p className="ab-body" style={{ fontSize: 18, marginTop: 22, maxWidth: 460 }}>
            {t.hero.subtitle}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="ab-btn ab-btn-grad ab-btn-lg">{t.hero.ctaPrimary} <Icon name="arrow-right" size={17} stroke={2.2} /></Link>
            <a href="#demo" className="ab-btn ab-btn-ghost ab-btn-lg"><Icon name="play" size={13} /> {t.hero.ctaDemo}</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex" }}>
                {["var(--v-blue)", "var(--v-violet)", "var(--v-amber)", "var(--acc)"].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid var(--bg)", marginLeft: i ? -8 : 0 }} />
                ))}
              </div>
              <span className="ab-body" style={{ fontSize: 13 }}>{t.hero.sellers}</span>
            </div>
            <div style={{ width: 1, height: 24, background: "var(--border)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((i) => <Icon key={i} name="star-fill" size={14} style={{ color: "var(--acc)" }} />)}
              <span className="ab-body" style={{ fontSize: 13, marginLeft: 4 }}>{t.hero.rating}</span>
            </div>
          </div>
        </div>

        {/* hero preview — before/after */}
        <div style={{ position: "relative" }}>
          <div className="ab-card" style={{ padding: 14, borderRadius: 26, boxShadow: "var(--sh-pop)", background: "var(--bg-1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 12px" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["var(--err)", "var(--warn)", "var(--ok)"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
              </div>
              <span className="ab-mono" style={{ color: "var(--t-3)", marginLeft: 6 }}>artboard.ai / generate</span>
              <span className="ab-chip ab-chip-acc" style={{ marginLeft: "auto", padding: "3px 9px", fontSize: 10 }}><Icon name="bolt-fill" size={10} /> 1.8s</span>
            </div>
            <BeforeAfter height={400} radius={16} beforeLabel={t.beforeAfter.before} afterLabel={t.beforeAfter.after} />
          </div>
          <div style={{ position: "absolute", bottom: -18, left: -22, background: "var(--bg-1)", border: "1px solid var(--border-mid)", borderRadius: 14, padding: "12px 16px", boxShadow: "var(--sh-2)", display: "flex", alignItems: "center", gap: 10, animation: "ab-float 4s ease-in-out infinite" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="sparkle-fill" size={17} /></div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.hero.conversion}</div>
              <div className="ab-mono" style={{ color: "var(--t-3)", fontSize: 10 }}>{t.hero.conversionSub}</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
