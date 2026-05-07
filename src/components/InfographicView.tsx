"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import DownloadDialog from "@/components/DownloadDialog";
import {
  INFOGRAPHIC_STYLE_META,
  type InfographicStyle,
} from "@/lib/infographicStyles";

type InlineImage = {
  base64: string;
  mimeType: string;
  dataUrl: string;
};

type Aspect = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const ASPECTS: { id: Aspect; label: string; hint: string }[] = [
  { id: "3:4", label: "3:4", hint: "Portrait" },
  { id: "9:16", label: "9:16", hint: "Tall" },
  { id: "1:1", label: "1:1", hint: "Square" },
  { id: "4:3", label: "4:3", hint: "Landscape" },
  { id: "16:9", label: "16:9", hint: "Wide" },
];

const MAX_IMAGES = 4;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function dataUrlToBase64(dataUrl: string): { base64: string; mimeType: string } {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid data URL");
  return { mimeType: match[1], base64: match[2] };
}

export default function InfographicView() {
  const [images, setImages] = useState<InlineImage[]>([]);
  const [description, setDescription] = useState("");
  const [aspect, setAspect] = useState<Aspect>("3:4");
  const [style, setStyle] = useState<InfographicStyle>("glass");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) {
      setError("Please choose image files only.");
      return;
    }
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }
    const next: InlineImage[] = [];
    for (const file of list.slice(0, remaining)) {
      const dataUrl = await fileToDataUrl(file);
      const { base64, mimeType } = dataUrlToBase64(dataUrl);
      next.push({ dataUrl, base64, mimeType });
    }
    setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
    setError(null);
  }

  function onUploadInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onGenerate() {
    if (images.length === 0) {
      setError("Upload at least one product image.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const trimmed = description.trim();
      const res = await fetch("/api/infographic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: images.map(({ base64, mimeType }) => ({ base64, mimeType })),
          ...(trimmed ? { description: trimmed } : {}),
          aspectRatio: aspect,
          style,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  function onClear() {
    setResult(null);
    setError(null);
  }

  const slots = Array.from({ length: MAX_IMAGES }, (_, i) => images[i]);
  const hasInputs = images.length > 0;
  const canGenerate = hasInputs && !busy;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(220px,55dvh)] md:grid-cols-[1fr_400px] md:grid-rows-1">
      <div
        className="relative flex min-h-0 items-center justify-center overflow-auto bg-neutral-950 p-4 sm:p-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {result ? (
          <div className="flex max-h-full max-w-full flex-col items-center gap-3">
            <img
              src={result}
              alt="Generated infographic"
              className="max-h-[calc(100dvh-12rem)] max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-neutral-800"
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setDownloadOpen(true)}
                className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400"
              >
                Download
              </button>
              <button
                onClick={onClear}
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-neutral-200 ring-1 ring-neutral-800 hover:bg-neutral-800"
              >
                Generate another
              </button>
            </div>
          </div>
        ) : busy ? (
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-cyan-400" />
            <div className="text-sm">Generating infographic…</div>
            <div className="text-xs text-neutral-500">
              Nano Banana Pro can take up to a minute for the first image.
            </div>
          </div>
        ) : (
          <div className="flex max-w-md flex-col items-center gap-3 text-center text-neutral-400">
            <div className="rounded-2xl border-2 border-dashed border-neutral-700 px-8 py-10 sm:px-12 sm:py-12">
              <div className="text-base sm:text-lg text-neutral-200">
                Product infographic generator
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                Upload up to 4 product photos. A description is optional —
                add one to control the copy and language, or leave it blank
                and the AI will read the product from your photos.
              </div>
              <div className="mt-4 text-[11px] text-neutral-600">
                Powered by Nano Banana Pro
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90%] rounded-md bg-red-500/90 px-3 py-2 text-sm text-white">
            {error}
          </div>
        )}
      </div>

      <div className="flex h-full min-h-0 flex-col border-t border-neutral-800 bg-neutral-950 text-neutral-100 md:border-l md:border-t-0">
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <div className="text-sm font-medium">Infographic inputs</div>
          <div className="text-xs text-neutral-500">
            {images.length}/{MAX_IMAGES} images
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Product images
            </div>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((img, i) =>
                img ? (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-neutral-800"
                  >
                    <img
                      src={img.dataUrl}
                      alt={`Product ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}
                      className="absolute right-1.5 top-1.5 rounded-full bg-neutral-950/80 p-1 text-neutral-300 opacity-0 ring-1 ring-neutral-700 transition group-hover:opacity-100 hover:text-white"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12M6 18L18 6" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-300"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-[11px]">Add photo</span>
                  </button>
                ),
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onUploadInput}
            />
            <div className="mt-1 text-[11px] text-neutral-600">
              Tip: include front, back, and detail shots for best results.
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Product description
              </div>
              <div className="text-[10px] uppercase tracking-wide text-neutral-600">
                Optional
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional. Leave blank to let the AI infer features from your photos. Add a description in any language to control the copy and force that language on the image."
              rows={6}
              className="w-full resize-none rounded-md bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-600 ring-1 ring-neutral-800 focus:outline-none focus:ring-neutral-600"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Style
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {INFOGRAPHIC_STYLE_META.map((s) => {
                const active = style === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-md px-2 py-1.5 text-left ring-1 ${
                      active
                        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/60"
                        : "bg-neutral-900 text-neutral-300 ring-neutral-800 hover:bg-neutral-800"
                    }`}
                    title={s.hint}
                  >
                    <div className="text-xs font-medium">{s.label}</div>
                    <div className="text-[10px] text-neutral-500">{s.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Aspect ratio
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {ASPECTS.map((a) => {
                const active = aspect === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAspect(a.id)}
                    className={`rounded-md px-1 py-1.5 text-xs ring-1 ${
                      active
                        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/60"
                        : "bg-neutral-900 text-neutral-300 ring-neutral-800 hover:bg-neutral-800"
                    }`}
                    title={a.hint}
                  >
                    <div className="font-medium">{a.label}</div>
                    <div className="text-[10px] text-neutral-500">{a.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="w-full rounded-md bg-cyan-500 px-3 py-2.5 text-sm font-medium text-neutral-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate infographic"}
          </button>
          <div className="mt-2 text-center text-[11px] text-neutral-600">
            Powered by Nano Banana Pro
          </div>
        </div>
      </div>

      <DownloadDialog
        open={downloadOpen}
        imageDataUrl={result}
        onClose={() => setDownloadOpen(false)}
      />
    </div>
  );
}
