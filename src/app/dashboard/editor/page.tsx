import type { Metadata } from "next";
import EditorView from "@/components/dashboard/EditorView";

export const metadata: Metadata = { title: "Photo Editor — Artboard" };

export default function EditorPage() {
  return <EditorView />;
}
