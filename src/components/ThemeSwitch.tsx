"use client";

import { useEffect, useState } from "react";

/** A pill toggle wired to the real app theme (light/dark). */
export default function ThemeSwitch() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  const on = mounted && dark;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label="Toggle dark mode"
      style={{ width: 42, height: 24, borderRadius: 100, border: "none", cursor: "pointer", background: on ? "var(--acc)" : "var(--bg-3)", position: "relative", transition: "background .15s ease", flexShrink: 0 }}
    >
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: on ? "var(--acc-ink)" : "var(--t-2)", transition: "left .15s ease" }} />
    </button>
  );
}
