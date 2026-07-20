import type { Metadata } from "next";
import Preferences from "@/components/dashboard/settings/Preferences";

export const metadata: Metadata = { title: "Settings · Preferences — Artboard" };

export default function PreferencesPage() {
  return <Preferences />;
}
