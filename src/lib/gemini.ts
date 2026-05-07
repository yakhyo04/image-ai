import { GoogleGenAI, type Content, type Part } from "@google/genai";
import {
  INFOGRAPHIC_STYLES,
  INFOGRAPHIC_LANGUAGES,
  type InfographicStyle,
  type InfographicLanguage,
} from "./infographicStyles";

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

export {
  INFOGRAPHIC_STYLES,
  INFOGRAPHIC_LANGUAGES,
  type InfographicStyle,
  type InfographicLanguage,
};

export type InfographicInput = {
  images: InlineImage[];
  description?: string;
  aspectRatio?: InfographicAspect;
  style?: InfographicStyle;
  language?: InfographicLanguage;
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

const LANGUAGE_RULE: Record<InfographicLanguage, string> = {
  en: "Write ALL on-image text (titles, headlines, labels, captions, taglines, units) in English. Use natural, native English marketing phrasing. Do not mix languages. Numbers and universal symbols are fine.",
  ru: "Write ALL on-image text (titles, headlines, labels, captions, taglines, units) in Russian (Русский язык). Use natural, native Russian marketing phrasing — not transliteration. Do not mix languages. Numbers and universal symbols are fine.",
  uz: "Write ALL on-image text (titles, headlines, labels, captions, taglines, units) in Uzbek, written in the modern Latin alphabet (O'zbek tili, lotin alifbosi). Use natural, native Uzbek marketing phrasing — not transliteration of English or Russian. Do not mix languages. Numbers and universal symbols are fine.",
};

const FIDELITY_BLOCK = [
  "ABSOLUTE PRODUCT FIDELITY — read first, applies above all other instructions:",
  "The attached reference photo(s) show the EXACT product. Treat it as a fixed,",
  "immutable asset that must appear in the output IDENTICAL to the reference.",
  "You may relight, reposition, rotate, scale, or replace its background. You",
  "may NOT, under ANY circumstance, alter:",
  "- Printed text on the product (logos, slogans, labels) — every word must",
  "  match character-for-character. If the t-shirt says 'MY FRIEND', the",
  "  output t-shirt must say 'MY FRIEND', not nothing and not something else.",
  "- Patterns, prints, or surface designs (sprinkles, stripes, dots, florals,",
  "  camo, plaid). Preserve density, color, scale, and placement exactly.",
  "- Embroidered, applique, fluffy, or 3D decorative elements — preserve their",
  "  exact shape, texture, character design, pose, and position.",
  "- Printed graphics or character illustrations on the product. Do NOT",
  "  redraw, simplify, restyle, or substitute with a generic version. Match",
  "  the original character's pose, expression, color, and rendering style.",
  "- The product's color, shape, silhouette, proportions, or material.",
  "- Any care labels, brand marks, tags, stitching, or trim.",
  "",
  "If you cannot reproduce a printed graphic faithfully, leave it blank rather",
  "than inventing a different one. A missing detail is recoverable; a wrong",
  "detail is a failure. The product in the output MUST be recognizable as the",
  "SAME PHYSICAL ITEM as the reference photo, not a 'similar' product.",
  "",
  "- FULL PRODUCT VISIBILITY — non-negotiable: every decorative element on",
  "  the product (printed text, embroidered characters, pattern motifs,",
  "  graphic prints, brand marks) must be plainly visible at full size. Do",
  "  not hide any portion of a graphic by folding, cropping, stacking,",
  "  perspective angle, or scene props. If the reference photo shows the",
  "  product flat-laid, the output is flat-laid. If on a hanger, on a hanger.",
  "  If on a model, on a model. Match the reference's presentation mode.",
  "",
].join("\n");

function buildInfographicPrompt(
  description: string | undefined,
  style: InfographicStyle,
  language: InfographicLanguage,
): string {
  const trimmed = description?.trim() ?? "";
  const languageRule = LANGUAGE_RULE[language];
  const hasDescription = trimmed.length > 0;

  const copyDirective = hasDescription
    ? [
        "COPY SOURCE — where every word on the image must come from:",
        "A product description has been provided at the bottom of this prompt.",
        "Treat that description as the SINGLE SOURCE OF TRUTH for every word",
        "rendered on the image — the product name, headline, feature labels,",
        "callout captions, taglines, technical specs, benefit titles, CTA",
        "wording, all of it. Extract the relevant phrases from the description",
        "and place them in the slots this style calls for. Do not paste the",
        "description verbatim — distill it into short, well-crafted on-image",
        "copy. Do not invent product names, features, claims, certifications,",
        "or numbers that cannot be derived from the description. Any example",
        "wording shown in this prompt (e.g. 'JUST DO IT.', 'PURE', 'QUIET",
        "LUXURY', 'Sneakers', 'TWISTRUSS') is illustrative only — replace it",
        "with wording drawn from the actual description.",
      ].join("\n")
    : [
        "COPY SOURCE — where every word on the image must come from:",
        "No product description was provided. Read the product carefully from",
        "the reference photos — identify its category, materials, visible",
        "features, brand name (only if clearly printed), and the most likely",
        "3–5 selling points. Then write all on-image copy yourself in",
        "confident, benefit-led marketing phrasing. Do not invent specific",
        "numbers, certifications, or factual claims you cannot verify from",
        "the photos themselves. Any example wording shown in this prompt is",
        "illustrative only — replace it with wording you author for this",
        "specific product.",
      ].join("\n");

  if (style === "cards") {
    return [
      FIDELITY_BLOCK,
      copyDirective,
      "",
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
      "  tight close-up of a real, visible detail of the SAME product seen in the",
      "  reference photos (texture, weave, stitching, clasp, brand mark, label).",
      "  Do not invent details that aren't present in the references. If only one",
      "  reference exists, crop different regions of THAT photo across the tiles.",
      "  Mix of dark-background tiles and light-background tiles.",
      "- Bottom-left (MODES / USE CASES): single dark moody panel, cropped product",
      "  shot using the SAME product from the references with EVERY printed text,",
      "  graphic, embroidery, and pattern preserved character-for-character. Two",
      "  short labels with one-line captions placed in negative space.",
      "- Bottom-right (BENEFITS): light panel, product shown from another angle",
      "  that is actually present in the reference photos. If only ONE angle is",
      "  provided, repeat the same angle (re-staged) — never imagine an unseen",
      "  side, back, interior, or alternate view. 3 stacked benefit blocks (bold",
      "  short title + 2-3 line caption).",
      "",
      "Typography: bold sans-serif. Strong size hierarchy — huge, medium, small.",
      "Headline weight heavy; body weight regular. Labels are short (1-3 words).",
      "",
      "Strict no's: no circular icon badges with thin-line icons, no arrow callouts",
      "pointing at a centered product, no rainbow color accents, no stock-template feel.",
      "",
      "Render the product faithfully from the attached reference photos — accurate",
      "color, shape, branding, proportions. You may relight and reposition, but you",
      "must NOT alter, simplify, restyle, or substitute any printed text, graphic,",
      "embroidery, pattern, or character that appears on the product.",
      "",
      "CRITICAL — Language rule:",
      languageRule,
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

  if (style === "ticket") {
    return [
      FIDELITY_BLOCK,
      copyDirective,
      "",
      "STYLE — TICKET STUB EDITORIAL (split-canvas fashion-catalog spread with ticket-design right side):",
      "- Background: a vertical asymmetric split — the LEFT ~60% of the canvas is",
      "  pure black or very dark charcoal, the RIGHT ~40% is a saturated accent",
      "  color drawn from the product (rose-pink, butter-yellow, mint-green, baby",
      "  blue). The two regions meet at a clean vertical edge running floor to",
      "  ceiling.",
      "- Ticket stub — defining structural move: the right region is designed as",
      "  a TICKET STUB or ADMISSION CARD, with a real-looking barcode + digits",
      "  at the very top, a second smaller barcode at the bottom, a horizontal",
      "  dotted perforation line near the bottom suggesting it can be torn off,",
      "  and optionally a single MASSIVE letterform glyph (Cyrillic, Latin, or",
      "  whichever the description's language uses) at very low opacity inside",
      "  the ticket as decorative texture.",
      "- Product: photorealistic, dramatically sized, tilted at 10–25° from",
      "  horizontal, OVERLAPPING the seam between the two regions so it visually",
      "  bridges the dark and accent halves. Occupies ~55–70% of canvas height.",
      "  This overlap is the second defining move — the product anchors the",
      "  composition by belonging to both sides at once.",
      "- Top nav strip (across the dark region): a thin row of small categorical",
      "  text labels in a light sans-serif (e.g. 'Model 2025', 'Product', 'Care',",
      "  'Size Chart' — or equivalents in the description's language). Reads",
      "  like a magazine top nav or a product-page tab bar.",
      "- Display headline: a MASSIVE bold condensed sans-serif word in white",
      "  inside the dark region, all caps, set against the upper-left area —",
      "  the product category in one short word, tightly tracked. Optional",
      "  small period or accent mark after the word for typographic detail.",
      "- Sub-headline: directly beneath, a smaller bold sans-serif label with",
      "  an optional small disclosure caret (e.g. 'Unisex ⌄', 'Premium ⌄').",
      "- Feature list: 2–4 short feature callouts in the dark region beneath",
      "  the sub-headline, each prefixed with a small '⊕' glyph, followed by a",
      "  bold short label and a one-line caption in a lighter weight beneath.",
      "  These are NOT chips — just plain text with a leading plus glyph.",
      "- Tagline + body: at the bottom of the dark region, a short bold tagline",
      "  in white ('JUST DO IT.', 'Move Forward.', or equivalent in the",
      "  description's language) plus a 3–5 line body paragraph in small light-",
      "  weight sans-serif beneath it.",
      "- Inside the ticket: a bold sans-serif model or variant name near the",
      "  top, a small label beneath, then a pill-shaped button in the dark",
      "  color with white text (status or short tagline). Lower in the ticket:",
      "  a key spec callout in oversized bold sans (size range, capacity,",
      "  count) followed by a black pill-shaped CTA button with a right-arrow",
      "  ('Other Colors →', 'See More →', etc.).",
      "- Color: high-contrast pairing — pure black + ONE saturated accent +",
      "  white. The product's own natural colors come through unchanged. No",
      "  third accent color, no rainbow palette.",
      "- Typography: ONE bold condensed display sans for the massive headline,",
      "  ONE clean modern sans for everything else. No serif, no script, no",
      "  decorative typography.",
      "- Avoid: gradients, atmospheric haze, vignettes, glassy '+' pill chips,",
      "  circular icon badges, decorative botanical props, soft pastel washes,",
      "  oversized backdrop words behind the product, single-color backgrounds",
      "  without the split. This style is graphic, structured, and reads as a",
      "  fashion-catalog spread.",
      "",
      "Render the product faithfully from the attached reference photos —",
      "accurate color, shape, branding, proportions. Do not invent product details.",
      "",
      "CRITICAL — Language rule:",
      languageRule,
      "",
      "Hard rules:",
      "- Output exactly ONE image.",
      "- No watermarks, no fake logos, no fabricated brand names.",
      "- All text spelled correctly.",
      "",
      "Product description:",
      '"""',
      trimmed,
      '"""',
    ].join("\n");
  }

  if (style === "flagship") {
    return [
      FIDELITY_BLOCK,
      // copyDirective,
      // "",
      "STYLE — FLAGSHIP LISTING (premium e-commerce product page, modern marketplace top-tier):",
      "- Background: vertical asymmetric split — the LEFT ~40% of the canvas is",
      "  pure white, the RIGHT ~60% is a saturated accent color drawn from the",
      "  product (royal blue, deep red, forest green, etc.). The two regions",
      "  meet at a clean vertical edge running floor to ceiling.",
      "- Hero product treatment — defining move: a dramatically CROPPED close-up",
      "  shot of the product fills the colored region, bleeding off the right",
      "  and bottom edges of the canvas. Macro-level detail is visible (mesh,",
      "  texture, branding, stitching, material). The product is NOT shown in",
      "  full — it is intentionally over-scaled and cropped for graphic impact.",
      "  Occupies ~70–85% of the colored region.",
      "- Vertical watermark: a repeating script or italic version of the product",
      "  / model name runs vertically up the right edge of the colored region",
      "  at low opacity in a slightly darker shade of the accent color, used as",
      "  decorative texture only.",
      "- Top nav strip (spans both regions): a thin row at the very top with",
      "  the brand logo on the far left, 3–4 small categorical tab labels",
      "  immediately to its right (e.g. 'Product', 'Specs', 'Size Chart',",
      "  localized to the description's language), and a pair of small line",
      "  icons (heart + cart) on the far right. Reads like a real e-commerce",
      "  product-page header.",
      "- Headline block (upper-left of the white region): a stack of three",
      "  typographic tiers — a bold sans category word at the top ('Sneakers',",
      "  'Headphones', 'Bottle'), the full product / model name beneath in a",
      "  slightly smaller bold sans, and a one-line technical positioning",
      "  statement under that in a light-weight sans. All in dark near-black",
      "  text.",
      "- Feature cards — second defining move: a vertical STACK of 2–3 feature",
      "  cards down the white region, each card a small rounded-corner light-",
      "  gray panel containing three elements: a small pill-shaped TECH-NAME",
      "  tag (e.g. 'TWISTRUSS', 'AHAR PLUS', 'ProControl') in a heavier weight,",
      "  a short 1–2 line caption beneath explaining the technology, and a",
      "  small alternate-angle product variant image tucked in the corner of",
      "  the card. These cards replace the bare-text feature lists used by",
      "  most other styles in this library.",
      "- Bottom CTA: in the lower-left, a large rounded pill-shaped button in",
      "  the accent color (matching the right region) with white text in two",
      "  tiers — a small label on top ('Wide Size Range') and an oversized",
      "  bold value beneath ('35–42', '128 GB', '500 ml'). Small footer text",
      "  at the very bottom in a faint gray ('model @2025' or equivalent).",
      "- Color: a strict three-tone palette — white (left region + feature",
      "  cards), the product's accent color (right region + CTA pill + tech",
      "  tags), and dark near-black (typography). The product's natural colors",
      "  come through unchanged. No third accent.",
      "- Typography: ONE clean modern sans-serif family throughout (Inter / SF",
      "  Pro / Söhne feel), used at multiple sizes and weights. No serif and",
      "  no script except for the vertical watermark.",
      "- Avoid: gradients, atmospheric haze, vignettes, decorative botanical",
      "  props, full-uncropped product hero shots (the dramatic crop is",
      "  essential), color blocking beyond the white-plus-one-accent split,",
      "  '+' pill chips with captions, numbered features (01/02/03), oversized",
      "  backdrop typography. This style is informational, refined, and reads",
      "  as a flagship product listing — not a brand poster.",
      "",
      "Render the product faithfully from the attached reference photos —",
      "accurate color, shape, branding, proportions. Do not invent product details.",
      "",
      "CRITICAL — Language rule:",
      languageRule,
      "",
      "Hard rules:",
      "- Output exactly ONE image.",
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
    FIDELITY_BLOCK,
    copyDirective,
    "",
    "STEP 1 — DECORATION AUDIT (do this BEFORE composing the scene):",
    "Look at every reference photo. List, in your head, every single printed",
    "word, every graphic illustration, every embroidered character, every",
    "pattern motif visible on the product. If the t-shirt says 'MY FRIEND'",
    "with a cartoon character, the t-shirt in the output MUST say 'MY FRIEND'",
    "with the SAME cartoon character in the SAME pose, color, and position.",
    "If the bottle label has specific text and a specific image, that exact",
    "text and that exact image MUST appear on the bottle in the output.",
    "These printed and embroidered elements are the HERO of the entire image.",
    "Build the glassmorphism scene AROUND them — never let the scene replace,",
    "simplify, restyle, or omit them. If you cannot reproduce a printed",
    "graphic exactly, leave that area blank rather than inventing a new one.",
    "",
    "STEP 2 — SCENE PROTECTS THE PRODUCT:",
    "Atmospheric haze, bloom, glass bubbles, glass shelves, frosted panels,",
    "and any other scene element must NEVER blur, soften, fade, occlude, or",
    "pass in front of the product itself or any printed/embroidered content",
    "on it. The product is photographically crisp from edge to edge, with",
    "every graphic clearly legible. The glass effects belong to the SCENE",
    "AROUND the product, not the product surface.",
    "",
    "Now create ONE editorial product advertisement in glassmorphism style. The",
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
    "   • Apparel / textile → present the garment FULLY UNFOLDED and FLAT-LAID",
    "      on a clear glass tray or acrylic platter, front facing the camera,",
    "      so every printed graphic, embroidered detail, text, and pattern is",
    "      visible from collar to hem at FULL SIZE and SHARP focus. The",
    "      printed/embroidered area on the garment is the focal point of the",
    "      whole frame — render it photographically, not as a stylized",
    "      reinterpretation. Reproduce every word, every character, every",
    "      illustration exactly as in the references. Do NOT fold, stack,",
    "      crumple, or partially obscure the garment. If the set has multiple",
    "      pieces (top + bottom), lay them side by side — both fully visible,",
    "      both fronts facing up. A soft frosted glass panel behind for depth,",
    "      sitting strictly behind the garment with no overlap onto its print.",
    "    • Footwear → a low glass platform beneath plus a vertical frosted",
    "      glass panel behind for depth.",
    "- These glass staging elements must have real glass physics: subtle",
    "  refraction of the background through them, defined edges, soft",
    "  highlights along the upper rim, gentle inner reflections.",
    "- Glass staging elements (shelves, panels, trays, partitions) sit BEHIND",
    "  or BESIDE the product. They must NEVER cover, overlap, or pass in",
    "  front of any printed text, embroidered character, graphic illustration,",
    "  or pattern that appears on the product itself. Every decoration on the",
    "  product remains fully visible and unobstructed.",
    "- A subtle atmospheric haze and gentle bloom around bright areas",
    "  reinforce the soft, layered, glass-like feel of the whole scene.",
    "- Together with the bubble callouts, this staging creates layered",
    "  glassmorphism across the entire image — never just on the callouts.",
    "",
    "Composition — the PRODUCT is the unquestionable hero:",
    "- Large and dominant, occupying 55–65% of frame height, fully in frame.",
    "- Centered or slightly off-center, three-quarter angle, slightly tilted.",
    "- Photoreal magazine quality. Use enough depth of field that the ENTIRE",
    "  product — and every printed text, graphic, embroidery, and pattern on",
    "  it — stays in sharp focus. Background scene may be softened, but never",
    "  the product itself.",
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
    "- Bubbles are placed in the negative space AROUND the product. They",
    "  must NEVER overlap the product, sit in front of any printed graphic,",
    "  text, or embroidered element on the product, or cast their drop",
    "  shadow onto the printed area. Maintain a clear gap between every",
    "  bubble and the product silhouette.",
    "",
    "Palette: bright and airy, with one dominant accent hue drawn from the",
    "product or its theme. Tonally unified across scene, type, and bubbles.",
    "",
    "Render the product faithfully from the attached reference photos —",
    "accurate color, shape, branding, proportions, fully and prominently shown.",
    "Every printed text, embroidered character, graphic illustration, and",
    "pattern visible on the product in the references MUST be reproduced",
    "exactly: character-for-character, color-for-color, position-for-position.",
    "If you cannot reproduce a graphic faithfully, leave it blank rather than",
    "substituting a different one. Do not invent product details.",
    "",
    "CRITICAL — Language rule:",
    languageRule,
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
  language = "en",
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
  parts.push({ text: buildInfographicPrompt(description, style, language) });

  const response = await ai.models.generateContent({
    model: INFOGRAPHIC_MODEL,
    contents: [{ role: "user", parts }],
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio, imageSize: "2K" },
    },
  });

  return extractImage(response);
}
