import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GalleryDetail from "@/components/dashboard/GalleryDetail";
import { getGeneration } from "@/lib/generations";

export const metadata: Metadata = { title: "Generation — Artboard" };

// Per-user, signed URLs — never cache.
export const dynamic = "force-dynamic";

export default async function GenerationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGeneration(id);
  if (!item) notFound();
  return <GalleryDetail item={item} />;
}
