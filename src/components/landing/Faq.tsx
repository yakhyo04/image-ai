"use client";

import { useState } from "react";
import { Section, SectionHead, Icon } from "./ui";
import { useDict } from "@/i18n/context";

export function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 4px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "var(--t-1)", fontFamily: "var(--font)" }}>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.02em" }}>{q}</span>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: open ? "var(--acc)" : "var(--bg-2)", color: open ? "var(--acc-ink)" : "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s ease" }}>
          <Icon name={open ? "minus" : "plus"} size={17} stroke={2.2} />
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .3s cubic-bezier(.2,.7,.2,1)" }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--t-3)", padding: "0 50px 22px 4px" }}>{a}</div>
      </div>
    </div>
  );
}

export default function Faq() {
  const t = useDict();
  return (
    <Section id="faq">
      <div className="ab-faq-grid" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 64 }}>
        <div>
          <SectionHead tag={t.faq.tag} title={t.faq.title} />
          <div className="ab-body" style={{ fontSize: 15, marginTop: 18 }}>{t.faq.contactPrompt}</div>
          <button className="ab-btn ab-btn-ghost" style={{ marginTop: 16 }}><Icon name="send" size={15} /> {t.faq.contactBtn}</button>
        </div>
        <div>
          {t.faq.items.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />)}
        </div>
      </div>
    </Section>
  );
}
