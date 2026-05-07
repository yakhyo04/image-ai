import { GoogleGenAI, type Content, type Part } from "@google/genai";
import { INFOGRAPHIC_STYLES, type InfographicStyle } from "./infographicStyles";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment");
}

export const ai = new GoogleGenAI({ apiKey });

export const IMAGE_MODEL = "gemini-3-pro-image-preview";
export const INFOGRAPHIC_MODEL = "gemini-3-pro-image-preview";

export type Turn = {
  role: "user" | "model";
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
};

export type EditResult = {
  imageBase64: string;
  mimeType: string;
  text?: string;
};

export type InlineImage = {
  base64: string;
  mimeType: string;
};

export type InfographicAspect = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export { INFOGRAPHIC_STYLES, type InfographicStyle };

export type InfographicInput = {
  images: InlineImage[];
  description?: string;
  aspectRatio?: InfographicAspect;
  style?: InfographicStyle;
};

function turnToContent(turn: Turn): Content {
  const parts: Part[] = [];
  if (turn.imageBase64) {
    parts.push({
      inlineData: {
        mimeType: turn.imageMimeType ?? "image/png",
        data: turn.imageBase64,
      },
    });
  }
  if (turn.text) parts.push({ text: turn.text });
  return { role: turn.role, parts };
}

function extractImage(
  response: Awaited<ReturnType<typeof ai.models.generateContent>>,
): EditResult {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  let imageBase64: string | undefined;
  let mimeType = "image/png";
  let text: string | undefined;

  for (const part of parts) {
    if (part.inlineData?.data) {
      imageBase64 = part.inlineData.data;
      if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
    } else if (part.text) {
      text = (text ? text + "\n" : "") + part.text;
    }
  }

  if (!imageBase64) {
    throw new Error(
      text
        ? `Gemini returned no image. Message: ${text}`
        : "Gemini returned no image (likely blocked by safety filters).",
    );
  }

  return { imageBase64, mimeType, text };
}

export async function editImage(turns: Turn[]): Promise<EditResult> {
  const contents = turns.map(turnToContent);

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents,
  });

  return extractImage(response);
}

// 4 product cards
// function buildInfographicPrompt(description?: string): string {
//   const trimmed = description?.trim() ?? "";
//   return [
//     "Design ONE marketplace infographic in the style used on Wildberries / Ozon",
//     "premium product listings: a 2x2 grid of four separate rounded-corner panels",
//     "on a light neutral background, sharing a single cohesive color story derived",
//     "from the product itself.",
//     "",
//     "Panel layout:",
//     "- Top-left (HERO): oversized product name as the dominant typographic element",
//     "  (huge soft-tone letters, partially overlapped by the product). Cinematic",
//     "  product hero shot. One small floating chip with a key fact (e.g. what's in",
//     "  the box). Light background.",
//     "- Top-right (SPECS / FEATURES): 4 small sub-tiles inside this panel, each a",
//     "  tightly cropped close-up of a different physical detail with a short label",
//     "  + one-line caption. Mix of dark-background tiles and light-background tiles.",
//     "- Bottom-left (MODES / USE CASES): single dark moody panel, dramatic cropped",
//     "  product shot, two short labels with one-line captions placed in negative space.",
//     "- Bottom-right (BENEFITS): light panel, product shown from a different angle,",
//     "  3 stacked benefit blocks (bold short title + 2-3 line caption).",
//     "",
//     "Typography: bold sans-serif. Strong size hierarchy — huge, medium, small.",
//     "Headline weight heavy; body weight regular. Labels are short (1-3 words).",
//     "",
//     "Strict no's: no circular icon badges with thin-line icons, no arrow callouts",
//     "pointing at a centered product, no rainbow color accents, no stock-template feel.",
//     "",
//     "Render the product faithfully from the attached reference photos — accurate",
//     "color, shape, branding, proportions. Recompose and relight freely.",
//     "",
//     "CRITICAL — Language rule:",
//     "Detect the natural language of the description and write ALL on-image text",
//     "in EXACTLY that language. Do not translate or mix languages.",
//     "",
//     "Hard rules:",
//     "- Output exactly ONE image containing the four panels.",
//     "- No watermarks, no fake logos, no fabricated brand names.",
//     "- All text spelled correctly.",
//     "",
//     "Product description:",
//     '"""',
//     trimmed,
//     '"""',
//   ].join("\n");
// }

function buildInfographicPrompt(
  description: string | undefined,
  style: InfographicStyle,
): string {
  const trimmed = description?.trim() ?? "";

  if (style === "cards") {
    return [
      "Design ONE marketplace infographic in the style used on Wildberries / Ozon",
      "premium product listings: a 2x2 grid of four separate rounded-corner panels",
      "on a light neutral background, sharing a single cohesive color story derived",
      "from the product itself.",
      "",
      "Panel layout:",
      "- Top-left (HERO): oversized product name as the dominant typographic element",
      "  (huge soft-tone letters, partially overlapped by the product). Cinematic",
      "  product hero shot. One small floating chip with a key fact (e.g. what's in",
      "  the box). Light background.",
      "- Top-right (SPECS / FEATURES): 4 small sub-tiles inside this panel, each a",
      "  tightly cropped close-up of a different physical detail with a short label",
      "  + one-line caption. Mix of dark-background tiles and light-background tiles.",
      "- Bottom-left (MODES / USE CASES): single dark moody panel, dramatic cropped",
      "  product shot, two short labels with one-line captions placed in negative space.",
      "- Bottom-right (BENEFITS): light panel, product shown from a different angle,",
      "  3 stacked benefit blocks (bold short title + 2-3 line caption).",
      "",
      "Typography: bold sans-serif. Strong size hierarchy — huge, medium, small.",
      "Headline weight heavy; body weight regular. Labels are short (1-3 words).",
      "",
      "Strict no's: no circular icon badges with thin-line icons, no arrow callouts",
      "pointing at a centered product, no rainbow color accents, no stock-template feel.",
      "",
      "Render the product faithfully from the attached reference photos — accurate",
      "color, shape, branding, proportions. Recompose and relight freely.",
      "",
      "CRITICAL — Language rule:",
      "Detect the natural language of the description and write ALL on-image text",
      "in EXACTLY that language. Do not translate or mix languages.",
      "",
      "Hard rules:",
      "- Output exactly ONE image containing the four panels.",
      "- No watermarks, no fake logos, no fabricated brand names.",
      "- All text spelled correctly.",
      "",
      "Product description:",
      '"""',
      trimmed,
      '"""',
    ].join("\n");
  }

  // default: glass
  return [
    "Create ONE editorial product advertisement in glassmorphism style. The",
    "ENTIRE composition must feel layered with glass — not just the callouts.",
    "",
    "Setting — choose CONTEXTUALLY based on the product, build either:",
    "(a) A bright interior suited to the product's lifestyle context, OR",
    "(b) A styled commercial scene with THEMED props on a complementary",
    "    backdrop that reinforces the product's identity:",
    "    - Sea / ocean / fresh → sand, seashells, coral, soft teal backdrop.",
    "    - Garden / floral / botanical → leaves, petals, soft green backdrop.",
    "    - Citrus / tropical → fruit slices, palm leaves, warm yellow backdrop.",
    "    - Winter / mint / cool → frost, eucalyptus, pale blue backdrop.",
    "    - Forest / woody / spice → bark, dried botanicals, warm brown backdrop.",
    "    - Beauty / skincare → soft drapery, marble, pearl tones.",
    "    - Apparel → sunlit bedroom, linen, pale wood floor.",
    "    - Tech → modern desk, pale concrete or oak.",
    "    - Kitchen / food → wooden table, marble counter, fresh ingredients.",
    "    - Bath / shower / plumbing → marble bathroom, pale tile, soft daylight.",
    "    - Toys / kids → pastel nursery, soft playful props.",
    "",
    "If no theme is obvious, choose a bright interior that fits. The setting",
    "must always be bright with atmospheric depth. Vary specific props per",
    "product so different products do NOT share the same backdrop.",
    "",
    "Glassmorphism scene staging — the COMPOSITION must feel glass-layered:",
    "- The product is staged WITH at least one large translucent or frosted",
    "  glass element in the scene, chosen to fit the product type:",
    "    • Tabletop / standing products (bottles, jars, gadgets) → a clear",
    "      glass shelf or pedestal beneath the product PLUS a tall translucent",
    "      glass panel positioned behind it as a vertical backdrop layer.",
    "    • Wall-mounted products (shower, faucets, sconces) → a tall frosted",
    "      glass shower screen, glass partition, or translucent glass panel",
    "      visible alongside the product as an architectural element.",
    "    • Apparel / textile (folded shirts, fabrics) → a clear glass tray or",
    "      acrylic platter beneath, plus a soft frosted glass panel behind.",
    "    • Footwear → a low glass platform beneath plus a vertical frosted",
    "      glass panel behind for depth.",
    "- These glass staging elements must have real glass physics: subtle",
    "  refraction of the background through them, defined edges, soft",
    "  highlights along the upper rim, gentle inner reflections.",
    "- A subtle atmospheric haze and gentle bloom around bright areas",
    "  reinforce the soft, layered, glass-like feel of the whole scene.",
    "- Together with the bubble callouts, this staging creates layered",
    "  glassmorphism across the entire image — never just on the callouts.",
    "",
    "Composition — the PRODUCT is the unquestionable hero:",
    "- Large and dominant, occupying 55–65% of frame height, fully in frame.",
    "- Centered or slightly off-center, three-quarter angle, slightly tilted.",
    "- Shallow depth of field, 85mm lens feel, photoreal magazine quality.",
    "",
    "Typography — ONE single headline only. NO subtitle, NO tagline:",
    "- HEADLINE: SHORT product name, 2–3 words MAX (prefer 2). Distill from",
    "  the description; never paste the full SKU. Set in a beautiful editorial",
    "  serif with subtle weight variation between words, generous letter-",
    "  spacing, in a near-black or deep tone that reads cleanly against the",
    "  scene. Placed in prominent negative space beside the product.",
    "- DO NOT add any tagline, subtitle, descriptor line, product type label,",
    "  size/volume label, or secondary text beneath the headline. The headline",
    "  stands alone. All product attributes belong inside the glass bubbles.",
    "- CRITICAL: the headline appears ONCE and ONLY ONCE in the entire image.",
    "  NEVER duplicate it, NEVER render it twice in different colors.",
    "- The headline sits DIRECTLY on the background. It is NOT contained in",
    "  any frosted glass card or panel.",
    "",
    "Glass bubble callouts — supporting glassmorphism element:",
    "- Exactly 2–3 small frosted glass BUBBLES (rounded blob, teardrop, or",
    "  oval shapes — NOT rectangular cards) float asymmetrically around the",
    "  product.",
    "- Each bubble must read as REAL TRANSPARENT GLASS:",
    "    • Visibly transparent center showing the blurred refracted background.",
    "    • A sharp curved highlight along the upper edge.",
    "    • A softer secondary highlight along the lower-left edge.",
    "    • A thin, clearly-defined outer rim — the bubble must have a visible",
    "      glass edge, not fade into the background.",
    "    • A soft drop shadow with a small sliver of light beneath.",
    "- Bubble highlights must be SOFT, ROUND specular catches like real light",
    "  on glass. DO NOT render star-shaped sparkles, four-pointed sparkle",
    "  crosses, lens flares, twinkle effects, or fairy-magic glow. This is",
    "  editorial product photography, not Y2K graphics.",
    "- Each bubble contains a small '+' marker followed by ONE short attribute",
    "  in 1–3 words (e.g. '100% Cotton', 'Long Lasting', 'Matte Finish').",
    "  Text is crisp and unblurred, set in a clean modern sans-serif, dark gray.",
    "- Distribute bubbles asymmetrically — never symmetric corners. Vary",
    "  their sizes slightly. Keep them small and supporting; they must not",
    "  compete with the product.",
    "",
    "Palette: bright and airy, with one dominant accent hue drawn from the",
    "product or its theme. Tonally unified across scene, type, and bubbles.",
    "",
    "Render the product faithfully from the attached reference photos —",
    "accurate color, shape, branding, proportions, fully and prominently shown.",
    "Do not invent product details.",
    "",
    "Language: detect the natural language of the description below and write",
    "ALL on-image text in EXACTLY that language. No translation or mixing.",
    "",
    "Style references: premium consumer-goods advertising, modern lifestyle",
    "brand campaigns with layered glass staging, editorial product posters.",
    "",
    "Output exactly ONE image. No watermarks, no fake logos, all text spelled",
    "correctly.",
    "",
    "Product description:",
    '"""',
    trimmed,
    '"""',
  ].join("\n");
}

export async function generateInfographic({
  images,
  description,
  aspectRatio = "3:4",
  style = "glass",
}: InfographicInput): Promise<EditResult> {
  if (images.length === 0) {
    throw new Error("At least one product image is required.");
  }
  if (images.length > 4) {
    throw new Error("Up to 4 product images are supported.");
  }

  const parts: Part[] = images.map((img) => ({
    inlineData: { mimeType: img.mimeType, data: img.base64 },
  }));
  parts.push({ text: buildInfographicPrompt(description, style) });

  const response = await ai.models.generateContent({
    model: INFOGRAPHIC_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio, imageSize: "4K" },
    },
  });

  return extractImage(response);
}
