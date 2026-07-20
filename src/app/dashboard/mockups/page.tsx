import type { Metadata } from "next";
import ToolWorkspace from "@/components/dashboard/ToolWorkspace";

export const metadata: Metadata = { title: "Product Mockups — Artboard" };

export default function Page() {
  return <ToolWorkspace toolKey="mockups" />;
}
