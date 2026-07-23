"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/landing/ui";
import { thumbSrc } from "@/lib/img";
import type { AdminOverview, AdminUser } from "@/lib/adminData";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function TopUpCell({ user, onDone }: { user: AdminUser; onDone: (id: string, balance: number) => void }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    const n = Math.trunc(Number(amount));
    if (!Number.isFinite(n) || n === 0) {
      setErr("Enter a non-zero number");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, amount: n }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      onDone(user.id, data.balance);
      setAmount("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="± credits"
          disabled={busy}
          style={{
            width: 92, padding: "7px 9px", borderRadius: 8, background: "var(--bg-2)",
            border: "1px solid var(--border)", color: "var(--t-1)", fontSize: 13,
            fontFamily: "var(--font)", textAlign: "right",
          }}
        />
        <button
          onClick={submit}
          disabled={busy}
          className="ab-btn ab-btn-primary ab-btn-sm"
          style={{ padding: "7px 12px", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "…" : <Icon name="plus" size={15} stroke={2.4} />}
        </button>
      </div>
      {err && <span style={{ fontSize: 11, color: "oklch(0.7 0.18 20)" }}>{err}</span>}
    </div>
  );
}

export default function AdminView({ overview, adminEmail }: { overview: AdminOverview; adminEmail: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Local credit overrides so a top-up reflects instantly without a full reload.
  const [creditOverride, setCreditOverride] = useState<Record<string, number>>({});

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = overview.users.map((u) => ({
      ...u,
      credits: creditOverride[u.id] ?? u.credits,
    }));
    if (!q) return list;
    return list.filter(
      (u) =>
        (u.email ?? "").toLowerCase().includes(q) ||
        (u.fullName ?? "").toLowerCase().includes(q) ||
        (u.storeName ?? "").toLowerCase().includes(q),
    );
  }, [overview.users, query, creditOverride]);

  function handleTopUp(id: string, balance: number) {
    setCreditOverride((m) => ({ ...m, [id]: balance }));
    // Refresh server data in the background so transaction history stays current.
    router.refresh();
  }

  const stats: [string, string | number, string][] = [
    ["Total users", overview.stats.totalUsers, "grid"],
    ["Total generations", overview.stats.totalGenerations, "gallery"],
    ["Credits in circulation", overview.stats.totalCredits.toLocaleString(), "gem"],
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", color: "var(--t-1)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--acc-soft)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="crown" size={18} />
              </span>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Admin</h1>
            </div>
            <p className="ab-mono" style={{ fontSize: 12, color: "var(--t-3)", marginTop: 6 }}>{adminEmail}</p>
          </div>
          <Link href="/dashboard" className="ab-btn ab-btn-outline ab-btn-sm">
            <Icon name="dashboard" size={15} /> Dashboard
          </Link>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
          {stats.map(([label, value, icon]) => (
            <div key={label} className="ab-card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg-2)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={icon} size={20} />
              </span>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                <div className="ab-mono" style={{ fontSize: 11, color: "var(--t-3)", marginTop: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* users */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Users <span style={{ color: "var(--t-3)", fontWeight: 500 }}>({users.length})</span></h2>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--t-3)", display: "flex" }}><Icon name="eye" size={15} /></span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search email, name, store…"
                style={{ width: 260, maxWidth: "60vw", padding: "9px 12px 9px 34px", borderRadius: 10, background: "var(--bg-1)", border: "1px solid var(--border)", color: "var(--t-1)", fontSize: 13, fontFamily: "var(--font)" }}
              />
            </div>
          </div>

          <div className="ab-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: "left", background: "var(--bg-1)" }}>
                    {["User", "Store", "Joined", "Gens", "Credits", "Top up / adjust"].map((h, i) => (
                      <th key={h} className="ab-mono" style={{ padding: "12px 16px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--t-3)", fontWeight: 600, textAlign: i >= 3 ? "right" : "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{u.fullName || "—"}</div>
                        <div className="ab-mono" style={{ fontSize: 11, color: "var(--t-3)", marginTop: 2 }}>{u.email || u.id.slice(0, 8)}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--t-2)" }}>{u.storeName || "—"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--t-2)", whiteSpace: "nowrap" }}>{fmtDate(u.createdAt)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "right" }}>{u.generationCount}</td>
                      <td style={{ padding: "12px 16px", fontSize: 15, fontWeight: 700, textAlign: "right", color: "var(--acc)", whiteSpace: "nowrap" }}>{u.credits.toLocaleString()}</td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <TopUpCell user={u} onDone={handleTopUp} />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: "28px 16px", textAlign: "center", color: "var(--t-3)", fontSize: 13 }}>No users match “{query}”.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* recent generations */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 14px" }}>Recent generations</h2>
          {overview.recent.length === 0 ? (
            <div className="ab-card" style={{ padding: 28, textAlign: "center", color: "var(--t-3)", fontSize: 13 }}>No generations yet.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
              {overview.recent.map((g) => (
                <div key={g.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-mid)", background: "var(--bg-1)", position: "relative" }}>
                  <div style={{ aspectRatio: "3 / 4", position: "relative", background: "var(--bg-2)" }}>
                    {g.mimeType?.startsWith("video") ? (
                      <video src={g.url} muted loop playsInline preload="metadata" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbSrc(g.url)} alt={g.tool ?? "Generation"} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <div className="ab-mono" style={{ fontSize: 10, color: "var(--t-3)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{g.tool || "image"}</div>
                    <div style={{ fontSize: 11, color: "var(--t-2)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={g.userEmail ?? g.userId}>{g.userEmail ?? g.userId.slice(0, 8)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
