"use client";

export type AppMode = "edit" | "infographic";

type Props = {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
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
    "rounded-md px-2.5 py-1.5 text-xs sm:text-sm ring-1 ring-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 bg-neutral-900 hover:bg-neutral-800";
  const tab = (active: boolean) =>
    `rounded-md px-2.5 py-1.5 text-xs sm:text-sm ring-1 ${
      active
        ? "bg-cyan-500/20 text-cyan-200 ring-cyan-500/60"
        : "bg-neutral-900 text-neutral-300 ring-neutral-800 hover:bg-neutral-800"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 sm:gap-2 sm:px-4">
      <span className="hidden text-sm font-semibold sm:inline">image-AI</span>
      <span className="mx-1 hidden h-5 w-px bg-neutral-800 sm:inline-block sm:mx-2" />

      <div className="flex items-center gap-1">
        <button
          className={tab(p.mode === "edit")}
          onClick={() => p.onModeChange("edit")}
        >
          Editor
        </button>
        <button
          className={tab(p.mode === "infographic")}
          onClick={() => p.onModeChange("infographic")}
        >
          Infographic
        </button>
      </div>

      {p.mode === "edit" && (
        <>
          <span className="mx-1 h-5 w-px bg-neutral-800 sm:mx-2" />
          <button className={btn} onClick={p.onUndo} disabled={!p.canUndo}>
            Undo
          </button>
          <button className={btn} onClick={p.onRedo} disabled={!p.canRedo}>
            Redo
          </button>
          <span className="mx-1 h-5 w-px bg-neutral-800 sm:mx-2" />
          <button className={btn} onClick={p.onDownload} disabled={!p.hasImage}>
            Download
          </button>
          <button className={btn} onClick={p.onReset} disabled={!p.hasImage}>
            New image
          </button>
        </>
      )}
    </div>
  );
}
