import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";
import type { GalleryItem } from "@/lib/generations";
import { thumbSrc } from "@/lib/img";

const TOOLS = [
  { id: "infographics", icon: "sliders", title: "Infographics", tone: "oklch(0.34 0.07 200)", href: "/dashboard/infographics", hot: true },
  { id: "editor", icon: "magic", title: "Photo Editor", tone: "oklch(0.32 0.08 25)", href: "/dashboard/editor" },
  { id: "interior", icon: "sofa", title: "Interior Design", tone: "oklch(0.33 0.06 130)", href: "/dashboard/interior" },
  { id: "mockups", icon: "box", title: "Mockups", tone: "oklch(0.32 0.07 300)", href: "/dashboard/mockups" },
  { id: "backgrounds", icon: "scissors", title: "Backgrounds", tone: "oklch(0.34 0.06 250)", href: "/dashboard/backgrounds" },
  { id: "patterns", icon: "palette", title: "Patterns", tone: "oklch(0.34 0.08 70)", href: "/dashboard/patterns", neu: true },
] as const;

const TOOL_LABEL: Record<string, string> = {
  infographics: "Infographic", editor: "Photo edit", interior: "Interior",
  mockups: "Mockup", backgrounds: "Background", patterns: "Pattern", video: "Video",
};
const TOOL_ICON: Record<string, string> = {
  infographics: "sliders", editor: "magic", interior: "sofa",
  mockups: "box", backgrounds: "scissors", patterns: "palette", video: "play",
};
const TOOL_TONE: Record<string, string> = {
  infographics: "oklch(0.34 0.07 200)", editor: "oklch(0.32 0.08 25)", interior: "oklch(0.33 0.06 130)",
  mockups: "oklch(0.32 0.07 300)", backgrounds: "oklch(0.34 0.06 250)", patterns: "oklch(0.34 0.08 70)",
  video: "oklch(0.33 0.09 330)",
};

function ago(iso: string): string {
  const mins = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (mins < 60) return `${Math.max(1, Math.floor(mins))}m`;
  const hrs = mins / 60;
  if (hrs < 24) return `${Math.floor(hrs)}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function DashHome({ name, credits, items, successRate }: { name: string; credits: number; items: GalleryItem[]; successRate: number | null }) {
  const firstName = name.trim().split(/\s+/)[0] || "there";

  const now = Date.now();
  const weekAgo = now - 7 * 86_400_000;
  const ts = (i: GalleryItem) => new Date(i.createdAt).getTime();

  const weekItems = items.filter((i) => ts(i) >= weekAgo);
  // Credits accumulate across purchases, so the nudge is driven by the actual
  // remaining balance rather than a fixed monthly allowance.
  const approxGens = Math.floor(credits / 10);
  const lowCredits = credits < 20;

  const STATS = [
    { v: String(items.length), l: "Total generations", sub: "All time", acc: false },
    { v: String(credits), l: "Credits left", sub: "10 per generation", acc: true },
    { v: successRate === null ? "—" : `${successRate}%`, l: "Success rate", sub: successRate === null ? "No data yet" : "Successful runs", acc: false },
    { v: String(weekItems.length), l: "This week", sub: "Last 7 days", acc: false },
  ];

  // Per-day counts for the last 7 days (oldest → today).
  const bars = Array.from({ length: 7 }, (_, k) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - k));
    const start = d.getTime();
    const count = items.filter((i) => ts(i) >= start && ts(i) < start + 86_400_000).length;
    return { count, label: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()], today: k === 6 };
  });
  const maxBar = Math.max(1, ...bars.map((b) => b.count));

  const recent = items.slice(0, 5);
  const activity = items.slice(0, 4);

  return (
    <DashFrame active="dashboard" title="Dashboard">
      <div style={{ padding: 28, position: "relative" }}>
        <div className="ab-glow" style={{ width: 420, height: 320, background: "var(--acc)", top: -150, right: -100, opacity: 0.08 }} />
        {/* greeting + CTA */}
        <div className="ab-dash-home-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 26, position: "relative", flexWrap: "wrap" }}>
          <div>
            <div className="ab-eyebrow" style={{ marginBottom: 8 }}>Your studio</div>
            <div className="ab-h2" style={{ fontSize: 30 }}>Welcome back, {firstName}</div>
          </div>
          <Link href="/dashboard/infographics" className="ab-btn ab-btn-primary ab-btn-lg"><Icon name="plus" size={18} stroke={2.4} /> New generation</Link>
        </div>

        {/* stat cards */}
        <div className="ab-dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {STATS.map((s, i) => (
            <div key={i} className="ab-card" style={{ padding: 20 }}>
              <div className="ab-eyebrow" style={{ fontSize: 10, color: s.acc ? "var(--acc)" : "var(--t-3)" }}>{s.l}</div>
              <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.04em", marginTop: 8, color: s.acc ? "var(--acc)" : "var(--t-1)" }}>{s.v}</div>
              <div className="ab-body" style={{ fontSize: 12, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* quick tools */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="ab-h4" style={{ fontSize: 17 }}>Quick start</div>
          <span className="ab-mono" style={{ color: "var(--t-3)", fontSize: 11 }}>06 TOOLS</span>
        </div>
        <div className="ab-dash-tools" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 30 }}>
          {TOOLS.map((tl) => (
            <Link key={tl.id} href={tl.href} style={{ borderRadius: 16, overflow: "hidden", background: tl.tone, border: "1px solid var(--border-mid)", padding: 15, height: 134, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", cursor: "pointer", textDecoration: "none" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 9px)" }} />
              <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: "oklch(0 0 0 / 0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "oklch(1 0 0 / 0.95)" }}><Icon name={tl.icon} size={19} /></div>
                {("hot" in tl || "neu" in tl) && <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, padding: "3px 6px", borderRadius: 6, background: "hot" in tl ? "var(--acc)" : "oklch(0 0 0 / 0.35)", color: "hot" in tl ? "var(--acc-ink)" : "oklch(1 0 0 / 0.9)", letterSpacing: "0.06em" }}>{"hot" in tl ? "HOT" : "NEW"}</span>}
              </div>
              <div style={{ position: "relative", fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em", color: "oklch(1 0 0 / 0.95)" }}>{tl.title}</div>
            </Link>
          ))}
        </div>

        {/* recent + activity */}
        <div className="ab-dash-home-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <div className="ab-h4" style={{ fontSize: 17 }}>Recent work</div>
              <Link href="/dashboard/gallery" style={{ fontSize: 13, color: "var(--acc)", textDecoration: "none" }}>Gallery →</Link>
            </div>
            {recent.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", border: "1.5px dashed var(--border-strong)", borderRadius: 14, color: "var(--t-2)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t-1)" }}>Nothing here yet</div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 4 }}>Your generated images will show up here automatically.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {recent.map((g) => (
                  <Link key={g.id} href={`/dashboard/gallery/${g.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ aspectRatio: "3/4", borderRadius: 12, background: TOOL_TONE[g.tool ?? ""] ?? "var(--bg-3)", border: "1px solid var(--border-mid)", position: "relative", overflow: "hidden" }}>
                      {(g.mimeType ?? "").startsWith("video") ? (
                        <>
                          <video src={g.url} muted loop playsInline preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: "50%", background: "oklch(0 0 0 / 0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="play" size={14} /></span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbSrc(g.url)} alt={TOOL_LABEL[g.tool ?? ""] ?? "Generation"} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginTop: 7, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{TOOL_LABEL[g.tool ?? ""] ?? "Image"}</div>
                    <div className="ab-mono" style={{ fontSize: 9.5, color: "var(--t-3)", marginTop: 1 }}>{ago(g.createdAt)} ago</div>
                  </Link>
                ))}
              </div>
            )}
            {/* usage chart */}
            <div className="ab-card" style={{ padding: 20, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="ab-h4" style={{ fontSize: 15 }}>Generations this week</div>
                <div style={{ fontSize: 13, color: "var(--acc)", fontWeight: 600 }}>{weekItems.length}</div>
              </div>
              <div style={{ display: "flex", gap: 8, height: 90, alignItems: "flex-end" }}>
                {bars.map((b, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div title={`${b.count} generation${b.count === 1 ? "" : "s"}`} style={{ width: "100%", height: `${b.count === 0 ? 3 : Math.max(8, (b.count / maxBar) * 100)}%`, borderRadius: 6, background: b.today && b.count > 0 ? "var(--acc)" : "var(--bg-3)" }} />
                    <span className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>Activity</div>
            {activity.length === 0 ? (
              <div className="ab-card" style={{ padding: "32px 20px", textAlign: "center", color: "var(--t-2)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t-1)" }}>No activity yet</div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 4 }}>Generate your first image to get started.</div>
              </div>
            ) : (
              <div className="ab-card" style={{ overflow: "hidden" }}>
                {activity.map((a, i) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", borderBottom: i < activity.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: TOOL_TONE[a.tool ?? ""] ?? "var(--bg-2)", color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={TOOL_ICON[a.tool ?? ""] ?? "sparkle-fill"} size={17} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>Generated · {TOOL_LABEL[a.tool ?? ""] ?? "Image"}</div>
                      <div className="ab-body" style={{ fontSize: 12, marginTop: 1 }}>Saved to gallery</div>
                    </div>
                    <span className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)" }}>{ago(a.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
            {/* credits nudge */}
            <div style={{ marginTop: 16, padding: 18, borderRadius: 16, background: "linear-gradient(160deg, var(--acc-soft), transparent)", border: "1px solid var(--acc-line)", position: "relative", overflow: "hidden" }}>
              <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", bottom: -50, right: -30, opacity: 0.25 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700 }}><Icon name="crown" size={16} style={{ color: "var(--acc)" }} /> {lowCredits ? "Running low" : "Your credits"}</div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 6 }}>
                  {lowCredits
                    ? `Only ${credits} credits left — top up to keep generating.`
                    : `You have ${credits} credits — about ${approxGens} more ${approxGens === 1 ? "generation" : "generations"}.`}
                </div>
                <Link href="/dashboard/credits" className="ab-btn ab-btn-primary ab-btn-sm" style={{ marginTop: 12 }}>Buy credits</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
