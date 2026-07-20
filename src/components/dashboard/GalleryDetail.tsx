"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import { createClient } from "@/lib/supabase/client";
import { triggerDownload } from "@/lib/imageExport";
import { resizeVideo, VIDEO_SIZES } from "@/lib/videoExport";
import type { GenerationDetail } from "@/lib/generations";

const TOOL_LABELS: Record<string, string> = {
  infographics: "Infographic",
  editor: "Edit",
  interior: "Interior",
  mockups: "Mockup",
  backgrounds: "Background",
  patterns: "Pattern",
  video: "Video",
};

const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "video/mp4": "mp4",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GalleryDetail({ item }: { item: GenerationDetail }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"download" | "delete" | null>(null);
  const [sizeLabel, setSizeLabel] = useState(VIDEO_SIZES[1].label); // default 1080×1920

  const label = TOOL_LABELS[item.tool ?? ""] ?? "Image";
  const isVideo = (item.mimeType ?? "").startsWith("video");

  async function download() {
    setBusy("download");
    try {
      const size = VIDEO_SIZES.find((s) => s.label === sizeLabel) ?? VIDEO_SIZES[0];
      if (isVideo && size.w > 0) {
        const blob = await resizeVideo(item.url, size.w, size.h);
        triggerDownload(blob, `artboard-video-${size.w}x${size.h}.mp4`);
      } else {
        const res = await fetch(item.url);
        const blob = await res.blob();
        const ext = EXT[item.mimeType ?? ""] ?? "png";
        triggerDownload(blob, `artboard-${label.toLowerCase()}-${item.id.slice(0, 8)}.${ext}`);
      }
    } catch {
      // Fall back to opening the file in a new tab if export/blob fetch fails.
      window.open(item.url, "_blank");
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!confirm("Delete this generation? This can't be undone.")) return;
    setBusy("delete");
    const supabase = createClient();
    const { error } = await supabase.from("generations").delete().eq("id", item.id);
    if (error) {
      alert("Couldn't delete — please try again.");
      setBusy(null);
      return;
    }
    router.push("/dashboard/gallery");
    router.refresh();
  }

  return (
    <DashFrame active="gallery" title="Gallery / History">
      <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
        <Link
          href="/dashboard/gallery"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--t-3)", textDecoration: "none", marginBottom: 18 }}
        >
          <Icon name="chevron-right" size={16} style={{ transform: "rotate(180deg)" }} /> Back to gallery
        </Link>

        <div className="ab-dash-detail" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignItems: "start" }}>
          {/* image */}
          <div className="ab-card" style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
            {(item.mimeType ?? "").startsWith("video") ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={item.url}
                controls
                autoPlay
                loop
                muted
                playsInline
                style={{ display: "block", maxWidth: "100%", maxHeight: "72vh", borderRadius: 10, background: "#000" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={label}
                style={{ display: "block", maxWidth: "100%", maxHeight: "72vh", height: "auto", borderRadius: 10 }}
              />
            )}
          </div>

          {/* meta + actions */}
          <div className="ab-card" style={{ padding: 22 }}>
            <span className="ab-chip ab-chip-acc" style={{ marginBottom: 14 }}>
              <Icon name="sparkle-fill" size={12} /> {label}
            </span>
            <div className="ab-h4" style={{ fontSize: 18, marginBottom: 4 }}>{label} generation</div>
            <div className="ab-body" style={{ fontSize: 12.5 }}>{fmtDate(item.createdAt)}</div>

            {item.prompt && (
              <>
                <div className="ab-eyebrow" style={{ fontSize: 10, marginTop: 22, marginBottom: 8 }}>Prompt</div>
                <div className="ab-body" style={{ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 11, padding: "12px 14px" }}>{item.prompt}</div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
              {isVideo && (
                <select
                  value={sizeLabel}
                  onChange={(e) => setSizeLabel(e.target.value)}
                  disabled={busy !== null}
                  aria-label="Download size"
                  style={{ height: 44, borderRadius: 11, background: "var(--bg)", border: "1px solid var(--border-mid)", color: "var(--t-1)", padding: "0 12px", fontSize: 14, fontFamily: "var(--font)", cursor: busy ? "default" : "pointer" }}
                >
                  {VIDEO_SIZES.map((s) => (
                    <option key={s.label} value={s.label}>{s.label}</option>
                  ))}
                </select>
              )}
              <button onClick={download} disabled={busy !== null} className="ab-btn ab-btn-primary ab-btn-full" style={{ opacity: busy ? 0.7 : 1 }}>
                <Icon name="download" size={16} stroke={2.2} /> {busy === "download" ? (isVideo ? "Exporting…" : "Preparing…") : "Download"}
              </button>
              <button onClick={remove} disabled={busy !== null} className="ab-btn ab-btn-ghost ab-btn-full" style={{ color: "var(--err)", opacity: busy ? 0.7 : 1 }}>
                <Icon name="trash" size={16} /> {busy === "delete" ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
