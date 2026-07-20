import type { Metadata } from "next";
import Login from "@/components/auth/Login";

export const metadata: Metadata = { title: "Log in — Artboard" };

export default function LoginPage() {
  return <Login />;
}
