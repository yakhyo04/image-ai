// Artboard — feature detail page data (one per landing tool). Ported from the design source.

export type Tool = {
  id: string;
  name: string;
  eyebrow: string;
  icon: string;
  tone: string;
  titleA: string;
  titleAccent: string;
  desc: string;
  heroType: "beforeafter" | "showcase";
  beforeLabel?: string;
  afterLabel?: string;
  stats: [string, string][];
  steps: { icon: string; title: string; desc: string }[];
  caps: { icon: string; title: string; desc: string }[];
  gallery: { label: string; tone: string; h: number }[];
  useCases: { icon: string; title: string; desc: string }[];
  specs: [string, string][];
  faqs: { q: string; a: string }[];
};

export const TOOLS: Tool[] = [
  {
    id: "infographics",
    name: "Marketplace Infographics",
    eyebrow: "Tool 01 · Infographics",
    icon: "sliders",
    tone: "oklch(0.40 0.07 200)",
    titleA: "Turn product specs into",
    titleAccent: "scroll-stopping infographics",
    desc: "Auto-generate feature callouts, benefit badges, and on-image text sized to the exact pixel requirements of every marketplace — in Uzbek, Russian, or English.",
    heroType: "beforeafter",
    beforeLabel: "Plain photo",
    afterLabel: "Infographic",
    stats: [["+38%", "avg. conversion lift"], ["8s", "per generation"], ["12", "layout styles"]],
    steps: [
      { icon: "upload", title: "Upload product", desc: "Drop a single product shot — even a phone photo works." },
      { icon: "sliders", title: "Pick a layout", desc: "Choose from 12 marketplace-tuned infographic styles." },
      { icon: "sparkle-fill", title: "Auto-label", desc: "Artboard writes the callouts and places badges for you." },
    ],
    caps: [
      { icon: "globe", title: "UZ · RU · EN text", desc: "On-image text renders cleanly in three languages, switchable per generation." },
      { icon: "image", title: "Marketplace presets", desc: "Exact dimensions for Wildberries, Ozon, Uzum, and Yandex Market." },
      { icon: "wand", title: "Smart callouts", desc: "Detects key product features and writes benefit-driven labels automatically." },
      { icon: "layers", title: "Brand consistency", desc: "Lock fonts, colors, and badge styles across an entire catalog." },
    ],
    gallery: [
      { label: "Glass", tone: "oklch(0.40 0.07 200)", h: 300 },
      { label: "Cards", tone: "oklch(0.36 0.08 25)", h: 230 },
      { label: "Bold", tone: "oklch(0.34 0.09 340)", h: 260 },
      { label: "Minimal", tone: "oklch(0.32 0.04 250)", h: 240 },
    ],
    useCases: [
      { icon: "bolt", title: "New launches", desc: "Spin up a full set of listing cards the day a product lands." },
      { icon: "grid", title: "Catalog refresh", desc: "Re-skin hundreds of old listings to a consistent new look." },
      { icon: "star", title: "Seasonal sales", desc: "Add promo badges and price flags in seconds for every campaign." },
    ],
    specs: [["Output formats", "JPG · PNG · WEBP"], ["Max resolution", "4096 × 4096"], ["Languages", "UZ · RU · EN"], ["Avg. time", "~8 seconds"], ["Credit cost", "5 / generation"], ["Variants", "4 per run"]],
    faqs: [
      { q: "Can it match my brand colors?", a: "Yes — set a brand kit with your palette, fonts, and badge styles, and every infographic follows it." },
      { q: "Does the text actually read well?", a: "On-image text is generated and typeset, not pasted — kerning, contrast, and wrapping are handled for each language." },
      { q: "Which marketplaces are supported?", a: "Wildberries, Ozon, Uzum, Yandex Market, KazanExpress, and AliExpress, with exact size presets for each." },
    ],
  },
  {
    id: "editor",
    name: "Photo Editing",
    eyebrow: "Tool 02 · Photo Editing",
    icon: "magic",
    tone: "oklch(0.38 0.08 25)",
    titleA: "Retouch and restyle with",
    titleAccent: "a brush and a sentence",
    desc: "Inpaint, remove, recolor, and relight any part of a product photo. Paint a region, describe the change, and Artboard blends it in seamlessly — no Photoshop skills required.",
    heroType: "beforeafter",
    beforeLabel: "Original",
    afterLabel: "Edited",
    stats: [["3 hrs", "saved per week"], ["1-click", "object removal"], ["HD", "edge quality"]],
    steps: [
      { icon: "upload", title: "Open a photo", desc: "Load any product image into the editor canvas." },
      { icon: "brush", title: "Brush a region", desc: "Paint exactly the area you want to change." },
      { icon: "magic", title: "Describe & apply", desc: "Type the edit — Artboard inpaints it cleanly." },
    ],
    caps: [
      { icon: "scissors", title: "Object removal", desc: "Erase tags, reflections, or clutter and rebuild the background behind them." },
      { icon: "palette", title: "Recolor", desc: "Change a product’s color or material while keeping texture and lighting real." },
      { icon: "sparkle", title: "Relight", desc: "Add soft studio light or warm highlights to flat phone snapshots." },
      { icon: "layers", title: "Non-destructive", desc: "Every edit is a layer in history — step back anytime." },
    ],
    gallery: [
      { label: "Cleanup", tone: "oklch(0.36 0.06 25)", h: 250 },
      { label: "Recolor", tone: "oklch(0.34 0.09 340)", h: 300 },
      { label: "Relight", tone: "oklch(0.4 0.07 70)", h: 230 },
      { label: "Retouch", tone: "oklch(0.32 0.05 25)", h: 260 },
    ],
    useCases: [
      { icon: "bolt", title: "Fix bad shots", desc: "Rescue an otherwise good photo with a quick cleanup." },
      { icon: "grid", title: "Color variants", desc: "Generate every colorway from a single product photo." },
      { icon: "eye", title: "Detail focus", desc: "Remove distractions so the product is the only thing in frame." },
    ],
    specs: [["Output formats", "JPG · PNG · WEBP"], ["Max resolution", "4096 × 4096"], ["Brush precision", "Pixel-level mask"], ["Avg. time", "~10 seconds"], ["Credit cost", "4 / edit"], ["History", "Unlimited layers"]],
    faqs: [
      { q: "Do the edges look clean?", a: "Edge handling is HD — cutouts and inpaints blend with the surrounding texture and lighting rather than leaving halos." },
      { q: "Can I undo a change?", a: "Yes. Every edit is stored as a step in history, so you can move back and forth freely." },
      { q: "Does it keep the product accurate?", a: "Brushed edits only affect the painted region; the rest of your product stays pixel-identical." },
    ],
  },
  {
    id: "interior",
    name: "Interior Design",
    eyebrow: "Tool 03 · Interior Design",
    icon: "sofa",
    tone: "oklch(0.36 0.06 130)",
    titleA: "Stage furniture in",
    titleAccent: "rooms that look real",
    desc: "Drop a product into a photoreal interior, or restyle an entire room in any aesthetic. Perfect for furniture, decor, lighting, and homeware listings that need context.",
    heroType: "showcase",
    stats: [["20+", "room styles"], ["4K", "staged renders"], ["0", "photographers needed"]],
    steps: [
      { icon: "upload", title: "Add your product", desc: "Upload furniture or decor on any background." },
      { icon: "sofa", title: "Choose a room", desc: "Pick a staged interior and aesthetic direction." },
      { icon: "sparkle-fill", title: "Stage it", desc: "Artboard places and relights it into the scene." },
    ],
    caps: [
      { icon: "sofa", title: "Room staging", desc: "Composite a product into a believable, well-lit interior scene." },
      { icon: "palette", title: "Restyle a space", desc: "Turn an empty or dated room into Scandinavian, boho, or modern in one click." },
      { icon: "sparkle", title: "Matched lighting", desc: "Shadows and reflections adapt to the room so nothing looks pasted." },
      { icon: "maximize", title: "Multiple angles", desc: "Generate the same staged product from several viewpoints." },
    ],
    gallery: [
      { label: "Scandi", tone: "oklch(0.4 0.04 130)", h: 240 },
      { label: "Boho", tone: "oklch(0.4 0.07 70)", h: 300 },
      { label: "Modern", tone: "oklch(0.34 0.03 250)", h: 230 },
      { label: "Boutique", tone: "oklch(0.36 0.06 320)", h: 260 },
    ],
    useCases: [
      { icon: "sofa", title: "Furniture sellers", desc: "Show sofas and tables in styled living rooms, not on white voids." },
      { icon: "star", title: "Decor & lighting", desc: "Give lamps and accessories a believable home context." },
      { icon: "grid", title: "Room sets", desc: "Build a cohesive lookbook of a full product range in one space." },
    ],
    specs: [["Output formats", "JPG · PNG · WEBP"], ["Max resolution", "4096 × 4096"], ["Room styles", "20+ presets"], ["Avg. time", "~25 seconds"], ["Credit cost", "6 / scene"], ["Variants", "4 per run"]],
    faqs: [
      { q: "Will my product stay accurate?", a: "The product geometry and materials are preserved; only the surrounding room and lighting are generated." },
      { q: "Can I use my own room photo?", a: "Yes — upload an empty room and Artboard stages your product into it with matched perspective." },
      { q: "How realistic is the lighting?", a: "Shadows, contact points, and reflections are simulated per scene so the result reads as a real photo." },
    ],
  },
  {
    id: "mockups",
    name: "Product Mockups",
    eyebrow: "Tool 04 · Product Mockups",
    icon: "box",
    tone: "oklch(0.34 0.07 300)",
    titleA: "Wrap your design onto",
    titleAccent: "photoreal mockups",
    desc: "Apply your artwork or label to packaging, apparel, devices, and print in lifelike scenes. Show the finished product before a single unit is ever manufactured.",
    heroType: "showcase",
    stats: [["60+", "mockup templates"], ["photoreal", "wraps"], ["instant", "previews"]],
    steps: [
      { icon: "upload", title: "Upload artwork", desc: "Add your label, print, or design file." },
      { icon: "box", title: "Pick a surface", desc: "Choose packaging, apparel, a device, or print." },
      { icon: "sparkle-fill", title: "Wrap & render", desc: "Artboard maps it on with real perspective." },
    ],
    caps: [
      { icon: "box", title: "Packaging", desc: "Boxes, pouches, bottles, and jars with accurate label wrapping." },
      { icon: "gallery", title: "Apparel", desc: "T-shirts, hoodies, and bags with natural fabric folds." },
      { icon: "image", title: "Devices & print", desc: "Phones, laptops, posters, and cards in clean studio scenes." },
      { icon: "sparkle", title: "Scene control", desc: "Set surface, lighting, and angle to match your brand." },
    ],
    gallery: [
      { label: "Packaging", tone: "oklch(0.34 0.07 300)", h: 300 },
      { label: "Apparel", tone: "oklch(0.36 0.06 320)", h: 230 },
      { label: "Device", tone: "oklch(0.32 0.04 250)", h: 260 },
      { label: "Print", tone: "oklch(0.34 0.05 200)", h: 240 },
    ],
    useCases: [
      { icon: "bolt", title: "Pre-launch", desc: "Validate packaging designs before printing a run." },
      { icon: "star", title: "Pitch decks", desc: "Show investors and buyers a finished-looking product." },
      { icon: "grid", title: "Variant sets", desc: "Render every SKU or colorway from one template." },
    ],
    specs: [["Output formats", "JPG · PNG · WEBP"], ["Max resolution", "4096 × 4096"], ["Templates", "60+ surfaces"], ["Avg. time", "~15 seconds"], ["Credit cost", "5 / mockup"], ["Variants", "4 per run"]],
    faqs: [
      { q: "Does the wrap follow curves?", a: "Yes — artwork maps onto cylindrical and folded surfaces with correct perspective and warping." },
      { q: "Can I control the scene?", a: "Surface material, background, lighting, and camera angle are all adjustable per render." },
      { q: "What files can I upload?", a: "PNG with transparency works best for labels; vector and high-res raster are both supported." },
    ],
  },
  {
    id: "backgrounds",
    name: "Background Replacement",
    eyebrow: "Tool 05 · Backgrounds",
    icon: "scissors",
    tone: "oklch(0.36 0.06 250)",
    titleA: "Clean cutouts and",
    titleAccent: "any backdrop you describe",
    desc: "One-click background removal with genuinely clean edges, then place your product on pure white, a gradient, or any scene you can describe in words.",
    heroType: "beforeafter",
    beforeLabel: "Busy background",
    afterLabel: "Clean backdrop",
    stats: [["1-click", "cutout"], ["clean", "edge masks"], ["∞", "backdrops"]],
    steps: [
      { icon: "upload", title: "Upload photo", desc: "Any product photo, any background." },
      { icon: "scissors", title: "Auto cutout", desc: "Artboard isolates the product with a clean mask." },
      { icon: "image", title: "Set a backdrop", desc: "White, gradient, or a described scene." },
    ],
    caps: [
      { icon: "scissors", title: "Edge-perfect masks", desc: "Hair, glass, and fine detail are handled without halos." },
      { icon: "image", title: "Marketplace white", desc: "Pure #FFFFFF backgrounds that pass platform requirements." },
      { icon: "palette", title: "Described scenes", desc: "Type a backdrop — “marble table, soft light” — and get it." },
      { icon: "layers", title: "Batch mode", desc: "Process an entire folder of products at once." },
    ],
    gallery: [
      { label: "Pure white", tone: "oklch(0.5 0.01 250)", h: 240 },
      { label: "Gradient", tone: "oklch(0.36 0.07 250)", h: 300 },
      { label: "Scene", tone: "oklch(0.34 0.06 200)", h: 230 },
      { label: "Shadow", tone: "oklch(0.3 0.02 250)", h: 260 },
    ],
    useCases: [
      { icon: "image", title: "Compliant listings", desc: "Meet strict white-background rules on every marketplace." },
      { icon: "grid", title: "Consistent catalogs", desc: "Unify mismatched product shots onto one backdrop." },
      { icon: "bolt", title: "Bulk processing", desc: "Cut out hundreds of products in a single batch." },
    ],
    specs: [["Output formats", "PNG · JPG · WEBP"], ["Transparency", "Alpha channel"], ["Edge quality", "HD matting"], ["Avg. time", "~5 seconds"], ["Credit cost", "3 / image"], ["Batch", "Up to 200"]],
    faqs: [
      { q: "How clean are the edges?", a: "HD matting handles hair, transparency, and thin detail, producing masks that hold up at full resolution." },
      { q: "Can I get pure white?", a: "Yes — a true #FFFFFF preset is included and meets marketplace background rules." },
      { q: "Is there a batch option?", a: "Paid plans can process up to 200 images in a single run with a shared backdrop." },
    ],
  },
  {
    id: "patterns",
    name: "Pattern Design",
    eyebrow: "Tool 06 · Patterns",
    icon: "palette",
    tone: "oklch(0.38 0.08 70)",
    titleA: "Generate seamless",
    titleAccent: "patterns and textures",
    desc: "Create tileable, repeat-ready patterns and surface textures for textiles, packaging, wallpaper, and print. Describe a motif and get a perfect seamless tile.",
    heroType: "showcase",
    stats: [["seamless", "repeat tiles"], ["vector", "export ready"], ["∞", "motifs"]],
    steps: [
      { icon: "wand", title: "Describe a motif", desc: "Type a theme — “folk floral, terracotta”." },
      { icon: "palette", title: "Tune the palette", desc: "Set colors, density, and scale." },
      { icon: "sparkle-fill", title: "Get a tile", desc: "A perfectly seamless, repeat-ready pattern." },
    ],
    caps: [
      { icon: "palette", title: "Seamless tiling", desc: "Every output repeats perfectly with no visible seams." },
      { icon: "sliders", title: "Scale & density", desc: "Control motif size and spacing for any surface." },
      { icon: "layers", title: "Colorways", desc: "Generate a whole palette family from one pattern." },
      { icon: "download", title: "Print-ready export", desc: "High-res tiles plus repeat metadata for production." },
    ],
    gallery: [
      { label: "Floral", tone: "oklch(0.38 0.08 70)", h: 260 },
      { label: "Geometric", tone: "oklch(0.36 0.07 200)", h: 240 },
      { label: "Folk", tone: "oklch(0.36 0.09 25)", h: 300 },
      { label: "Abstract", tone: "oklch(0.36 0.08 320)", h: 230 },
    ],
    useCases: [
      { icon: "gallery", title: "Textiles", desc: "Repeat-ready prints for fabric and apparel." },
      { icon: "box", title: "Packaging", desc: "Branded surface patterns for boxes and wraps." },
      { icon: "star", title: "Wallpaper & decor", desc: "Large-scale tiles for interior surfaces." },
    ],
    specs: [["Output formats", "PNG · SVG · WEBP"], ["Tiling", "Seamless repeat"], ["Max resolution", "4096 × 4096"], ["Avg. time", "~12 seconds"], ["Credit cost", "4 / tile"], ["Colorways", "Up to 6"]],
    faqs: [
      { q: "Are the tiles truly seamless?", a: "Yes — outputs are generated as repeat tiles, so they tile edge-to-edge with no seams." },
      { q: "Can I export for print?", a: "High-resolution raster plus SVG and repeat metadata are included for production workflows." },
      { q: "Can I get matching colorways?", a: "Generate up to six recolored versions of the same pattern in one run." },
    ],
  },
];

export const TOOL_MAP: Record<string, Tool> = Object.fromEntries(TOOLS.map((t) => [t.id, t]));
