import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

// Refreshes the Supabase auth session on every matched request and returns
// the response (with refreshed auth cookies) plus the current user, so the
// proxy can make redirect decisions. Adapted from the Supabase SSR guide for
// Next 16's `proxy.ts` convention.
export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: User | null }> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: getUser() validates the token with the Supabase Auth server and
  // must be called to keep the session fresh. Do not run code between creating
  // the client and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
