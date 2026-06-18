import type { Metadata } from "next";
import Api from "@/components/dashboard/settings/Api";

export const metadata: Metadata = { title: "Settings · API access — Artboard" };

export default function ApiPage() {
  return <Api />;
}
