import type { Metadata } from "next";
import Brand from "@/components/dashboard/settings/Brand";

export const metadata: Metadata = { title: "Settings · Brand kit — Artboard" };

export default function BrandPage() {
  return <Brand />;
}
