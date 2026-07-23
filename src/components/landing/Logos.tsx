import { Section } from "./ui";
import { getDict } from "@/i18n/server";

const LOGOS = ["Wildberries", "Ozon", "Uzum", "Yandex Market", "KazanExpress", "AliExpress"];

export default async function Logos() {
  const t = await getDict();
  return (
    <Section id="logos" pad="0 100px 64px">
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <span className="ab-eyebrow">{t.logos.eyebrow}</span>
      </div>
      <div className="ab-logos-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "28px 40px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        {LOGOS.map((l) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 9, opacity: 0.55, filter: "grayscale(1)" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--t-3)", opacity: 0.4 }} />
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--t-2)" }}>{l}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
