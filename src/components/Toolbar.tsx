"use client";

type Props = {
  hasImage: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onReset: () => void;
};

export default function Toolbar(p: Props) {
  const btn =
    "rounded-md px-3 py-1.5 text-sm ring-1 ring-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 bg-neutral-900 hover:bg-neutral-800";
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 bg-neutral-950 px-4 py-2 text-neutral-100">
      <span className="text-sm font-semibold">image-ai</span>
      <span className="mx-2 h-5 w-px bg-neutral-800" />
      <button className={btn} onClick={p.onUndo} disabled={!p.canUndo}>
        Undo
      </button>
      <button className={btn} onClick={p.onRedo} disabled={!p.canRedo}>
        Redo
      </button>
      <span className="mx-2 h-5 w-px bg-neutral-800" />
      <button className={btn} onClick={p.onDownload} disabled={!p.hasImage}>
        Download
      </button>
      <button className={btn} onClick={p.onReset} disabled={!p.hasImage}>
        New image
      </button>
    </div>
  );
}
