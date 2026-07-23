// Route a remote image through Next's built-in optimizer (`/_next/image`) so
// the browser downloads a small, compressed WebP instead of the full-res
// original. Used for gallery/history THUMBNAILS — the full-res image is still
// served for downloads, which hit the signed URL directly.
//
// `width` must be one of Next's configured device/image sizes and `quality`
// must be in `images.qualities` (see next.config.ts): 50 for thumbnails,
// 75 for the larger detail preview.
//
// Videos and empty/data/blob URLs are returned unchanged (not optimizable).
export function thumbSrc(url: string, width = 640, quality = 50): string {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
