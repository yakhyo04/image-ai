import sharp from "sharp";
import type { InfographicAspect } from "@/lib/gemini";

const ASPECT_DIMENSIONS: Record<InfographicAspect, { w: number; h: number }> = {
  "1:1": { w: 2048, h: 2048 },
  "3:4": { w: 1536, h: 2048 },
  "4:3": { w: 2048, h: 1536 },
  "9:16": { w: 1152, h: 2048 },
  "16:9": { w: 2048, h: 1152 },
};

/** Pad fraction of canvas long edge that becomes the gap between panels. */
const GAP_RATIO = 0.025;
/** Outer canvas margin as fraction of canvas long edge. */
const MARGIN_RATIO = 0.025;
/** Corner radius as fraction of panel short edge. */
const CORNER_RADIUS_RATIO = 0.04;

/** Background fill behind the panels and in the gap. */
const BACKGROUND_FILL = { r: 250, g: 246, b: 240, alpha: 1 };

/** Build an SVG mask for a rounded rectangle of the given size. */
function roundedRectMask(width: number, height: number, radius: number): Buffer {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}"
            rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`;
  return Buffer.from(svg);
}

/**
 * Composite four generated panels into a 2×2 grid at the user's selected
 * aspect ratio. Each panel gets resized to the panel cell, masked with
 * rounded corners, and placed onto a neutral cream background canvas.
 */
export async function composeCardsGrid(args: {
  topLeft: Buffer;
  topRight: Buffer;
  bottomLeft: Buffer;
  bottomRight: Buffer;
  aspectRatio: InfographicAspect;
}): Promise<Buffer> {
  const { topLeft, topRight, bottomLeft, bottomRight, aspectRatio } = args;
  const dims = ASPECT_DIMENSIONS[aspectRatio];
  const longEdge = Math.max(dims.w, dims.h);
  const margin = Math.round(longEdge * MARGIN_RATIO);
  const gap = Math.round(longEdge * GAP_RATIO);

  const panelW = Math.round((dims.w - margin * 2 - gap) / 2);
  const panelH = Math.round((dims.h - margin * 2 - gap) / 2);
  const radius = Math.round(Math.min(panelW, panelH) * CORNER_RADIUS_RATIO);

  // Resize and round-mask each panel.
  const preparePanel = async (buf: Buffer): Promise<Buffer> => {
    const resized = await sharp(buf, { failOn: "none" })
      .resize({ width: panelW, height: panelH, fit: "cover" })
      .png()
      .toBuffer();
    return await sharp(resized)
      .composite([
        { input: roundedRectMask(panelW, panelH, radius), blend: "dest-in" },
      ])
      .png()
      .toBuffer();
  };

  const [tl, tr, bl, br] = await Promise.all([
    preparePanel(topLeft),
    preparePanel(topRight),
    preparePanel(bottomLeft),
    preparePanel(bottomRight),
  ]);

  // Position each panel on the canvas.
  const leftX = margin;
  const rightX = margin + panelW + gap;
  const topY = margin;
  const bottomY = margin + panelH + gap;

  return await sharp({
    create: {
      width: dims.w,
      height: dims.h,
      channels: 4,
      background: BACKGROUND_FILL,
    },
  })
    .composite([
      { input: tl, left: leftX, top: topY },
      { input: tr, left: rightX, top: topY },
      { input: bl, left: leftX, top: bottomY },
      { input: br, left: rightX, top: bottomY },
    ])
    .png()
    .toBuffer();
}
