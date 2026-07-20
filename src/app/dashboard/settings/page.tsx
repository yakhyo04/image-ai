import type { Metadata } from "next";
import Profile from "@/components/dashboard/settings/Profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings · Profile — Artboard" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, store_name, email, avatar_url")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <Profile
      fullName={profile?.full_name ?? ""}
      storeName={profile?.store_name ?? ""}
      email={profile?.email ?? user?.email ?? ""}
      avatarUrl={profile?.avatar_url ?? null}
    />
  );
}
