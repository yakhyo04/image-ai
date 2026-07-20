import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeatureDetail from "@/components/landing/FeatureDetail";
import { TOOLS, TOOL_MAP } from "@/components/landing/toolsData";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_MAP[slug];
  if (!tool) return { title: "Artboard" };
  return {
    title: `${tool.name} — Artboard`,
    description: tool.desc,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOL_MAP[slug];
  if (!tool) notFound();
  return <FeatureDetail tool={tool} />;
}
