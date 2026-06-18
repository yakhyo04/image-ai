import type { Metadata } from "next";
import Team from "@/components/dashboard/settings/Team";

export const metadata: Metadata = { title: "Settings · Team — Artboard" };

export default function TeamPage() {
  return <Team />;
}
