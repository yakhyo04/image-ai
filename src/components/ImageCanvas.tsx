"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type ImageCanvasHandle = {
  exportMaskBase64: () => string | null;
  exportMaskedSource: () => { base64: string; mimeType: string } | null;
  exportPreview: () => string | null;
  clearMask: () => void;
  hasMask: () => boolean;
};

type Props = {
  imageDataUrl: string;
  brushEnabled: boolean;
  brushSize: number;
  onMaskChange?: (hasMask: boolean) => void;
};

const PREVIEW_MAX_DIM = 360;
const OVERLAY_COLOR = "#22d3ee";
const OVERLAY_ALPHA = 0.55;

const ImageCanvas = forwardRef<ImageCanvasHandle, Props>(function ImageCanvas(
  { imageDataUrl, brushEnabled, brushSize, onMaskChange },
  ref,
) {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const maskDirtyRef = useRef(false);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      const display = displayRef.current;
      if (!display) return;
      display.width = img.naturalWidth;
      display.height = img.naturalHeight;

      const mask = document.createElement("canvas");
      mask.width = img.naturalWidth;
      mask.height = img.naturalHeight;
      maskRef.current = mask;
      maskDirtyRef.current = false;
      onMaskChange?.(false);

      redraw();
      setLoaded(true);
    };
    img.src = imageDataUrl;
  }, [imageDataUrl]);

  function redraw() {
    const display = displayRef.current;
    const img = imageRef.current;
    const mask = maskRef.current;
    if (!display || !img || !mask) return;
    const ctx = display.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, display.width, display.height);
    ctx.drawImage(img, 0, 0);

    if (!maskDirtyRef.current) return;

    const tmp = document.createElement("canvas");
    tmp.width = mask.width;
    tmp.height = mask.height;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    tctx.drawImage(mask, 0, 0);
    tctx.globalCompositeOperation = "source-in";
    tctx.fillStyle = OVERLAY_COLOR;
    tctx.fillRect(0, 0, tmp.width, tmp.height);

    ctx.save();
    ctx.globalAlpha = OVERLAY_ALPHA;
    ctx.drawImage(tmp, 0, 0);
    ctx.restore();
  }

  function pointerToImageCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const display = displayRef.current;
    if (!display) return null;
    const rect = display.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const sx = display.width / rect.width;
    const sy = display.height / rect.height;
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
    };
  }

  function paintTo(p: { x: number; y: number }) {
    const mask = maskRef.current;
    if (!mask) return;
    const mctx = mask.getContext("2d");
    if (!mctx) return;
    const last = lastPointRef.current ?? p;
    mctx.strokeStyle = "#fff";
    mctx.lineCap = "round";
    mctx.lineJoin = "round";
    mctx.lineWidth = brushSize;
    mctx.beginPath();
    mctx.moveTo(last.x, last.y);
    mctx.lineTo(p.x, p.y);
    mctx.stroke();
    lastPointRef.current = p;
    const wasDirty = maskDirtyRef.current;
    maskDirtyRef.current = true;
    if (!wasDirty) onMaskChange?.(true);
    redraw();
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!brushEnabled || !loaded) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    const p = pointerToImageCoords(e);
    if (!p) return;
    lastPointRef.current = p;
    paintTo(p);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const p = pointerToImageCoords(e);
    if (!p) return;
    paintTo(p);
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (maskDirtyRef.current) onMaskChange?.(true);
  }

  useImperativeHandle(ref, () => ({
    exportMaskBase64: () => {
      const mask = maskRef.current;
      if (!mask || !maskDirtyRef.current) return null;
      const out = document.createElement("canvas");
      out.width = mask.width;
      out.height = mask.height;
      const ctx = out.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(mask, 0, 0);
      const url = out.toDataURL("image/png");
      const comma = url.indexOf(",");
      return comma >= 0 ? url.slice(comma + 1) : null;
    },
    exportMaskedSource: () => {
      const img = imageRef.current;
      const mask = maskRef.current;
      if (!img || !mask || !maskDirtyRef.current) return null;
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const cx = c.getContext("2d");
      if (!cx) return null;
      cx.drawImage(img, 0, 0);
      const tmp = document.createElement("canvas");
      tmp.width = mask.width;
      tmp.height = mask.height;
      const tctx = tmp.getContext("2d");
      if (!tctx) return null;
      tctx.drawImage(mask, 0, 0);
      tctx.globalCompositeOperation = "source-in";
      tctx.fillStyle = "#ff00ff";
      tctx.fillRect(0, 0, tmp.width, tmp.height);
      cx.save();
      cx.globalAlpha = 0.7;
      cx.drawImage(tmp, 0, 0);
      cx.restore();
      const url = c.toDataURL("image/png");
      const comma = url.indexOf(",");
      if (comma < 0) return null;
      return { base64: url.slice(comma + 1), mimeType: "image/png" };
    },
    exportPreview: () => {
      const display = displayRef.current;
      if (!display) return null;
      const longest = Math.max(display.width, display.height);
      const ratio = Math.min(1, PREVIEW_MAX_DIM / longest);
      const w = Math.max(1, Math.round(display.width * ratio));
      const h = Math.max(1, Math.round(display.height * ratio));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const cx = c.getContext("2d");
      if (!cx) return null;
      cx.drawImage(display, 0, 0, w, h);
      return c.toDataURL("image/jpeg", 0.75);
    },
    clearMask: () => {
      const mask = maskRef.current;
      if (!mask) return;
      const mctx = mask.getContext("2d");
      if (!mctx) return;
      mctx.clearRect(0, 0, mask.width, mask.height);
      const wasDirty = maskDirtyRef.current;
      maskDirtyRef.current = false;
      if (wasDirty) onMaskChange?.(false);
      redraw();
    },
    hasMask: () => maskDirtyRef.current,
  }));

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900 p-4">
      <canvas
        ref={displayRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="max-h-full max-w-full rounded-md shadow-lg"
        style={{
          touchAction: "none",
          cursor: brushEnabled ? "crosshair" : "default",
        }}
      />
    </div>
  );
});

export default ImageCanvas;
