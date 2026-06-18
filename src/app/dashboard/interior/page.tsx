import type { Metadata } from "next";
import ToolWorkspace from "@/components/dashboard/ToolWorkspace";

export const metadata: Metadata = { title: "Interior Design — Artboard" };

export default function Page() {
  return <ToolWorkspace toolKey="interior" />;
}
