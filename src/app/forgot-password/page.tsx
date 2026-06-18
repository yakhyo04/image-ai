import type { Metadata } from "next";
import Forgot from "@/components/auth/Forgot";

export const metadata: Metadata = { title: "Reset password — Artboard" };

export default function ForgotPage() {
  return <Forgot />;
}
