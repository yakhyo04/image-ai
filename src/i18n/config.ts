// Supported UI locales. Uzbek and Russian are first-class alongside English
// for the Central-Asian marketplace-seller audience.
export const LOCALES = ["en", "uz", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

// Default when no cookie is set. Change this to "uz" or "ru" to switch the
// out-of-the-box language.
export const DEFAULT_LOCALE: Locale = "en";

// Cookie the chosen locale is stored in. Not httpOnly, so the client
// LangSwitch can set it directly and the server can read it on next render.
export const LOCALE_COOKIE = "lang";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  uz: "UZ",
  ru: "RU",
};

export function resolveLocale(value: string | undefined | null): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}
