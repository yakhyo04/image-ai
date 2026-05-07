export type InfographicStyle =
  | "glass"
  | "cards"
  | "ticket"
  | "flagship"
  | "luxury"
  | "vivid"
  | "lifestyle"
  | "wellness";

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
  {
    id: "ticket",
    label: "Ticket Stub",
    hint: "Split-canvas editorial with ticket-design right side",
  },
  {
    id: "flagship",
    label: "Flagship Listing",
    hint: "Premium e-commerce product page with cropped hero",
  },
  {
    id: "luxury",
    label: "Luxury Editorial",
    hint: "Dark cinematic — premium fragrance / watch / whisky mood",
  },
  {
    id: "vivid",
    label: "Bold Vivid",
    hint: "Saturated single-color hero — scroll-stopping social commerce",
  },
  {
    id: "lifestyle",
    label: "Lifestyle Hero",
    hint: "Magazine scene in a real environment (Kinfolk / Aesop feel)",
  },
  {
    id: "wellness",
    label: "Wellness Apothecary",
    hint: "Warm monochromatic glow with botanical props — skincare / beauty",
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
