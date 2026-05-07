"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import ImageCanvas, { type ImageCanvasHandle } from "@/components/ImageCanvas";
import ChatPanel from "@/components/ChatPanel";
import Toolbar, { type AppMode } from "@/components/Toolbar";
import DownloadDialog from "@/components/DownloadDialog";
import InfographicView from "@/components/InfographicView";
import { useEditor, currentImage } from "@/store/editor";

function dataUrlToBase64(dataUrl: string): {
  base64: string;
  mimeType: string;
} {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid data URL");
  return { mimeType: match[1], base64: match[2] };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Home() {
  const editor = useEditor();
  const image = currentImage(editor);
  const canvasRef = useRef<ImageCanvasHandle>(null);

  const [mode, setMode] = useState<AppMode>("edit");
  const [prompt, setPrompt] = useState("");
  const [brushEnabled, setBrushEnabled] = useState(false);
  const [brushSize, setBrushSize] = useState(40);
  const [hasMask, setHasMask] = useState(false);
  const [selectionPreview, setSelectionPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);

  function refreshPreview(active: boolean) {
    setHasMask(active);
    setSelectionPreview(active ? canvasRef.current?.exportPreview() ?? null : null);
  }

  const hasImage = !!image;
  const canUndo = editor.cursor > 0;
  const canRedo = editor.cursor >= 0 && editor.cursor < editor.history.length - 1;

  async function loadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please drop an image file.");
      return;
    }
    setError(null);
    const dataUrl = await fileToDataUrl(file);
    editor.setInitialImage(dataUrl);
    setBrushEnabled(false);
    setHasMask(false);
    setSelectionPreview(null);
  }

  function onUploadInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  async function onSend() {
    if (!image || !prompt.trim()) return;
    setError(null);
    const userText = prompt.trim();
    const masked = canvasRef.current?.exportMaskedSource() ?? null;
    const previewSnapshot =
      masked ? canvasRef.current?.exportPreview() ?? null : null;

    const { base64, mimeType } = masked
      ? masked
      : dataUrlToBase64(image);

    editor.addMessage({
      id: uid(),
      role: "user",
      text: userText,
      selectionPreview: previewSnapshot ?? undefined,
    });
    setPrompt("");
    editor.setLoading(true);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          imageMimeType: mimeType,
          prompt: userText,
          selectionMode: !!masked,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

      const newDataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
      editor.pushImage(newDataUrl);
      editor.addMessage({
        id: uid(),
        role: "assistant",
        text: data.text,
        imageDataUrl: newDataUrl,
      });

      canvasRef.current?.clearMask();
      setBrushEnabled(false);
      setSelectionPreview(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed";
      setError(msg);
      editor.addMessage({
        id: uid(),
        role: "assistant",
        text: `Error: ${msg}`,
      });
    } finally {
      editor.setLoading(false);
    }
  }

  function onDownload() {
    if (!image) return;
    setDownloadOpen(true);
  }

  function onClearMask() {
    canvasRef.current?.clearMask();
    setSelectionPreview(null);
  }

  function onCancelSelection() {
    canvasRef.current?.clearMask();
    setBrushEnabled(false);
    setSelectionPreview(null);
  }

  return (
    <div className="flex h-[100dvh] w-screen flex-col bg-neutral-950">
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        hasImage={hasImage}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => {
          editor.undo();
          setBrushEnabled(false);
        }}
        onRedo={() => {
          editor.redo();
          setBrushEnabled(false);
        }}
        onDownload={onDownload}
        onReset={() => {
          editor.reset();
          setBrushEnabled(false);
        }}
      />

      {mode === "infographic" ? (
        <InfographicView />
      ) : (
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(180px,40dvh)] md:grid-cols-[1fr_380px] md:grid-rows-1">
        <div
          className="relative min-h-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {image ? (
            <>
              <ImageCanvas
                key={editor.cursor}
                ref={canvasRef}
                imageDataUrl={image}
                brushEnabled={brushEnabled}
                brushSize={brushSize}
                onMaskChange={refreshPreview}
              />

              {brushEnabled ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-2 sm:p-3">
                  <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl bg-neutral-950/90 px-3 py-2 text-sm text-neutral-100 shadow-lg ring-1 ring-cyan-500/40 backdrop-blur sm:gap-3 sm:rounded-full sm:px-4">
                    <span className="w-full text-center text-xs font-medium text-cyan-300 sm:w-auto sm:text-sm">
                      {hasMask
                        ? "Looks good — describe the change below"
                        : "Paint the area to change"}
                    </span>
                    <label className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="hidden sm:inline">Brush</span>
                      <input
                        type="range"
                        min={8}
                        max={160}
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-24 sm:w-32"
                      />
                      <span className="w-6 text-right tabular-nums">{brushSize}</span>
                    </label>
                    <button
                      onClick={onClearMask}
                      disabled={!hasMask}
                      className="rounded-full px-3 py-1 text-xs ring-1 ring-neutral-700 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Clear
                    </button>
                    <button
                      onClick={onCancelSelection}
                      className="rounded-full px-3 py-1 text-xs ring-1 ring-neutral-700 hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center sm:bottom-6">
                  <button
                    onClick={() => setBrushEnabled(true)}
                    className="pointer-events-auto flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 shadow-lg ring-1 ring-cyan-300 hover:bg-cyan-400 sm:px-5 sm:py-2.5"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M3 21l3-1 11-11-2-2L4 18l-1 3z" />
                      <path d="M14 7l3 3" />
                    </svg>
                    Select area to edit
                  </button>
                </div>
              )}
            </>
          ) : (
            <label className="flex h-full w-full cursor-pointer items-center justify-center p-4 text-neutral-400">
              <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-neutral-700 px-8 py-10 text-center sm:px-12 sm:py-16">
                <span className="text-base sm:text-lg">
                  <span className="hidden sm:inline">Drop an image here</span>
                  <span className="sm:hidden">Tap to choose an image</span>
                </span>
                <span className="hidden text-xs text-neutral-500 sm:inline">
                  or click to choose a file
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUploadInput}
                />
              </div>
            </label>
          )}
          {error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-red-500/90 px-3 py-2 text-sm text-white">
              {error}
            </div>
          )}
        </div>

        <ChatPanel
          messages={editor.messages}
          loading={editor.loading}
          prompt={prompt}
          setPrompt={setPrompt}
          onSend={onSend}
          hasImage={hasImage}
          maskActive={brushEnabled && hasMask}
          selectionPreview={selectionPreview}
          onClearSelection={onClearMask}
        />
      </div>
      )}

      <DownloadDialog
        open={downloadOpen}
        imageDataUrl={image ?? null}
        onClose={() => setDownloadOpen(false)}
      />
    </div>
  );
}
