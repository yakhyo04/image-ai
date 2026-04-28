"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FORMAT_EXTS,
  FORMAT_LABELS,
  loadImage,
  resizeAndExport,
  triggerDownload,
  type ImageFormat,
} from "@/lib/imageExport";

type Preset = {
  id: string;
  label: string;
  longestEdge: number | null;
};

const PRESETS: Preset[] = [
  { id: "original", label: "Original", longestEdge: null },
  { id: "small", label: "Small", longestEdge: 512 },
  { id: "medium", label: "Medium", longestEdge: 1024 },
  { id: "large", label: "Large", longestEdge: 2048 },
];

type Props = {
  open: boolean;
  imageDataUrl: string | null;
  onClose: () => void;
};

export default function DownloadDialog({ open, imageDataUrl, onClose }: Props) {
  const [origWidth, setOrigWidth] = useState<number | null>(null);
  const [origHeight, setOrigHeight] = useState<number | null>(null);
  const [presetId, setPresetId] = useState<string>("original");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<ImageFormat>("image/png");
  const [quality, setQuality] = useState<number>(92);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !imageDataUrl) return;
    let cancelled = false;
    loadImage(imageDataUrl)
      .then((img) => {
        if (cancelled) return;
        setOrigWidth(img.naturalWidth);
        setOrigHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setPresetId("original");
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not read image dimensions");
      });
    return () => {
      cancelled = true;
    };
  }, [open, imageDataUrl]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const aspect = useMemo(
    () => (origWidth && origHeight ? origWidth / origHeight : 1),
    [origWidth, origHeight],
  );

  function applyPreset(preset: Preset) {
    if (!origWidth || !origHeight) return;
    setPresetId(preset.id);
    if (preset.longestEdge === null) {
      setWidth(origWidth);
      setHeight(origHeight);
      return;
    }
    const longest = Math.max(origWidth, origHeight);
    const scale = Math.min(1, preset.longestEdge / longest);
    setWidth(Math.round(origWidth * scale));
    setHeight(Math.round(origHeight * scale));
  }

  function onWidthChange(next: number) {
    setPresetId("custom");
    const w = Math.max(1, Math.min(8192, Math.round(next || 0)));
    setWidth(w);
    if (lockAspect && origWidth && origHeight) {
      setHeight(Math.max(1, Math.round(w / aspect)));
    }
  }

  function onHeightChange(next: number) {
    setPresetId("custom");
    const h = Math.max(1, Math.min(8192, Math.round(next || 0)));
    setHeight(h);
    if (lockAspect && origWidth && origHeight) {
      setWidth(Math.max(1, Math.round(h * aspect)));
    }
  }

  async function onDownload() {
    if (!imageDataUrl || !width || !height) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await resizeAndExport(
        imageDataUrl,
        width,
        height,
        format,
        Math.min(1, Math.max(0.1, quality / 100)),
      );
      const ext = FORMAT_EXTS[format];
      const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      triggerDownload(blob, `image-ai-${width}x${height}-${stamp}.${ext}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  const showQuality = format !== "image/png";
  const ready = !!origWidth && !!origHeight && !!width && !!height && !busy;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Download image"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-t-2xl bg-neutral-950 text-neutral-100 shadow-2xl ring-1 ring-neutral-800 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
          <h2 className="text-base font-semibold">Download image</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="space-y-5 px-5 py-4">
          <div className="text-xs text-neutral-400">
            Original: {origWidth ?? "…"} × {origHeight ?? "…"} px
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Size
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((p) => {
                const longest =
                  origWidth && origHeight
                    ? Math.max(origWidth, origHeight)
                    : null;
                const dim =
                  p.longestEdge === null
                    ? origWidth && origHeight
                      ? `${origWidth}×${origHeight}`
                      : "—"
                    : longest && p.longestEdge >= longest
                      ? "≤ orig."
                      : `${p.longestEdge}px`;
                const active = presetId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className={`rounded-md px-2 py-2 text-xs ring-1 ${
                      active
                        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/60"
                        : "bg-neutral-900 text-neutral-200 ring-neutral-800 hover:bg-neutral-800"
                    }`}
                  >
                    <div className="font-medium">{p.label}</div>
                    <div className="text-[10px] text-neutral-500">{dim}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Custom dimensions
              </div>
              <label className="flex items-center gap-1.5 text-xs text-neutral-400">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="accent-cyan-500"
                />
                Lock ratio
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-xs text-neutral-400">
                Width (px)
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={8192}
                  value={width || ""}
                  onChange={(e) => onWidthChange(Number(e.target.value))}
                  className="rounded-md bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 ring-1 ring-neutral-800 focus:outline-none focus:ring-cyan-500/60"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-neutral-400">
                Height (px)
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={8192}
                  value={height || ""}
                  onChange={(e) => onHeightChange(Number(e.target.value))}
                  className="rounded-md bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 ring-1 ring-neutral-800 focus:outline-none focus:ring-cyan-500/60"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Format
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FORMAT_LABELS) as ImageFormat[]).map((f) => {
                const active = format === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`rounded-md px-2 py-2 text-xs ring-1 ${
                      active
                        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/60"
                        : "bg-neutral-900 text-neutral-200 ring-neutral-800 hover:bg-neutral-800"
                    }`}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                );
              })}
            </div>
          </div>

          {showQuality && (
            <label className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-neutral-400">
                <span>Quality</span>
                <span className="tabular-nums text-neutral-300">{quality}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </label>
          )}

          {error && (
            <div className="rounded-md bg-red-500/15 px-3 py-2 text-xs text-red-300 ring-1 ring-red-500/40">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-neutral-800 bg-neutral-900/40 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={onDownload}
            disabled={!ready}
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Preparing…" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
