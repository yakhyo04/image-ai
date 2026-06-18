import type { Metadata } from "next";
import DashCredits from "@/components/dashboard/DashCredits";

export const metadata: Metadata = { title: "Credits & Billing — Artboard" };

export default function CreditsPage() {
  return <DashCredits />;
}
