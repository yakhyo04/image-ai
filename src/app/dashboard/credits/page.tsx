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

  const [{ data: profile }, { data: txns }] = await Promise.all([
    supabase
      .from("profiles")
      .select("credits, created_at, plan, subscription_status, current_period_end")
      .eq("id", user?.id ?? "")
      .single(),
    supabase
      .from("credit_transactions")
      .select("amount, kind, source, description, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <DashCredits
      credits={profile?.credits ?? 0}
      joinedAt={profile?.created_at ?? null}
      plan={profile?.plan ?? "starter"}
      subscriptionStatus={profile?.subscription_status ?? null}
      periodEnd={profile?.current_period_end ?? null}
      txns={(txns ?? []).map((t) => ({
        amount: t.amount,
        kind: t.kind,
        source: t.source,
        description: t.description,
        createdAt: t.created_at,
      }))}
    />
  );
}
