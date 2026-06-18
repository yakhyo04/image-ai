import type { Metadata } from "next";
import GalleryView from "@/components/dashboard/GalleryView";

export const metadata: Metadata = { title: "Gallery — Artboard" };

export default function GalleryPage() {
  return <GalleryView />;
}
