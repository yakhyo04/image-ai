import type { Metadata } from "next";
import DashHome from "@/components/dashboard/DashHome";

export const metadata: Metadata = { title: "Dashboard — Artboard" };

export default function DashboardPage() {
  return <DashHome />;
}
