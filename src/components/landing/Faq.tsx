"use client";

import { useState } from "react";
import { Section, SectionHead, Icon } from "./ui";

const FAQS = [
  { q: "Do I need any design skills?", a: "None at all. Upload a product photo, pick a style preset, and Artboard handles composition, lighting, and text. You can fine-tune with a prompt if you want.", open: true },
  { q: "Which marketplaces are supported?", a: "Exports come with size presets for Wildberries, Ozon, Uzum, Yandex Market, and more — including the exact pixel dimensions each platform requires." },
  { q: "Can I generate text in Uzbek or Russian?", a: "Yes. On-image text can be generated in UZ, RU, or EN, and you can switch languages per generation without re-uploading." },
  { q: "What about commercial rights?", a: "Pro and Business plans include a full commercial license. Everything you generate is yours to use in listings and ads." },
  { q: "How do credits work?", a: "Each generation uses credits based on quality and tool. Unused monthly credits roll over for 30 days on paid plans." },
];

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
  return (
    <Section id="faq">
      <div className="ab-faq-grid" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 64 }}>
        <div>
          <SectionHead tag="FAQ" title="Questions, answered" />
          <div className="ab-body" style={{ fontSize: 15, marginTop: 18 }}>Can’t find what you’re looking for?</div>
          <button className="ab-btn ab-btn-ghost" style={{ marginTop: 16 }}><Icon name="send" size={15} /> Contact support</button>
        </div>
        <div>
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={f.open} />)}
        </div>
      </div>
    </Section>
  );
}
