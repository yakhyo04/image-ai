export type InfographicStyle = "glass";

export type InfographicStyleMeta = {
  id: InfographicStyle;
  label: string;
  hint: string;
};

export const INFOGRAPHIC_STYLE_META: InfographicStyleMeta[] = [
  { id: "glass", label: "Glass", hint: "Atmospheric hero + glassy callouts" },
];

export const INFOGRAPHIC_STYLES: InfographicStyle[] =
  INFOGRAPHIC_STYLE_META.map((s) => s.id);
