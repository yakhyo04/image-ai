import { Section, SectionHead, Icon } from "./ui";

const STEPS = [
  { n: "01", icon: "upload", title: "Upload", desc: "Drop a single product photo — phone snapshot is fine.", tone: "var(--v-blue)" },
  { n: "02", icon: "grid", title: "Choose style", desc: "Pick a preset: infographic, lifestyle, studio, interior, mockup.", tone: "var(--v-violet)" },
  { n: "03", icon: "sparkle-fill", title: "Generate", desc: "Get four polished, marketplace-ready variants in under two minutes.", tone: "var(--acc)" },
];

export default function HowItWorks() {
  return (
    <Section id="how" style={{ background: "var(--bg-1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <SectionHead center tag="How it works" title="Three steps to a better listing" sub="No briefs, no revisions, no back-and-forth. From raw photo to ready in minutes." />
      <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 52, position: "relative" }}>
        <div className="ab-how-line" style={{ position: "absolute", top: 54, left: "17%", right: "17%", height: 2, background: "repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 16px)" }} />
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
            <div style={{ width: 108, height: 108, borderRadius: 28, margin: "0 auto", background: "var(--bg)", border: "1px solid var(--border-mid)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "var(--sh-2)" }}>
              <div style={{ width: 56, height: 56, borderRadius: 17, background: i === 2 ? "var(--acc)" : "var(--bg-2)", color: i === 2 ? "var(--acc-ink)" : s.tone, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={s.icon} size={28} /></div>
              <span style={{ position: "absolute", top: -10, right: -6, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--acc)", background: "var(--acc-soft)", border: "1px solid var(--acc-line)", padding: "2px 8px", borderRadius: 100 }}>{s.n}</span>
            </div>
            <div className="ab-h3" style={{ fontSize: 21, marginTop: 24 }}>{s.title}</div>
            <div className="ab-body" style={{ fontSize: 14.5, marginTop: 10, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
