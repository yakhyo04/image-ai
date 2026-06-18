import type { Metadata } from "next";
import Signup from "@/components/auth/Signup";

export const metadata: Metadata = { title: "Sign up — Artboard" };

export default function SignupPage() {
  return <Signup />;
}
