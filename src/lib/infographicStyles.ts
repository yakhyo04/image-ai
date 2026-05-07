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
