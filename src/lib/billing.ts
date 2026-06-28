// Single source of truth for what we sell through Polar.
//
// Product IDs come from env so the same code runs against sandbox and
// production. The `credits` here are used for *display only*; the amount
// actually granted is read from each Polar product's `credits` metadata
// inside the webhook, so the client can never inflate a purchase.

export type PlanKey = "starter" | "pro" | "business";
export type PackKey = "small" | "medium" | "large";

export type Plan = {
  key: PlanKey;
  name: string;
  productId?: string; // undefined for the free Starter plan
  price: number; // USD / month
  credits: number; // monthly allowance (display)
  blurb: string;
};

export type Pack = {
  key: PackKey;
  productId?: string;
  price: number; // USD, one-time
  credits: number;
  blurb: string;
  best?: boolean;
};

export const PLANS: Plan[] = [
  { key: "starter", name: "Starter", price: 0, credits: 30, blurb: "Free forever" },
  {
    key: "pro",
    name: "Pro",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO,
    price: 24,
    credits: 500,
    blurb: "For active sellers",
  },
  {
    key: "business",
    name: "Business",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_BUSINESS,
    price: 79,
    credits: 2000,
    blurb: "For teams",
  },
];

export const PACKS: Pack[] = [
  {
    key: "small",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PACK_SMALL,
    price: 6,
    credits: 100,
    blurb: "Quick top-up",
  },
  {
    key: "medium",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PACK_MEDIUM,
    price: 24,
    credits: 500,
    blurb: "Best value",
    best: true,
  },
  {
    key: "large",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PACK_LARGE,
    price: 79,
    credits: 2000,
    blurb: "Stock up",
  },
];

export function planByKey(key: string): Plan | undefined {
  return PLANS.find((p) => p.key === key);
}

export function packByKey(key: string): Pack | undefined {
  return PACKS.find((p) => p.key === key);
}

// Map a Polar product id back to the plan it represents, so a subscription
// webhook can label the profile with the right plan.
export function planByProductId(productId: string | null | undefined): Plan | undefined {
  if (!productId) return undefined;
  return PLANS.find((p) => p.productId && p.productId === productId);
}

// Fallback credit amounts keyed by product id, used only if a Polar product
// is missing its `credits` metadata. Kept in sync with the catalog above.
export function fallbackCreditsForProduct(productId: string | null | undefined): number | undefined {
  if (!productId) return undefined;
  const all = [...PLANS, ...PACKS];
  return all.find((x) => "productId" in x && x.productId === productId)?.credits;
}
