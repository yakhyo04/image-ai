export type InfographicStyle =
  | "glass"
  | "cards"
  | "ticket"
  | "flagship"
  | "luxury"
  | "vivid"
  | "lifestyle"
  | "wellness"
  | "model"
  | "meme"
  | "creative"
  | "studio"
  | "editorial"
  | "appliance"
  | "botanical"
  | "pastel"
  | "household"
  | "natural"
  | "dramatic"
  | "fashion"
  | "kinetic"
  | "liquid"
  | "streetwear"
  | "watercolor"
  | "beverage"
  | "fantasy"
  | "moss"
  | "wardrobe"
  | "specsheet"
  | "specsheet2"
  | "spiral"
  | "hanger"
  | "cozy"
  | "cloud"
  | "storm"
  | "royal"
  | "atelier"
  | "claymorphism"
  | "boutique"
  | "palette"
  | "lookbook"
  | "arc"
  | "silk"
  | "ribbed"
  | "brandkit"
  | "moda"
  | "muslin"
  | "boudoir"
  | "dreamy"
  | "spa"
  | "split"
  | "aqua"
  | "sunny"
  | "cascade"
  | "kicks"
  | "wipes"
  | "insole"
  | "tilewall"
  | "laundry"
  | "tactical"
  | "hydro"
  | "bulkpack"
  | "trailtech"
  | "multipack";

export type InfographicStyleMeta = {
  id: InfographicStyle;
  label: string;
  hint: string;
};

export const INFOGRAPHIC_STYLE_META: InfographicStyleMeta[] = [
  {
    id: "wipes",
    label: "wipes",
    hint: "wipes",
  },
  {
    id: "insole",
    label: "insole",
    hint: "insole",
  },
  {
    id: "tilewall",
    label: "tilewall",
    hint: "tilewall",
  },
  {
    id: "laundry",
    label: "laundry",
    hint: "laundry",
  },
  {
    id: "tactical",
    label: "tactical",
    hint: "tactical",
  },
  {
    id: "hydro",
    label: "hydro",
    hint: "hydro",
  },
  {
    id: "bulkpack",
    label: "bulkpack",
    hint: "bulkpack",
  },
  {
    id: "trailtech",
    label: "trailtech",
    hint: "trailtech",
  },
  {
    id: "multipack",
    label: "multipack",
    hint: "multipack",
  },
  {
    id: "kicks",
    label: "kicks",
    hint: "kicks",
  },
  {
    id: "cascade",
    label: "cascade",
    hint: "cascade",
  },
  {
    id: "sunny",
    label: "sunny",
    hint: "sunny",
  },
  {
    id: "aqua",
    label: "aqua",
    hint: "aqua",
  },
  {
    id: "split",
    label: "split",
    hint: "split",
  },
  {
    id: "spa",
    label: "spa",
    hint: "spa",
  },
  {
    id: "dreamy",
    label: "dreamy",
    hint: "dreamy",
  },
  {
    id: "boudoir",
    label: "boudoir",
    hint: "boudoir",
  },
  {
    id: "muslin",
    label: "muslin",
    hint: "muslin",
  },
  {
    id: "moda",
    label: "moda",
    hint: "moda",
  },
  {
    id: "brandkit",
    label: "❌ brandkit",
    hint: "brandkit",
  },
  {
    id: "ribbed",
    label: "ribbed",
    hint: "ribbed",
  },
  {
    id: "silk",
    label: "silk",
    hint: "silk",
  },
  {
    id: "arc",
    label: "✅ arc",
    hint: "arc",
  },
  {
    id: "boutique",
    label: "✅ boutique",
    hint: "boutique",
  },
  {
    id: "claymorphism",
    label: "❌ claymorphism",
    hint: "claymorphism",
  },
  {
    id: "palette",
    label: "❌ palette",
    hint: "palette",
  },
  {
    id: "lookbook",
    label: "❌ lookbook",
    hint: "lookbook",
  },
  {
    id: "atelier",
    label: "❌ atelier",
    hint: "atelier",
  },
  {
    id: "hanger",
    label: "❌ hanger",
    hint: "hanger",
  },
  {
    id: "cozy",
    label: "❌ cozy",
    hint: "cozy",
  },
  {
    id: "cloud",
    label: "❌ cloud",
    hint: "cloud",
  },
  {
    id: "storm",
    label: "❌ storm",
    hint: "storm",
  },
  {
    id: "royal",
    label: "❌ royal",
    hint: "royal",
  },
  {
    id: "spiral",
    label: "✅ spiral",
    hint: "spiral",
  },
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
  {
    id: "model",
    label: "On-Model Apparel",
    hint: "Fashion-catalog look — garment worn by a generated model",
  },
  {
    id: "meme",
    label: "Meme Poster",
    hint: "Viral magazine-cover poster with a comedic character + the product",
  },
  {
    id: "creative",
    label: "Creative Concept",
    hint: "Imaginative art-directed scene with one bold visual concept",
  },
  {
    id: "studio",
    label: "Studio Hero Shot",
    hint: "Clean professional product photo on a seamless backdrop",
  },
  {
    id: "editorial",
    label: "Editorial",
    hint: "Editorial",
  },
  {
    id: "appliance",
    label: "Appliance",
    hint: "Appliance",
  },
  {
    id: "botanical",
    label: "botanical",
    hint: "botanical",
  },
  {
    id: "pastel",
    label: "pastel",
    hint: "pastel",
  },
  {
    id: "household",
    label: "household",
    hint: "household",
  },
  {
    id: "natural",
    label: "natural",
    hint: "natural",
  },
  {
    id: "dramatic",
    label: "dramatic",
    hint: "dramatic",
  },
  {
    id: "fashion",
    label: "fashion",
    hint: "fashion",
  },
  {
    id: "kinetic",
    label: "kinetic",
    hint: "kinetic",
  },
  {
    id: "liquid",
    label: "liquid",
    hint: "liquid",
  },
  {
    id: "streetwear",
    label: "streetwear",
    hint: "streetwear",
  },
  {
    id: "watercolor",
    label: "watercolor",
    hint: "watercolor",
  },
  {
    id: "beverage",
    label: "beverage",
    hint: "beverage",
  },
  {
    id: "fantasy",
    label: "fantasy",
    hint: "fantasy",
  },
  {
    id: "moss",
    label: "moss",
    hint: "moss",
  },
  {
    id: "wardrobe",
    label: "wardrobe",
    hint: "wardrobe",
  },
  {
    id: "specsheet",
    label: "specsheet",
    hint: "specsheet",
  },
  {
    id: "specsheet2",
    label: "specsheet2",
    hint: "specsheet2",
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
