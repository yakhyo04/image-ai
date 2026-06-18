import type { Metadata } from "next";
import Profile from "@/components/dashboard/settings/Profile";

export const metadata: Metadata = { title: "Settings · Profile — Artboard" };

export default function SettingsPage() {
  return <Profile />;
}
