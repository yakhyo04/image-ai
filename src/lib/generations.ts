import { createClient } from "@/lib/supabase/server";

export type GalleryItem = {
  id: string;
  url: string;
  tool: string | null;
  createdAt: string;
};

const SIGNED_URL_TTL = 60 * 60; // 1 hour

// Fetches the signed-in user's saved generations, newest first, with signed
// URLs for the private Storage objects. Returns [] when signed out.
export async function listGenerations(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: rows, error } = await supabase
    .from("generations")
    .select("id, tool, storage_path, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error || !rows?.length) return [];

  const { data: signed } = await supabase.storage
    .from("generations")
    .createSignedUrls(
      rows.map((r) => r.storage_path),
      SIGNED_URL_TTL,
    );

  const urlByPath = new Map(
    (signed ?? []).map((s) => [s.path, s.signedUrl]),
  );

  return rows
    .map((r) => ({
      id: r.id,
      url: urlByPath.get(r.storage_path) ?? "",
      tool: r.tool,
      createdAt: r.created_at,
    }))
    .filter((it) => it.url);
}
