import type { Metadata } from "next";
import VideoView from "@/components/dashboard/VideoView";

export const metadata: Metadata = { title: "Product Video — Artboard" };

export default function VideoPage() {
  return <VideoView />;
}
