import type { Metadata } from "next";
import DashHome from "@/components/dashboard/DashHome";
import { createClient } from "@/lib/supabase/server";
import { listGenerations } from "@/lib/generations";

export const metadata: Metadata = { title: "Dashboard — Artboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, items, { data: events }] = await Promise.all([
    supabase.from("profiles").select("full_name, credits").eq("id", user?.id ?? "").single(),
    listGenerations(),
    supabase.from("generation_events").select("status"),
  ]);

  const total = events?.length ?? 0;
  const successes = events?.filter((e) => e.status === "success").length ?? 0;
  const successRate = total > 0 ? Math.round((successes / total) * 100) : null;

  return (
    <DashHome
      name={profile?.full_name ?? user?.email?.split("@")[0] ?? ""}
      credits={profile?.credits ?? 0}
      items={items}
      successRate={successRate}
    />
  );
}
