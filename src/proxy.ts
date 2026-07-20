import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

function isProtected(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

// Next 16 renamed `middleware` → `proxy`. Runs before render to refresh the
// Supabase session and gate routes.
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Gate the app: send signed-out users to login.
  if (!user && isProtected(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Keep signed-in users out of the auth pages.
  if (user && AUTH_PAGES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Only run where an auth decision is actually made: the gated app and the
  // auth pages (to bounce signed-in users away). Public pages — the landing,
  // /tools/*, API routes — no longer pay a Supabase getUser() round-trip on
  // every request.
  matcher: ["/dashboard/:path*", "/login", "/signup", "/forgot-password"],
};
