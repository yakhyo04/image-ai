"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict } from "./index";
import type { Locale } from "./config";

type Ctx = { locale: Locale; dict: Dict };

const LocaleContext = createContext<Ctx | null>(null);

// Mounted once in the root layout with the server-resolved locale + dict, so
// any client component can read translations without a round-trip.
export function LocaleProvider({ locale, dict, children }: Ctx & { children: ReactNode }) {
  return <LocaleContext.Provider value={{ locale, dict }}>{children}</LocaleContext.Provider>;
}

export function useDict(): Dict {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useDict must be used within LocaleProvider");
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx.locale;
}
