"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; message?: string };

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const full_name = String(formData.get("full_name") ?? "").trim();
  const store_name = String(formData.get("store_name") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, store_name })
    .eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/", "layout");
  return { message: "Profile saved." };
}
