export type InfographicStyle = "glass" | "cards";

export type InfographicStyleMeta = {
  id: InfographicStyle;
  label: string;
  hint: string;
};

export const INFOGRAPHIC_STYLE_META: InfographicStyleMeta[] = [
  {
    id: "glass",
    label: "Glassmorphism",
    hint: "Editorial daylight scene with frosted glass bubbles",
  },
  {
    id: "cards",
    label: "4 Product Cards",
    hint: "Marketplace 2×2 grid (Wildberries / Ozon)",
  },
];

export const INFOGRAPHIC_STYLES: InfographicStyle[] =
  INFOGRAPHIC_STYLE_META.map((s) => s.id);

export type InfographicLanguage = "en" | "ru" | "uz";

export type InfographicLanguageMeta = {
  id: InfographicLanguage;
  label: string;
  hint: string;
};

export const INFOGRAPHIC_LANGUAGE_META: InfographicLanguageMeta[] = [
  { id: "en", label: "English", hint: "On-image text in English" },
  { id: "ru", label: "Русский", hint: "On-image text in Russian" },
  { id: "uz", label: "O'zbekcha", hint: "On-image text in Uzbek (Latin)" },
];

export const INFOGRAPHIC_LANGUAGES: InfographicLanguage[] =
  INFOGRAPHIC_LANGUAGE_META.map((l) => l.id);
