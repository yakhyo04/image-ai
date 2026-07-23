"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtboardMark, Icon } from "./ui";

const LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Docs", href: "/#faq" },
];

const LANGS = ["UZ", "RU", "EN"] as const;

export function LangSwitch() {
  const [lang, setLang] = useState<(typeof LANGS)[number]>("EN");
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 3, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 100 }}>
      <Icon name="globe" size={15} style={{ color: "var(--t-3)", margin: "0 4px 0 6px" }} />
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: "5px 11px", borderRadius: 100, border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
            background: lang === l ? "var(--acc)" : "transparent",
            color: lang === l ? "var(--acc-ink)" : "var(--t-3)",
            transition: "all .15s ease",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Nav({ authed = false }: { authed?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--bg-glass)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="ab-nav-inner">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}><ArtboardMark size={23} /></Link>

        <nav className="ab-nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="ab-nav-link">{l.label}</a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div className="ab-nav-actions">
          {authed ? (
            <Link href="/dashboard" className="ab-btn ab-btn-grad ab-btn-sm" style={{ padding: "10px 18px" }}>
              Dashboard <Icon name="arrow-right" size={15} stroke={2.2} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="ab-nav-link">Log in</Link>
              <Link href="/signup" className="ab-btn ab-btn-grad ab-btn-sm" style={{ padding: "10px 18px" }}>
                Get Started <Icon name="arrow-right" size={15} stroke={2.2} />
              </Link>
            </>
          )}
        </div>

        <div className="ab-nav-mobile">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ width: 38, height: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--t-1)", cursor: "pointer" }}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)", padding: "16px 24px" }} className="ab-nav-mobile-panel">
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="ab-nav-link" style={{ padding: "10px 0" }}>{l.label}</a>
            ))}
          </nav>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
            {authed ? (
              <Link href="/dashboard" onClick={() => setOpen(false)} className="ab-btn ab-btn-grad ab-btn-sm" style={{ flex: 1 }}>Dashboard</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="ab-btn ab-btn-ghost ab-btn-sm" style={{ flex: 1 }}>Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="ab-btn ab-btn-grad ab-btn-sm" style={{ flex: 1 }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
