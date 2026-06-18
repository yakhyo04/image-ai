import Link from "next/link";
import { Icon } from "@/components/landing/ui";
import DashFrame from "./DashFrame";

const TOOLS = [
  { id: "infographics", icon: "sliders", title: "Infographics", tone: "oklch(0.34 0.07 200)", href: "/dashboard/infographics", hot: true },
  { id: "editor", icon: "magic", title: "Photo Editor", tone: "oklch(0.32 0.08 25)", href: "/dashboard/editor" },
  { id: "interior", icon: "sofa", title: "Interior Design", tone: "oklch(0.33 0.06 130)", href: "/dashboard/interior" },
  { id: "mockups", icon: "box", title: "Mockups", tone: "oklch(0.32 0.07 300)", href: "/dashboard/mockups" },
  { id: "backgrounds", icon: "scissors", title: "Backgrounds", tone: "oklch(0.34 0.06 250)", href: "/dashboard/backgrounds" },
  { id: "patterns", icon: "palette", title: "Patterns", tone: "oklch(0.34 0.08 70)", href: "/dashboard/patterns", neu: true },
] as const;

const RECENT = [
  { l: "Bomber jacket", t: "Infographic · 2h", tone: "oklch(0.34 0.07 200)" },
  { l: "Linen sofa", t: "Interior · 5h", tone: "oklch(0.33 0.06 130)" },
  { l: "Coffee pouch", t: "Mockup · yest.", tone: "oklch(0.32 0.07 300)" },
  { l: "Sneaker X15", t: "Background · yest.", tone: "oklch(0.34 0.06 250)" },
  { l: "Folk scarf", t: "Pattern · 2d", tone: "oklch(0.34 0.08 70)" },
];

const ACTIVITY = [
  { who: "Generated 4 variants", what: "Infographics · Glass", ago: "2h", icon: "sliders", tone: "oklch(0.4 0.07 200)" },
  { who: "Exported to Uzum", what: "Bomber jacket · HD", ago: "2h", icon: "download", tone: "var(--acc)" },
  { who: "Staged in room", what: "Interior · Scandi", ago: "5h", icon: "sofa", tone: "oklch(0.4 0.06 130)" },
  { who: "Removed background", what: "Backgrounds · White", ago: "yest.", icon: "scissors", tone: "oklch(0.4 0.06 250)" },
];

const STATS = [
  { v: "238", l: "Total generations", sub: "+18 this week", acc: false },
  { v: "500", l: "Credits left", sub: "Pro plan", acc: true },
  { v: "96%", l: "Success rate", sub: "Above average", acc: false },
  { v: "54", l: "Saved & exported", sub: "This month", acc: false },
];

const BARS: [number, string][] = [[40, "M"], [62, "T"], [35, "W"], [78, "T"], [55, "F"], [88, "S"], [48, "S"]];

export default function DashHome() {
  return (
    <DashFrame active="dashboard" title="Dashboard">
      <div style={{ padding: 28, position: "relative" }}>
        <div className="ab-glow" style={{ width: 420, height: 320, background: "var(--acc)", top: -150, right: -100, opacity: 0.08 }} />
        {/* greeting + CTA */}
        <div className="ab-dash-home-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 26, position: "relative", flexWrap: "wrap" }}>
          <div>
            <div className="ab-eyebrow" style={{ marginBottom: 8 }}>Thu, May 1 · Tashkent</div>
            <div className="ab-h2" style={{ fontSize: 30 }}>Welcome back, Dilnoza</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {RECENT.map((g, i) => (
                <div key={i}>
                  <div style={{ aspectRatio: "3/4", borderRadius: 12, background: g.tone, border: "1px solid var(--border-mid)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 8px)" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginTop: 7, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.l}</div>
                  <div className="ab-mono" style={{ fontSize: 9.5, color: "var(--t-3)", marginTop: 1 }}>{g.t}</div>
                </div>
              ))}
            </div>
            {/* usage chart */}
            <div className="ab-card" style={{ padding: 20, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="ab-h4" style={{ fontSize: 15 }}>Generations this week</div>
                <div style={{ fontSize: 13, color: "var(--acc)", fontWeight: 600 }}>+18</div>
              </div>
              <div style={{ display: "flex", gap: 8, height: 90, alignItems: "flex-end" }}>
                {BARS.map(([h, d], i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: "100%", height: `${h}%`, borderRadius: 6, background: i === 5 ? "var(--acc)" : "var(--bg-3)" }} />
                    <span className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)" }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="ab-h4" style={{ fontSize: 17, marginBottom: 16 }}>Activity</div>
            <div className="ab-card" style={{ overflow: "hidden" }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 16px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: a.tone, color: a.tone === "var(--acc)" ? "var(--acc-ink)" : "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={a.icon} size={17} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{a.who}</div>
                    <div className="ab-body" style={{ fontSize: 12, marginTop: 1 }}>{a.what}</div>
                  </div>
                  <span className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)" }}>{a.ago}</span>
                </div>
              ))}
            </div>
            {/* upgrade nudge */}
            <div style={{ marginTop: 16, padding: 18, borderRadius: 16, background: "linear-gradient(160deg, var(--acc-soft), transparent)", border: "1px solid var(--acc-line)", position: "relative", overflow: "hidden" }}>
              <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", bottom: -50, right: -30, opacity: 0.25 }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700 }}><Icon name="crown" size={16} style={{ color: "var(--acc)" }} /> Going fast</div>
                <div className="ab-body" style={{ fontSize: 12.5, marginTop: 6 }}>You’ve used 60% of this month’s credits. Top up to keep the momentum.</div>
                <Link href="/dashboard/credits" className="ab-btn ab-btn-primary ab-btn-sm" style={{ marginTop: 12 }}>Buy credits</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
}
