import type { Metadata } from "next";
import DashPatterns from "@/components/dashboard/DashPatterns";

export const metadata: Metadata = { title: "Pattern Design — Artboard" };

export default function PatternsPage() {
  return <DashPatterns />;
}
