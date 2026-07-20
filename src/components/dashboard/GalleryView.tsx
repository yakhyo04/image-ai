"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import type { GalleryItem } from "@/lib/generations";

// Maps stored tool keys → display label + filter bucket.
const TOOL_LABELS: Record<string, string> = {
  infographics: "Infographic",
  editor: "Edit",
  interior: "Interior",
  mockups: "Mockup",
  backgrounds: "Background",
  patterns: "Pattern",
  video: "Video",
};
const FILTERS = ["All", "Infographics", "Videos", "Interiors", "Mockups", "Backgrounds", "Patterns", "Edits"];

const isVideo = (it: GalleryItem) => (it.mimeType ?? "").startsWith("video");
const TONES = ["oklch(0.34 0.07 200)", "oklch(0.33 0.06 130)", "oklch(0.32 0.07 300)", "oklch(0.34 0.08 70)", "oklch(0.36 0.08 25)"];

function relativeWhen(iso: string): string {
  const then = new Date(iso).getTime();
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

// Filter label (plural) → matching tool key.
function filterMatches(filter: string, tool: string | null): boolean {
  if (filter === "All") return true;
  const map: Record<string, string> = {
    Infographics: "infographics",
    Videos: "video",
    Interiors: "interior",
    Mockups: "mockups",
    Backgrounds: "backgrounds",
    Patterns: "patterns",
    Edits: "editor",
  };
  return map[filter] === tool;
}

export default function GalleryView({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"grid" | "masonry">("grid");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [sortOpen, setSortOpen] = useState(false);

  // `items` arrive newest-first; reverse for oldest-first.
  const filtered = items.filter((it) => filterMatches(filter, it.tool));
  const shown = sort === "newest" ? filtered : [...filtered].reverse();

  const weekCount = items.filter((i) => Date.now() - new Date(i.createdAt).getTime() < 7 * 86_400_000).length;
  const stats: [string, string, boolean?][] = [
    [String(items.length), "Total generations"],
    [String(new Set(items.map((i) => i.tool)).size), "Tools used", true],
    [String(items.filter((i) => relativeWhen(i.createdAt) === "Today").length), "Created today"],
    [String(weekCount), "This week"],
  ];

  const badges = (it: GalleryItem) => (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", color: "oklch(1 0 0 / 0.85)", background: "oklch(0 0 0 / 0.4)", backdropFilter: "blur(8px)", padding: "3px 8px", borderRadius: 100 }}>{(TOOL_LABELS[it.tool ?? ""] ?? "Image").toUpperCase()}</div>
      <div style={{ position: "absolute", bottom: 10, right: 10 }}>
        <span className="ab-mono" style={{ fontSize: 9, color: "oklch(1 0 0 / 0.9)", background: "oklch(0 0 0 / 0.4)", backdropFilter: "blur(8px)", padding: "3px 8px", borderRadius: 100 }}>{relativeWhen(it.createdAt)}</span>
      </div>
    </>
  );

  // Inner content of a gallery card — image or video first frame, with a play
  // badge over videos. `mode` controls cover-fill (grid) vs natural-height
  // (masonry).
  const tileInner = (it: GalleryItem, i: number, mode: "grid" | "masonry") => {
    const mediaStyle =
      mode === "grid"
        ? ({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const)
        : ({ display: "block", width: "100%", height: "auto" } as const);
    return (
      <div style={{ ...(mode === "grid" ? { aspectRatio: "3 / 4" } : {}), background: TONES[i % 5], position: "relative" }}>
        {isVideo(it) ? (
          <video src={it.url} muted loop playsInline preload="metadata" style={mediaStyle} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={it.url} alt={TOOL_LABELS[it.tool ?? ""] ?? "Generation"} loading="lazy" decoding="async" style={mediaStyle} />
        )}
        {isVideo(it) && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ width: 44, height: 44, borderRadius: "50%", background: "oklch(0 0 0 / 0.5)", backdropFilter: "blur(6px)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="play" size={20} /></span>
          </div>
        )}
        {badges(it)}
      </div>
    );
  };

  return (
    <DashFrame active="gallery" title="Gallery / History">
      <div style={{ padding: 24 }}>
        {/* stats */}
        <div className="ab-dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {stats.map(([v, l, acc], i) => (
            <div key={i} className="ab-card" style={{ padding: 18 }}>
              <div className="ab-eyebrow" style={{ fontSize: 10, color: acc ? "var(--acc)" : "var(--t-3)" }}>{l}</div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 6, color: acc ? "var(--acc)" : "var(--t-1)" }}>{v}</div>
            </div>
          ))}
        </div>
        {/* filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, padding: 4, flexWrap: "wrap" }}>
            {FILTERS.map((t) => (
              <span key={t} onClick={() => setFilter(t)} style={{ padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", background: t === filter ? "var(--bg-3)" : "transparent", color: t === filter ? "var(--t-1)" : "var(--t-3)" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setSortOpen((o) => !o)} className="ab-btn ab-btn-ghost ab-btn-sm" aria-haspopup="menu" aria-expanded={sortOpen}>
                <Icon name="filter" size={15} /> {sort === "newest" ? "Newest" : "Oldest"}
              </button>
              {sortOpen && (
                <>
                  <div onClick={() => setSortOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                  <div role="menu" style={{ position: "absolute", top: 42, right: 0, zIndex: 41, width: 150, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--sh-2)", padding: 6 }}>
                    {(["newest", "oldest"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSort(s); setSortOpen(false); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "9px 10px", borderRadius: 8, background: "transparent", border: "none", color: "var(--t-1)", fontSize: 13, fontFamily: "var(--font)", cursor: "pointer", textAlign: "left" }}
                      >
                        {s === "newest" ? "Newest first" : "Oldest first"}
                        {sort === s && <Icon name="check" size={14} stroke={2.6} style={{ color: "var(--acc)" }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setView((v) => (v === "grid" ? "masonry" : "grid"))}
              title={view === "grid" ? "Switch to masonry view" : "Switch to grid view"}
              aria-label="Toggle layout"
              style={{ width: 38, height: 38, borderRadius: 10, background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--t-1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Icon name={view === "grid" ? "maximize" : "grid"} size={17} />
            </button>
          </div>
        </div>

        {shown.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "80px 20px", textAlign: "center", border: "1.5px dashed var(--border-strong)", borderRadius: 16, color: "var(--t-2)" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="gallery" size={26} /></div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--t-1)" }}>{items.length === 0 ? "No generations yet" : "Nothing in this filter"}</div>
            <div className="ab-body" style={{ fontSize: 13, maxWidth: 320 }}>{items.length === 0 ? "Create your first image from any tool and it'll be saved here automatically." : "Try a different filter to see your other work."}</div>
          </div>
        ) : view === "grid" ? (
          /* uniform grid — 5 per row on wide screens */
          <div className="ab-dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {shown.map((it, i) => (
              <Link key={it.id} href={`/dashboard/gallery/${it.id}`} style={{ display: "block", borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative", cursor: "pointer", textDecoration: "none" }}>
                {tileInner(it, i, "grid")}
              </Link>
            ))}
          </div>
        ) : (
          /* masonry — natural heights */
          <div className="ab-dash-masonry" style={{ columnCount: 5, columnGap: 16 }}>
            {shown.map((it, i) => (
              <Link key={it.id} href={`/dashboard/gallery/${it.id}`} style={{ display: "block", breakInside: "avoid", marginBottom: 16, borderRadius: 14, overflow: "hidden", border: "1px solid var(--border-mid)", position: "relative", cursor: "pointer", textDecoration: "none" }}>
                {tileInner(it, i, "masonry")}
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashFrame>
  );
}
