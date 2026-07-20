import type { Metadata } from "next";
import GalleryView from "@/components/dashboard/GalleryView";
import { listGenerations } from "@/lib/generations";

export const metadata: Metadata = { title: "Gallery — Artboard" };

// Per-user data — never cache.
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await listGenerations();
  return <GalleryView items={items} />;
}
