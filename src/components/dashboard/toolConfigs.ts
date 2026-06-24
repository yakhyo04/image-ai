export type ToolSection =
  | { label: string; type: "presets"; items: { t: string; tone: string }[]; cols?: number; def?: number }
  | { label: string; type: "chips"; items: string[]; def?: number }
  | { label: string; type: "seg"; items: string[]; def?: number };

export type ToolConfig = {
  active: string;
  title: string;
  tone: string;
  sourceLabel: string;
  sourceHint: string;
  cost: number;
  canvasMeta: string;
  beforeLabel: string;
  afterLabel: string;
  ratio?: string;
  sections: ToolSection[];
  variations: string[];
  exports: [string, string][];
  /** Build the edit instruction from the selected option labels, keyed by section label. */
  buildPrompt: (sel: Record<string, string>) => string;
};

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
  interior: {
    active: "interior", title: "Interior Design", tone: "oklch(0.38 0.06 130)",
    sourceLabel: "Product", sourceHint: "Drop furniture / decor", cost: 10,
    canvasMeta: "Scandi · 3:4 · staged", beforeLabel: "Plain product", afterLabel: "Staged room", ratio: "4/3",
    sections: [
      { label: "Room style", type: "presets", cols: 3, items: [
        { t: "Scandi", tone: "oklch(0.4 0.04 130)" }, { t: "Boho", tone: "oklch(0.4 0.07 70)" }, { t: "Modern", tone: "oklch(0.34 0.03 250)" },
        { t: "Boutique", tone: "oklch(0.36 0.06 320)" }, { t: "Rustic", tone: "oklch(0.38 0.06 50)" }, { t: "Minimal", tone: "oklch(0.42 0.02 250)" }] },
      { label: "Room type", type: "chips", items: ["Living room", "Bedroom", "Kitchen", "Office"] },
      { label: "Lighting", type: "seg", items: ["Soft", "Daylight", "Warm", "Studio"] },
      { label: "Camera angle", type: "seg", items: ["Front", "Angled", "Wide"] },
    ],
    variations: ["oklch(0.4 0.04 130)", "oklch(0.4 0.07 70)", "oklch(0.34 0.03 250)", "oklch(0.36 0.06 320)"],
    exports: [["Uzum", "1024×1365"], ["Wildberries", "900×1200"], ["Instagram", "1080×1080"]],
    buildPrompt: (s) =>
      `Stage this product as a photorealistic ${s["Room style"]} ${s["Room type"].toLowerCase()} interior scene. ` +
      `Use ${s["Lighting"].toLowerCase()} lighting and a ${s["Camera angle"].toLowerCase()} camera view. ` +
      `Composite the product naturally into the room with correct scale, contact shadows, and reflections so it looks like a real photograph. ` +
      `Keep the product's exact shape, materials, and colors unchanged — only generate the surrounding room and relight to match. ` +
      `Output a single high-quality photo with no text, captions, or watermark.`,
  },
  mockups: {
    active: "mockups", title: "Product Mockups", tone: "oklch(0.36 0.07 300)",
    sourceLabel: "Artwork", sourceHint: "Drop label / design", cost: 10,
    canvasMeta: "Packaging · 1:1 · studio", beforeLabel: "Flat artwork", afterLabel: "Mockup", ratio: "1/1",
    sections: [
      { label: "Surface", type: "presets", cols: 4, items: [
        { t: "Box", tone: "oklch(0.34 0.07 300)" }, { t: "Pouch", tone: "oklch(0.36 0.06 320)" }, { t: "Bottle", tone: "oklch(0.34 0.05 250)" }, { t: "Jar", tone: "oklch(0.36 0.05 200)" },
        { t: "Tee", tone: "oklch(0.34 0.06 280)" }, { t: "Bag", tone: "oklch(0.34 0.04 300)" }, { t: "Phone", tone: "oklch(0.3 0.03 250)" }, { t: "Poster", tone: "oklch(0.36 0.05 280)" }] },
      { label: "Scene", type: "chips", items: ["Studio white", "Marble", "Wood", "Gradient"] },
      { label: "Lighting", type: "seg", items: ["Soft", "Hard", "Rim"] },
      { label: "Angle", type: "seg", items: ["Front", "3/4", "Top"] },
    ],
    variations: ["oklch(0.34 0.07 300)", "oklch(0.36 0.06 320)", "oklch(0.34 0.05 250)", "oklch(0.36 0.05 200)"],
    exports: [["Uzum", "1000×1000"], ["Ozon", "1000×1000"], ["Web", "2000×2000"]],
    buildPrompt: (s) =>
      `Apply this artwork/label onto a photorealistic ${s["Surface"].toLowerCase()} product mockup. ` +
      `Scene: ${s["Scene"].toLowerCase()}. Lighting: ${s["Lighting"].toLowerCase()}. Camera angle: ${s["Angle"].toLowerCase()}. ` +
      `Map the design onto the surface with correct perspective, curvature, and material texture so it looks professionally photographed. ` +
      `Output a single clean studio product image with no extra text or watermark.`,
  },
  backgrounds: {
    active: "backgrounds", title: "Background Replacement", tone: "oklch(0.36 0.06 250)",
    sourceLabel: "Product photo", sourceHint: "Drop any photo", cost: 10,
    canvasMeta: "Pure white · 3:4 · cutout", beforeLabel: "Busy background", afterLabel: "Clean backdrop",
    sections: [
      { label: "Backdrop", type: "presets", cols: 3, items: [
        { t: "White", tone: "oklch(0.5 0.01 250)" }, { t: "Gradient", tone: "oklch(0.36 0.07 250)" }, { t: "Scene", tone: "oklch(0.34 0.06 200)" },
        { t: "Marble", tone: "oklch(0.44 0.02 250)" }, { t: "Wood", tone: "oklch(0.38 0.06 50)" }, { t: "Studio", tone: "oklch(0.3 0.02 250)" }] },
      { label: "Shadow", type: "seg", items: ["None", "Soft", "Drop", "Reflection"] },
      { label: "Edge refine", type: "seg", items: ["Auto", "Hair", "Hard"] },
      { label: "Batch", type: "chips", items: ["Single", "10 images", "50 images", "200 images"] },
    ],
    variations: ["oklch(0.5 0.01 250)", "oklch(0.36 0.07 250)", "oklch(0.34 0.06 200)", "oklch(0.3 0.02 250)"],
    exports: [["Uzum", "1024×1365"], ["Transparent", "PNG · alpha"], ["Web", "2000×2666"]],
    buildPrompt: (s) =>
      `Remove the existing background of this product photo and place the product on a ${s["Backdrop"].toLowerCase()} backdrop. ` +
      `Add a ${s["Shadow"].toLowerCase()} shadow and refine the cutout edges (${s["Edge refine"].toLowerCase()}) with no halos. ` +
      `Keep the product pixel-accurate and unchanged; produce a clean, marketplace-ready result. ` +
      `Output a single image with no text or watermark.`,
  },
};
