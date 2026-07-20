import { NextResponse, type NextRequest } from "next/server";
import { CustomerPortal } from "@polar-sh/nextjs";
import { POLAR_SERVER } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Opens the Polar customer portal so users can manage / cancel their
// subscription and see invoices. We identify the customer by the same
// external id (the Supabase user id) used when creating the checkout.
const handler = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: POLAR_SERVER,
  getExternalCustomerId: async (req) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("not_authenticated");
    return user.id;
  },
});

export async function GET(req: NextRequest) {
  try {
    return await handler(req);
  } catch (err) {
    // Most likely an unauthenticated user, or no Polar customer yet.
    console.error("[/portal] customer portal error:", err);
    const next = encodeURIComponent("/portal");
    return NextResponse.redirect(`${req.nextUrl.origin}/login?next=${next}`);
  }
}
