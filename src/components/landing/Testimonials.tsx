import { Section, SectionHead, Icon } from "./ui";
import { getDict } from "@/i18n/server";

const AUTHORS = [
  { who: "Dilnoza R.", role: "Brio Outwear · Uzum", init: "DR", tone: "var(--v-blue)" },
  { who: "Marat S.", role: "TechHub · Ozon", init: "MS", tone: "var(--v-violet)" },
  { who: "Aziza K.", role: "Uy Decor · Wildberries", init: "AK", tone: "var(--v-amber)" },
  { who: "Bekzod T.", role: "Sport Pro · Yandex", init: "BT", tone: "var(--acc)" },
];

export default async function Testimonials() {
  const t = await getDict();
  return (
    <Section id="testimonials" style={{ background: "var(--bg-1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <SectionHead center tag={t.testimonials.tag} title={t.testimonials.title} />
      <div className="ab-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginTop: 44 }}>
        {AUTHORS.map((c, i) => (
          <div key={i} className="ab-card" style={{ padding: 26, background: "var(--bg)" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>{[1, 2, 3, 4, 5].map((s) => <Icon key={s} name="star-fill" size={14} style={{ color: "var(--acc)" }} />)}</div>
            <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.5, color: "var(--t-1)" }}>“{t.testimonials.quotes[i]}”</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.tone, color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, border: "1px solid var(--border-mid)" }}>{c.init}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.who}</div>
                <div className="ab-body" style={{ fontSize: 12.5 }}>{c.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
