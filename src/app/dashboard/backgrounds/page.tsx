import type { Metadata } from "next";
import ToolWorkspace from "@/components/dashboard/ToolWorkspace";

export const metadata: Metadata = { title: "Background Replacement — Artboard" };

export default function Page() {
  return <ToolWorkspace toolKey="backgrounds" />;
}
