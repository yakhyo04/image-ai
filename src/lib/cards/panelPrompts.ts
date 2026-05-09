import { LANGUAGE_RULE, PRESERVATION_BLOCK } from "@/lib/gemini";
import type { InfographicLanguage } from "@/lib/gemini";
import type { PanelId } from "./types";

const FONT_LANGUAGE_RULE = (language: InfographicLanguage) => [
  "On-image text:",
  "Every word that appears as on-image typography MUST be written in the",
  "user's selected layout language only. Do not render any English",
  "category-name words. Author headlines and labels fresh from the",
  "product description, in the layout language.",
  "",
  "Language rule:",
  LANGUAGE_RULE[language],
].join("\n");

const COMMON_HARD_RULES = [
  "",
  "Hard rules:",
  "- Output exactly ONE image — a single panel, NOT a 2×2 grid.",
  "- The product is the SAME physical item as in the reference, bit-",
  "  identical: same color, hue, prints, hardware, every detail preserved.",
  "- All on-image text in the selected layout language only — no English",
  "  words mixed in.",
  "- No watermarks, no fake logos overlays, no fabricated brand names.",
  "- All text spelled correctly.",
].join("\n");

/**
 * Each panel below generates ONE composition with the product. The model
 * never sees a "2×2 grid" instruction — that's the failure mode and is
 * structurally avoided by splitting into 4 separate calls. The 4 panels
 * are stitched together by sharp post-generation.
 */

function topLeftHeroPrompt(): string {
  return [
    "Edit the attached product photo into a SINGLE PANEL — the hero panel of",
    "a marketplace product infographic.",
    "",
    "Composition:",
    "- The product photographed cleanly on a LIGHT NEUTRAL background (soft",
    "  cream / off-white / pale beige). Studio-quality lighting.",
    "- The product is the dominant subject, occupying ~50–65% of the panel.",
    "- The product's name (drawn from the description) rendered as oversized",
    "  soft-tone display typography behind / around the product, partially",
    "  overlapping the silhouette. The typography is large, soft-toned, and",
    "  acts as a backdrop element — not a callout.",
    "- One small floating chip with a single short fact-line drawn from the",
    "  description, placed in negative space.",
    "",
    "Style: bold sans-serif typography, strong size hierarchy, restrained",
    "premium marketplace look (Wildberries / Ozon premium-listing aesthetic).",
  ].join("\n");
}

function topRightDetailsPrompt(): string {
  return [
    "Edit the attached product photo into a SINGLE PANEL — the features /",
    "details panel of a marketplace product infographic.",
    "",
    "Composition:",
    "- The product photographed cleanly on a NEUTRAL background, occupying",
    "  ~40–55% of the panel.",
    "- 3–4 small text callout labels arranged around the product, each",
    "  pointing (with a thin hairline leader line, optional) to a feature",
    "  that is ACTUALLY VISIBLE on the product surface in the reference",
    "  (a specific button, seam, joint, label, hardware element, panel,",
    "  control, port, fastener). Do not invent features that aren't",
    "  visible.",
    "- Each callout label is a short bold word/phrase + an optional one-",
    "  line caption, drawn from the description.",
    "",
    "Style: clean modern sans-serif typography. The panel reads as a",
    "premium e-commerce features panel, not a busy spec sheet.",
  ].join("\n");
}

function bottomLeftMoodyPrompt(): string {
  return [
    "Edit the attached product photo into a SINGLE PANEL — a moody,",
    "atmospheric panel of a marketplace product infographic.",
    "",
    "Composition:",
    "- The product photographed against a DARK BACKGROUND (deep charcoal,",
    "  near-black, or a very dark version of the product's accent color).",
    "  Dramatic studio lighting — strong rim light from behind, soft key",
    "  from the upper left, deep falloff into shadow on the opposite side.",
    "- The product is the unmistakable focal point, occupying ~50–65% of",
    "  the panel.",
    "- Two short labels with one-line captions placed in the panel's",
    "  negative space, drawn from the description.",
    "",
    "Style: cinematic, premium, hushed. Restrained typography in white or",
    "soft cream. No additional props, no lifestyle context — just the",
    "product, dramatically lit on a dark backdrop.",
  ].join("\n");
}

function bottomRightBenefitsPrompt(): string {
  return [
    "Edit the attached product photo into a SINGLE PANEL — the benefits",
    "panel of a marketplace product infographic.",
    "",
    "Composition:",
    "- The product photographed cleanly on a LIGHT NEUTRAL background, off-",
    "  center on a rule-of-thirds anchor, occupying ~40–55% of the panel.",
    "- 3 stacked benefit blocks arranged in the panel's negative space",
    "  (typically the side or below the product). Each benefit block has:",
    "    - a bold short title (1–3 words, drawn from the description)",
    "    - a 2–3 line caption beneath in regular weight",
    "",
    "Style: clean modern sans-serif typography, strong size hierarchy, calm",
    "premium marketplace look. Generous breathing room between benefit",
    "blocks.",
  ].join("\n");
}

const PANEL_BUILDERS: Record<PanelId, () => string> = {
  topLeft: topLeftHeroPrompt,
  topRight: topRightDetailsPrompt,
  bottomLeft: bottomLeftMoodyPrompt,
  bottomRight: bottomRightBenefitsPrompt,
};

export function buildPanelPrompt(
  panel: PanelId,
  description: string | undefined,
  language: InfographicLanguage,
): string {
  const trimmed = description?.trim() ?? "";
  const descriptionBlock = trimmed
    ? ["Product description:", '"""', trimmed, '"""', ""].join("\n")
    : "";

  return [
    PRESERVATION_BLOCK,
    "",
    PANEL_BUILDERS[panel](),
    "",
    FONT_LANGUAGE_RULE(language),
    COMMON_HARD_RULES,
    "",
    descriptionBlock,
  ].join("\n");
}
