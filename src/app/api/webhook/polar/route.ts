import { Webhooks } from "@polar-sh/nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { planByProductId, fallbackCreditsForProduct } from "@/lib/billing";

export const runtime = "nodejs";

// Resolve how many credits a product grants. The Polar product's `credits`
// metadata is authoritative; we fall back to the local catalog only if it's
// missing so a misconfigured product never silently grants zero.
function creditsForProduct(
  metadata: Record<string, unknown> | undefined,
  productId: string | null | undefined,
): number {
  const raw = metadata?.credits;
  const fromMeta = typeof raw === "string" ? parseInt(raw, 10) : typeof raw === "number" ? raw : NaN;
  if (Number.isFinite(fromMeta) && fromMeta > 0) return fromMeta;
  return fallbackCreditsForProduct(productId) ?? 0;
}

// Record an event id once. Returns false if we've already processed it
// (Polar retries deliveries), so callers can skip duplicate work.
async function claimEvent(
  admin: SupabaseClient,
  eventId: string,
  type: string,
): Promise<boolean> {
  const { error } = await admin
    .from("processed_webhook_events")
    .insert({ event_id: eventId, type });
  if (error) {
    // Unique-violation → already processed. Anything else is a real failure.
    if (error.code === "23505") return false;
    throw error;
  }
  return true;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  // Credits are granted here, on payment. This fires for one-time pack
  // purchases AND for every subscription renewal cycle, which gives us the
  // "add the allowance each cycle" behavior automatically.
  onOrderPaid: async (payload) => {
    const order = payload.data;
    const userId = order.customer?.externalId;
    if (!userId) {
      console.warn("[polar webhook] order.paid with no external customer id; skipping", order.id);
      return;
    }

    const admin = createAdminClient();
    const fresh = await claimEvent(admin, `order.paid:${order.id}`, "order.paid");
    if (!fresh) return;

    const credits = creditsForProduct(order.product?.metadata, order.productId);
    if (credits <= 0) {
      console.warn("[polar webhook] order.paid resolved 0 credits", order.id, order.productId);
      return;
    }

    const isSubscription = !!order.subscriptionId;
    const { error } = await admin.rpc("grant_credits", {
      p_user_id: userId,
      p_amount: credits,
      p_kind: "purchase",
      p_source: isSubscription ? "subscription" : "polar_order",
      p_polar_order_id: order.id,
      p_description: order.product?.name ?? null,
    });
    if (error) {
      console.error("[polar webhook] grant_credits failed", order.id, error);
      throw error; // let Polar retry
    }
  },

  // Subscription lifecycle → keep the profile's plan state in sync.
  // (Credits for subscriptions come from onOrderPaid, not here.)
  onSubscriptionActive: async (payload) => {
    await syncSubscription(payload.data);
  },
  onSubscriptionCreated: async (payload) => {
    await syncSubscription(payload.data);
  },
  onSubscriptionUpdated: async (payload) => {
    await syncSubscription(payload.data);
  },

  // Canceled = will not renew, but still active until period end.
  onSubscriptionCanceled: async (payload) => {
    const sub = payload.data;
    const userId = sub.customer?.externalId;
    if (!userId) return;
    const admin = createAdminClient();
    await admin
      .from("profiles")
      .update({ subscription_status: "canceled" })
      .eq("id", userId);
  },

  // Revoked = access ended → drop back to the free plan.
  onSubscriptionRevoked: async (payload) => {
    const sub = payload.data;
    const userId = sub.customer?.externalId;
    if (!userId) return;
    const admin = createAdminClient();
    await admin
      .from("profiles")
      .update({ plan: "starter", subscription_status: "revoked", subscription_id: null })
      .eq("id", userId);
  },
});

type SubscriptionLike = {
  id: string;
  status: string;
  productId: string;
  currentPeriodEnd: Date | null;
  customer?: { externalId?: string | null } | null;
};

async function syncSubscription(sub: SubscriptionLike) {
  const userId = sub.customer?.externalId;
  if (!userId) return;
  const plan = planByProductId(sub.productId);
  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({
      plan: plan?.key ?? null,
      subscription_id: sub.id,
      subscription_status: sub.status,
      current_period_end: sub.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).toISOString()
        : null,
    })
    .eq("id", userId);
}
