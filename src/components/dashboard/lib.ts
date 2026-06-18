export type InlineImage = { base64: string; mimeType: string; dataUrl: string };

const MAX_UPLOAD_DIM = 1536;
const UPLOAD_JPEG_QUALITY = 0.85;

/** Resize a File down to a sane size and return base64 + dataUrl. */
export async function resizeAndEncodeImage(file: File): Promise<InlineImage> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error("Could not read image"));
      im.src = objectUrl;
    });

    const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
    const scale = longEdge > MAX_UPLOAD_DIM ? MAX_UPLOAD_DIM / longEdge : 1;
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(img, 0, 0, w, h);

    const dataUrl = canvas.toDataURL("image/jpeg", UPLOAD_JPEG_QUALITY);
    const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
    if (!match) throw new Error("Failed to encode image");
    return { dataUrl, mimeType: match[1], base64: match[2] };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function dataUrlToParts(dataUrl: string): { base64: string; mimeType: string } {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid data URL");
  return { mimeType: match[1], base64: match[2] };
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
