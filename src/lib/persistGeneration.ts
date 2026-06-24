import { createClient } from "@/lib/supabase/server";

type PersistArgs = {
  imageBase64: string;
  mimeType?: string;
  tool?: string;
  prompt?: string;
};

function extFor(mime?: string): string {
  if (!mime) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
}

// Uploads a generated image to the user's Storage folder and records a row in
// `generations`. Best-effort: failures are logged but never thrown, so a
// storage hiccup can't break the generation response the user is waiting on.
// Returns the requesting user id, or null if unauthenticated.
export async function persistGeneration(args: PersistArgs): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const mime = args.mimeType ?? "image/png";
    const path = `${user.id}/${crypto.randomUUID()}.${extFor(mime)}`;
    const bytes = Buffer.from(args.imageBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("generations")
      .upload(path, bytes, { contentType: mime, upsert: false });
    if (uploadError) {
      console.error("[persistGeneration] upload failed:", uploadError.message);
      return user.id;
    }

    const { error: insertError } = await supabase.from("generations").insert({
      user_id: user.id,
      tool: args.tool ?? null,
      prompt: args.prompt ?? null,
      storage_path: path,
      mime_type: mime,
    });
    if (insertError) {
      console.error("[persistGeneration] insert failed:", insertError.message);
    }

    return user.id;
  } catch (err) {
    console.error("[persistGeneration] unexpected error:", err);
    return null;
  }
}
