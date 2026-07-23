import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

// Admins are identified by an email allowlist in the environment, e.g.
//   ADMIN_EMAILS=you@example.com,ops@example.com
// No schema change needed; flip access by editing the env var.
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

// Returns the current user if they're an admin, otherwise null. Use in API
// route handlers where you want to return a 403 rather than redirect.
export async function getAdminUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user && isAdminEmail(user.email) ? user : null;
}

// Server-side guard for admin pages: returns the admin user or redirects
// non-admins to the homepage (so the panel's existence isn't revealed).
export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();
  if (!user) redirect("/");
  return user;
}
