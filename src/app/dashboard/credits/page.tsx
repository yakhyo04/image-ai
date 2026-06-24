import type { Metadata } from "next";
import DashCredits from "@/components/dashboard/DashCredits";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Credits & Billing — Artboard" };
export const dynamic = "force-dynamic";

export default async function CreditsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: gens }] = await Promise.all([
    supabase.from("profiles").select("credits, created_at").eq("id", user?.id ?? "").single(),
    supabase
      .from("generations")
      .select("tool, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <DashCredits
      credits={profile?.credits ?? 0}
      joinedAt={profile?.created_at ?? null}
      gens={(gens ?? []).map((g) => ({ tool: g.tool, createdAt: g.created_at }))}
    />
  );
}
