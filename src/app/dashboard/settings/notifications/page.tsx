import type { Metadata } from "next";
import Notifications from "@/components/dashboard/settings/Notifications";

export const metadata: Metadata = { title: "Settings · Notifications — Artboard" };

export default function NotificationsPage() {
  return <Notifications />;
}
