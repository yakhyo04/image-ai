import Link from "next/link";
import { Section, SectionHead, Icon } from "./ui";
import { getDict } from "@/i18n/server";

// Visual config; title/desc come from the dictionary keyed by `key`.
const FEATS = [
  { key: "infographics", icon: "sliders", tone: "oklch(0.34 0.07 200)", href: "/tools/infographics" },
  { key: "editor", icon: "magic", tone: "oklch(0.32 0.08 25)", href: "/tools/editor" },
  { key: "interior", icon: "sofa", tone: "oklch(0.33 0.06 130)", href: "/tools/interior" },
  { key: "mockups", icon: "box", tone: "oklch(0.32 0.07 300)", href: "/tools/mockups" },
  { key: "backgrounds", icon: "scissors", tone: "oklch(0.34 0.06 250)", href: "/tools/backgrounds" },
  { key: "patterns", icon: "palette", tone: "oklch(0.34 0.08 70)", href: "/tools/patterns" },
] as const;

function FeatureCard({ icon, title, desc, tone, href, learnMore }: { icon: string; title: string; desc: string; tone: string; href: string; learnMore: string }) {
  return (
    <div className="ab-card" style={{ padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 116, borderRadius: 14, marginBottom: 18, position: "relative", overflow: "hidden", background: tone, border: "1px solid var(--border-mid)" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 9px)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, width: 38, height: 38, borderRadius: 11, background: "oklch(0 0 0 / 0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(1 0 0 / 0.95)" }}><Icon name={icon} size={20} /></div>
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", gap: 6 }}>
          <div style={{ flex: 2, height: 8, borderRadius: 4, background: "oklch(1 0 0 / 0.25)" }} />
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--acc)", opacity: 0.85 }} />
        </div>
      </div>
      <div className="ab-h4" style={{ fontSize: 16.5 }}>{title}</div>
      <div className="ab-body" style={{ fontSize: 13.5, marginTop: 7 }}>{desc}</div>
      <Link href={href} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, color: "var(--acc)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>{learnMore} <Icon name="arrow-right" size={14} stroke={2.2} /></Link>
    </div>
  );
}

export default async function Features() {
  const t = await getDict();
  return (
    <Section id="features">
      <SectionHead center tag={t.features.tag} title={t.features.title} sub={t.features.sub} />
      <div className="ab-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 48 }}>
        {FEATS.map((f) => {
          const item = t.features.items[f.key];
          return <FeatureCard key={f.key} icon={f.icon} tone={f.tone} href={f.href} title={item.title} desc={item.desc} learnMore={t.features.learnMore} />;
        })}
      </div>
    </Section>
  );
}
