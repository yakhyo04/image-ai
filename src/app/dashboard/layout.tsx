"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, ArtboardMark } from "@/components/landing/ui";
import { createClient } from "@/lib/supabase/client";
import { logoutAction } from "@/app/actions/auth";
import { useCredits } from "@/store/credits";

function initials(name: string, email: string): string {
  const src = name.trim() || email.split("@")[0] || "";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (src.slice(0, 2) || "AB").toUpperCase();
}

type SidebarItem = { id: string; icon: string; label: string; href: string; badge?: string };

const TOOLS: SidebarItem[] = [
  { id: "dashboard", icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "infographics", icon: "sliders", label: "Marketplace Infographics", href: "/dashboard/infographics" },
  { id: "editor", icon: "magic", label: "Photo Editor", href: "/dashboard/editor" },
  { id: "video", icon: "play", label: "Product Video", href: "/dashboard/video", badge: "NEW" },
  { id: "interior", icon: "sofa", label: "Interior Design", href: "/dashboard/interior" },
  { id: "mockups", icon: "box", label: "Product Mockups", href: "/dashboard/mockups" },
  { id: "backgrounds", icon: "scissors", label: "Backgrounds", href: "/dashboard/backgrounds" },
  { id: "patterns", icon: "palette", label: "Pattern Design", href: "/dashboard/patterns" },
];
const LIB: SidebarItem[] = [
  { id: "gallery", icon: "gallery", label: "Gallery / History", href: "/dashboard/gallery" },
  { id: "credits", icon: "gem", label: "Credits", href: "/dashboard/credits", badge: "500" },
  { id: "settings", icon: "settings", label: "Settings", href: "/dashboard/settings" },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/infographics": "Marketplace Infographics",
  "/dashboard/editor": "Photo Editor",
  "/dashboard/video": "Product Video",
  "/dashboard/interior": "Interior Design",
  "/dashboard/mockups": "Product Mockups",
  "/dashboard/backgrounds": "Background Replacement",
  "/dashboard/patterns": "Pattern Design",
  "/dashboard/gallery": "Gallery / History",
  "/dashboard/credits": "Credits & Billing",
  "/dashboard/progress": "Generating…",
};

function activeFor(p: string): string {
  if (p.startsWith("/dashboard/settings")) return "settings";
  if (p.startsWith("/dashboard/gallery")) return "gallery";
  if (p.startsWith("/dashboard/credits")) return "credits";
  if (p.startsWith("/dashboard/infographics") || p.startsWith("/dashboard/progress")) return "infographics";
  if (p.startsWith("/dashboard/editor")) return "editor";
  if (p.startsWith("/dashboard/video")) return "video";
  if (p.startsWith("/dashboard/interior")) return "interior";
  if (p.startsWith("/dashboard/mockups")) return "mockups";
  if (p.startsWith("/dashboard/backgrounds")) return "backgrounds";
  if (p.startsWith("/dashboard/patterns")) return "patterns";
  return "dashboard";
}
function titleFor(p: string): string {
  if (p.startsWith("/dashboard/settings")) return "Settings";
  return TITLES[p] ?? "Dashboard";
}

function Row({ t, active, collapsed }: { t: SidebarItem; active: string; collapsed: boolean }) {
  const on = t.id === active;
  return (
    <Link
      href={t.href}
      title={t.label}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "11px 0" : "10px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 11, cursor: "pointer", position: "relative", textDecoration: "none",
        background: on ? "var(--bg-2)" : "transparent", border: on ? "1px solid var(--border)" : "1px solid transparent",
        color: on ? "var(--t-1)" : "var(--t-3)",
      }}
    >
      {on && <div style={{ position: "absolute", left: collapsed ? 4 : -13, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 3, background: "var(--acc)" }} />}
      <span style={{ color: on ? "var(--acc)" : "var(--t-3)", display: "flex", flexShrink: 0 }}><Icon name={t.icon} size={20} stroke={on ? 2 : 1.8} /></span>
      {!collapsed && <span style={{ flex: 1, fontSize: 13.5, fontWeight: on ? 600 : 500, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</span>}
      {!collapsed && t.badge && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "var(--acc)", background: "var(--acc-soft)", padding: "2px 7px", borderRadius: 100 }}>{t.badge}</span>}
    </Link>
  );
}

function Sidebar({ active, collapsed, credits }: { active: string; collapsed: boolean; credits: number | null }) {
  const lib = LIB.map((t) => (t.id === "credits" && credits !== null ? { ...t, badge: String(credits) } : t));
  return (
    <div className="ab-dash-sidebar" style={{ width: collapsed ? 72 : 248, flexShrink: 0, height: "100%", background: "var(--bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: collapsed ? "20px 12px" : "20px 16px", transition: "width .2s ease", overflow: "hidden" }}>
      <Link href="/" style={{ flexShrink: 0, padding: collapsed ? "0" : "0 6px", display: "flex", justifyContent: collapsed ? "center" : "flex-start", marginBottom: 22, textDecoration: "none", color: "inherit" }}>
        <ArtboardMark size={22} mono={collapsed} />
      </Link>
      <Link href="/dashboard/infographics" className="ab-btn ab-btn-primary ab-btn-full" style={{ flexShrink: 0, padding: collapsed ? "12px 0" : "12px 16px", borderRadius: 12, marginBottom: 18 }}>
        <Icon name="plus" size={17} stroke={2.4} />{!collapsed && <span>New generation</span>}
      </Link>

      <div className="ab-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", margin: collapsed ? "0 -12px" : "0 -16px", padding: collapsed ? "4px 12px" : "4px 16px" }}>
        {!collapsed && <div className="ab-eyebrow" style={{ padding: "0 8px 10px", fontSize: 10 }}>Tools</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>{TOOLS.map((t) => <Row key={t.id} t={t} active={active} collapsed={collapsed} />)}</div>
        <div style={{ height: 1, background: "var(--border)", margin: "16px 6px" }} />
        {!collapsed && <div className="ab-eyebrow" style={{ padding: "0 8px 10px", fontSize: 10 }}>Library</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>{lib.map((t) => <Row key={t.id} t={t} active={active} collapsed={collapsed} />)}</div>
      </div>

      {!collapsed ? (
        <div style={{ flexShrink: 0, marginTop: 16, borderRadius: 16, padding: 16, background: "linear-gradient(160deg, var(--acc-soft), transparent)", border: "1px solid var(--acc-line)", position: "relative", overflow: "hidden" }}>
          <div className="ab-glow" style={{ width: 120, height: 120, background: "var(--acc)", bottom: -50, right: -30, opacity: 0.25 }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700 }}><Icon name="crown" size={15} stroke={2} style={{ color: "var(--acc)" }} /> Free plan</div>
            <div className="ab-body" style={{ fontSize: 11.5, marginTop: 6 }}>{credits ?? "—"} credits left.</div>
            <Link href="/dashboard/credits" className="ab-btn ab-btn-primary ab-btn-full ab-btn-sm" style={{ marginTop: 12 }}>Manage plan</Link>
          </div>
        </div>
      ) : (
        <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", margin: "16px auto 0" }}><Icon name="crown" size={18} /></div>
      )}
    </div>
  );
}

type DashUser = { name: string; email: string; avatar: string | null };

function Topbar({ title, onToggle, credits, user }: { title: string; onToggle: () => void; credits: number | null; user: DashUser | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const ini = user ? initials(user.name, user.email) : "··";

  return (
    <div className="ab-dash-topbar" style={{ height: 64, flexShrink: 0, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, padding: "0 24px", background: "var(--bg)" }}>
      <button onClick={onToggle} aria-label="Toggle sidebar" className="ab-dash-menu" style={{ width: 36, height: 36, borderRadius: 10, background: "transparent", border: "1px solid var(--border)", color: "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="menu" size={18} /></button>
      <span className="ab-dash-mobile-brand" style={{ display: "none" }}><ArtboardMark size={20} mono /></span>
      <div className="ab-dash-title" style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", minWidth: 0 }}>{title}</div>
      <div className="ab-dash-spacer" style={{ flex: 1 }} />
      <Link href="/dashboard/credits" title="Credits & billing" style={{ display: "flex", alignItems: "center", gap: 7, height: 40, padding: "0 14px", borderRadius: 11, background: "var(--acc-soft)", border: "1px solid var(--acc-line)", color: "var(--acc)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}><Icon name="bolt" size={15} /> {credits ?? "—"}</Link>
      <button aria-label="Notifications" className="ab-dash-bell" style={{ width: 40, height: 40, borderRadius: 11, background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--t-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
        <Icon name="bell" size={18} />
        <span style={{ position: "absolute", top: 9, right: 10, width: 6, height: 6, borderRadius: "50%", background: "var(--acc)", border: "1.5px solid var(--bg-1)" }} />
      </button>
      <div style={{ position: "relative" }}>
        <button onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu" className="ab-dash-avatar" style={{ width: 38, height: 38, borderRadius: 11, overflow: "hidden", padding: 0, background: "var(--v-blue)", color: "oklch(1 0 0 / 0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, border: "1px solid var(--border-mid)", cursor: "pointer" }}>
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            ini
          )}
        </button>
        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
            <div style={{ position: "absolute", top: 46, right: 0, width: 220, zIndex: 41, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 14, boxShadow: "var(--sh-2)", padding: 8 }}>
              <div style={{ padding: "8px 10px 10px" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--t-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Account"}</div>
                <div className="ab-body" style={{ fontSize: 12, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
              </div>
              <div style={{ height: 1, background: "var(--border)", margin: "2px 4px 6px" }} />
              <Link href="/dashboard/settings" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, textDecoration: "none", color: "var(--t-2)", fontSize: 13.5 }}><Icon name="settings" size={16} /> Settings</Link>
              <form action={logoutAction}>
                <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, background: "transparent", border: "none", color: "var(--err)", fontSize: 13.5, fontFamily: "var(--font)", cursor: "pointer", textAlign: "left" }}><Icon name="shield" size={16} /> Log out</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const MOBILE_TABS = [
  { id: "home", icon: "home", label: "Home", href: "/dashboard" },
  { id: "create", icon: "sparkle-fill", label: "Create", href: "/dashboard/infographics" },
  { id: "gallery", icon: "gallery", label: "Gallery", href: "/dashboard/gallery" },
  { id: "profile", icon: "user", label: "Profile", href: "/dashboard/settings" },
];

function mobileTabFor(active: string): string {
  if (active === "dashboard") return "home";
  if (active === "gallery") return "gallery";
  if (active === "settings" || active === "credits") return "profile";
  return "create"; // any tool
}

function MobileTabBar({ active }: { active: string }) {
  const current = mobileTabFor(active);
  return (
    <div className="ab-mobile-tabbar" style={{ flexShrink: 0, padding: "8px 14px calc(16px + env(safe-area-inset-bottom))", background: "linear-gradient(to top, var(--bg) 72%, transparent)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: 7, borderRadius: 24, background: "var(--bg-glass)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--border-mid)", boxShadow: "0 16px 40px -12px oklch(0 0 0 / 0.5)" }}>
        {MOBILE_TABS.map((tb) => {
          const on = tb.id === current;
          return (
            <Link key={tb.id} href={tb.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0 6px", borderRadius: 18, cursor: "pointer", textDecoration: "none", background: on ? "var(--bg-2)" : "transparent" }}>
              <span style={{ color: on ? "var(--acc)" : "var(--t-3)", display: "flex" }}><Icon name={tb.icon} size={21} stroke={on ? 2 : 1.8} /></span>
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500, color: on ? "var(--t-1)" : "var(--t-3)" }}>{tb.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const credits = useCredits((s) => s.credits);
  const setCredits = useCredits((s) => s.setCredits);
  const [user, setUser] = useState<DashUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Restore collapse preference on first mount (persists across reloads).
  useEffect(() => {
    try {
      if (localStorage.getItem("dash-collapsed") === "1") setCollapsed(true);
    } catch {}
  }, []);

  // Resolve the signed-in user ONCE. getUser() validates the token against the
  // Supabase Auth server (a network round-trip), so we never want it on every
  // navigation — identity doesn't change between pages.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const meta = (u.user_metadata ?? {}) as Record<string, string>;
      setUser({ name: meta.full_name ?? meta.name ?? "", email: u.email ?? "", avatar: meta.avatar_url ?? null });
      setUserId(u.id);
    });
  }, []);

  // Refresh the credit badge on navigation using the cached user id — a cheap
  // profiles read, with no getUser() round-trip.
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single()
      .then(({ data: profile }) => {
        if (profile) setCredits(profile.credits);
      });
  }, [userId, pathname]);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem("dash-collapsed", next ? "1" : "0"); } catch {}
      return next;
    });
  }

  return (
    <div style={{ display: "flex", height: "100dvh", width: "100%", background: "var(--bg)", color: "var(--t-1)", overflow: "hidden", fontFamily: "var(--font)" }}>
      <Sidebar active={activeFor(pathname)} collapsed={collapsed} credits={credits} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg)" }}>
        <Topbar title={titleFor(pathname)} onToggle={toggle} credits={credits} user={user} />
        <div className="ab-scroll" style={{ flex: 1 }}>{children}</div>
        <MobileTabBar active={activeFor(pathname)} />
      </div>
    </div>
  );
}
