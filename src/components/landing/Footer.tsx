import { Section, ArtboardMark, Icon } from "./ui";
import { LangSwitch } from "./Nav";
import ThemeToggle from "@/components/ThemeToggle";

const COLUMNS = [
  { h: "Product", links: ["Features", "Pricing", "Gallery", "Changelog", "Roadmap"] },
  { h: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { h: "Resources", links: ["Docs", "API", "Marketplace guides", "Support"] },
];

export default function Footer() {
  return (
    <Section id="footer" pad="32px 100px 56px">
      {/* footer columns */}
      <div className="ab-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40, paddingBottom: 40 }}>
        <div>
          <ArtboardMark size={22} />
          <div className="ab-body" style={{ fontSize: 13.5, marginTop: 16, maxWidth: 260 }}>AI-generated marketplace visuals for sellers across Central Asia and beyond.</div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <LangSwitch />
            <ThemeToggle />
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.h}>
            <div className="ab-eyebrow" style={{ marginBottom: 16 }}>{col.h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {col.links.map((l) => <a key={l} href="#" className="ab-nav-link" style={{ fontSize: 13.5 }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      {/* bottom bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", paddingTop: 28, borderTop: "1px solid var(--border)" }}>
        <span className="ab-body" style={{ fontSize: 13 }}>© 2026 Artboard. All rights reserved.</span>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <a href="#" className="ab-nav-link" style={{ fontSize: 13 }}>Privacy</a>
          <a href="#" className="ab-nav-link" style={{ fontSize: 13 }}>Terms</a>
          <div style={{ display: "flex", gap: 8 }}>
            {["globe", "send", "heart"].map((ic) => (
              <div key={ic} style={{ width: 34, height: 34, borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t-3)", cursor: "pointer" }}><Icon name={ic} size={16} /></div>
            ))}
          </div>
        </div>
      </div>
      {/* newsletter */}
      <div className="ab-news" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, padding: 20, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="ab-h4" style={{ fontSize: 16 }}>Get product updates</div>
          <div className="ab-body" style={{ fontSize: 13, marginTop: 3 }}>New tools and styles, monthly. No spam.</div>
        </div>
        <div style={{ display: "flex", gap: 8, width: 380, maxWidth: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 44, background: "var(--bg)", border: "1px solid var(--border-mid)", borderRadius: 12, color: "var(--t-3)" }}>
            <Icon name="send" size={15} /><span style={{ fontSize: 14 }}>you@store.com</span>
          </div>
          <button className="ab-btn ab-btn-primary">Subscribe</button>
        </div>
      </div>
    </Section>
  );
}
