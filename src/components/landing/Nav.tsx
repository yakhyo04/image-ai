"use client";

import Link from "next/link";
import { useState } from "react";
import { ArtboardMark, Icon } from "./ui";
import { useDict, useLocale } from "@/i18n/context";
import { LOCALES, LOCALE_LABELS, LOCALE_COOKIE, type Locale } from "@/i18n/config";

export function LangSwitch() {
  const active = useLocale();

  function choose(l: Locale) {
    if (l === active) return;
    // Persist for a year and reload so both server and client components
    // re-render in the chosen language.
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 3, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 100 }}>
      <Icon name="globe" size={15} style={{ color: "var(--t-3)", margin: "0 4px 0 6px" }} />
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => choose(l)}
          style={{
            padding: "5px 11px", borderRadius: 100, border: "none", cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
            background: active === l ? "var(--acc)" : "transparent",
            color: active === l ? "var(--acc-ink)" : "var(--t-3)",
            transition: "all .15s ease",
          }}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

export default function Nav({ authed = false }: { authed?: boolean }) {
  const [open, setOpen] = useState(false);
  const t = useDict();
  const LINKS = [
    { label: t.nav.features, href: "/#features" },
    { label: t.nav.pricing, href: "/#pricing" },
    { label: t.nav.gallery, href: "/#gallery" },
    { label: t.nav.docs, href: "/#faq" },
  ];
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
              {t.nav.dashboard} <Icon name="arrow-right" size={15} stroke={2.2} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="ab-nav-link">{t.nav.login}</Link>
              <Link href="/signup" className="ab-btn ab-btn-grad ab-btn-sm" style={{ padding: "10px 18px" }}>
                {t.nav.getStarted} <Icon name="arrow-right" size={15} stroke={2.2} />
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
              <Link href="/dashboard" onClick={() => setOpen(false)} className="ab-btn ab-btn-grad ab-btn-sm" style={{ flex: 1 }}>{t.nav.dashboard}</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="ab-btn ab-btn-ghost ab-btn-sm" style={{ flex: 1 }}>{t.nav.login}</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="ab-btn ab-btn-grad ab-btn-sm" style={{ flex: 1 }}>{t.nav.getStarted}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
