"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/store/editor";

type Props = {
  messages: ChatMessage[];
  loading: boolean;
  prompt: string;
  setPrompt: (s: string) => void;
  onSend: () => void;
  hasImage: boolean;
  maskActive: boolean;
  selectionPreview: string | null;
  onClearSelection: () => void;
};

export default function ChatPanel({
  messages,
  loading,
  prompt,
  setPrompt,
  onSend,
  hasImage,
  maskActive,
  selectionPreview,
  onClearSelection,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  const placeholder = !hasImage
    ? "Upload an image to start"
    : maskActive
      ? "Describe the change for the selected area…"
      : 'e.g., "change the background to a beach at sunset"';

  return (
    <div className="flex h-full min-h-0 flex-col border-l border-neutral-800 bg-neutral-950 text-neutral-100">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3 text-sm font-medium">
        Edits
        {maskActive && (
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300">
            area selected
          </span>
        )}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <div className="text-sm text-neutral-500">
            Type a prompt to edit the whole image, or click{" "}
            <span className="font-medium text-cyan-300">Select area to edit</span>{" "}
            on the canvas to paint a region first.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-6 rounded-lg bg-neutral-800 px-3 py-2 text-sm"
                : "mr-6 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 px-3 py-2 text-sm"
            }
          >
            {m.selectionPreview && (
              <div className="mb-2">
                <div className="mb-1 text-[10px] uppercase tracking-wide text-cyan-400">
                  Edited area
                </div>
                <img
                  src={m.selectionPreview}
                  alt="selected area"
                  className="max-h-32 rounded ring-1 ring-cyan-500/40"
                />
              </div>
            )}
            {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}
            {m.imageDataUrl && (
              <img
                src={m.imageDataUrl}
                alt=""
                className="mt-2 max-h-48 rounded"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="mr-6 rounded-lg bg-neutral-900 ring-1 ring-neutral-800 px-3 py-2 text-sm text-neutral-400">
            Editing…
          </div>
        )}
      </div>

      {maskActive && selectionPreview && (
        <div className="border-t border-neutral-800 bg-neutral-900/60 p-3">
          <div className="flex items-start gap-3">
            <img
              src={selectionPreview}
              alt="selection preview"
              className="h-20 w-20 flex-none rounded object-cover ring-2 ring-cyan-500"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-cyan-300">
                Editing this area only
              </div>
              <div className="mt-0.5 text-xs text-neutral-400">
                The cyan-highlighted region is what will change. Type your edit
                below, or{" "}
                <button
                  onClick={onClearSelection}
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  clear selection
                </button>
                .
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-neutral-800 p-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading && hasImage && prompt.trim()) onSend();
            }
          }}
          placeholder={placeholder}
          disabled={!hasImage || loading}
          rows={3}
          className="w-full resize-none rounded-md bg-neutral-900 px-3 py-2 text-sm placeholder-neutral-600 ring-1 ring-neutral-800 focus:outline-none focus:ring-neutral-600 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!hasImage || loading || !prompt.trim()}
          className={`mt-2 w-full rounded-md px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${
            maskActive
              ? "bg-cyan-500 text-neutral-950 hover:bg-cyan-400"
              : "bg-white text-neutral-900 hover:bg-neutral-200"
          }`}
        >
          {loading ? "Generating…" : maskActive ? "Edit selected area" : "Send"}
        </button>
      </div>
    </div>
  );
}
