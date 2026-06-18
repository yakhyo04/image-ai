import type { Metadata } from "next";
import Progress from "@/components/dashboard/Progress";

export const metadata: Metadata = { title: "Generating — Artboard" };

export default function ProgressPage() {
  return <Progress />;
}
