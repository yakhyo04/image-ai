import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

function isProtected(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/dashboard");
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
  matcher: [
    // Run on everything except Next internals, the OAuth callback, and static assets.
    "/((?!_next/static|_next/image|auth/callback|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
