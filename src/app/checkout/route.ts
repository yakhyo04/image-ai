import { NextResponse, type NextRequest } from "next/server";
import { polar } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";
import { planByKey, packByKey } from "@/lib/billing";

export const runtime = "nodejs";

// Starts a Polar checkout for the signed-in user.
//   /checkout?plan=pro        → subscription
//   /checkout?pack=medium     → one-time credit pack
//
// The checkout is bound to the user server-side via `externalCustomerId`, so
// the browser can never attach a purchase to someone else. The product (and
// therefore the price and credit amount) is resolved here from the catalog —
// the client only chooses a plan/pack key.
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const origin = req.nextUrl.origin;

  if (!user) {
    // Send them to log in, then back to whatever they were buying.
    const next = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(`${origin}/login?next=${next}`);
  }

  const planKey = req.nextUrl.searchParams.get("plan");
  const packKey = req.nextUrl.searchParams.get("pack");

  const product = planKey ? planByKey(planKey) : packKey ? packByKey(packKey) : undefined;

  if (!product || !product.productId) {
    return NextResponse.redirect(`${origin}/dashboard/credits?status=error&reason=unknown_product`);
  }

  try {
    const checkout = await polar.checkouts.create({
      products: [product.productId],
      externalCustomerId: user.id,
      customerEmail: user.email ?? undefined,
      successUrl: `${origin}/dashboard/credits?status=success`,
      metadata: {
        userId: user.id,
        kind: planKey ? "subscription" : "pack",
        key: product.key,
      },
    });

    return NextResponse.redirect(checkout.url);
  } catch (err) {
    console.error("[/checkout] failed to create Polar checkout:", err);
    return NextResponse.redirect(`${origin}/dashboard/credits?status=error&reason=checkout_failed`);
  }
}
