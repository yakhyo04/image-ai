import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  userId?: string;
  amount?: number;
  note?: string;
};

// Admin-only manual credit adjustment. Positive amount tops up, negative
// deducts. Used for off-Polar purchases (e.g. bank/card transfers) and manual
// corrections. Records a credit_transactions row via grant_credits().
export async function POST(req: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const userId = body.userId?.trim();
  const amount = Math.trunc(Number(body.amount));
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount === 0) {
    return NextResponse.json(
      { error: "amount must be a non-zero integer" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("grant_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_kind: "admin",
    p_source: "admin_manual",
    p_polar_order_id: null,
    p_description:
      body.note?.trim() ||
      `Manual ${amount > 0 ? "top-up" : "adjustment"} by ${admin.email}`,
  });

  if (error) {
    const notFound = (error.message ?? "").includes("PROFILE_NOT_FOUND");
    return NextResponse.json(
      { error: notFound ? "User not found" : error.message || "Grant failed" },
      { status: notFound ? 404 : 500 },
    );
  }

  return NextResponse.json({ balance: Number(data) });
}
