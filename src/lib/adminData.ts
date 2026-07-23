import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  storeName: string | null;
  credits: number;
  createdAt: string;
  generationCount: number;
};

export type AdminGeneration = {
  id: string;
  userId: string;
  userEmail: string | null;
  tool: string | null;
  url: string;
  mimeType: string | null;
  createdAt: string;
};

export type AdminOverview = {
  stats: {
    totalUsers: number;
    totalGenerations: number;
    totalCredits: number;
  };
  users: AdminUser[];
  recent: AdminGeneration[];
};

const SIGNED_URL_TTL = 60 * 60; // 1 hour
const RECENT_FEED = 48; // how many recent generations to show (with thumbnails)
const COUNT_SCAN = 5000; // cap for per-user count aggregation

// Loads the full admin overview using the service-role client (bypasses RLS).
// Callers MUST gate on requireAdmin() before invoking this.
export async function getAdminOverview(): Promise<AdminOverview> {
  const supabase = createAdminClient();

  // All users.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, store_name, credits, created_at")
    .order("created_at", { ascending: false });

  const emailById = new Map<string, string | null>(
    (profiles ?? []).map((p) => [p.id, p.email]),
  );

  // Exact total generation count (cheap head query).
  const { count: totalGenerations } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true });

  // Recent generations for the feed + per-user counts. One scan, newest-first.
  const { data: genRows } = await supabase
    .from("generations")
    .select("id, user_id, tool, storage_path, mime_type, created_at")
    .order("created_at", { ascending: false })
    .limit(COUNT_SCAN);

  const countByUser = new Map<string, number>();
  for (const g of genRows ?? []) {
    countByUser.set(g.user_id, (countByUser.get(g.user_id) ?? 0) + 1);
  }

  // Sign thumbnails for just the newest slice.
  const feed = (genRows ?? []).slice(0, RECENT_FEED);
  const { data: signed } = await supabase.storage
    .from("generations")
    .createSignedUrls(
      feed.map((g) => g.storage_path),
      SIGNED_URL_TTL,
    );
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  const users: AdminUser[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    fullName: p.full_name,
    storeName: p.store_name,
    credits: p.credits ?? 0,
    createdAt: p.created_at,
    generationCount: countByUser.get(p.id) ?? 0,
  }));

  const recent: AdminGeneration[] = feed
    .map((g) => ({
      id: g.id,
      userId: g.user_id,
      userEmail: emailById.get(g.user_id) ?? null,
      tool: g.tool,
      url: urlByPath.get(g.storage_path) ?? "",
      mimeType: g.mime_type,
      createdAt: g.created_at,
    }))
    .filter((g) => g.url);

  return {
    stats: {
      totalUsers: profiles?.length ?? 0,
      totalGenerations: totalGenerations ?? 0,
      totalCredits: (profiles ?? []).reduce((s, p) => s + (p.credits ?? 0), 0),
    },
    users,
    recent,
  };
}
