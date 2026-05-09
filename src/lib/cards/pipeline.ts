import {
  INFOGRAPHIC_MODEL,
  type InfographicAspect,
  type InfographicLanguage,
  type InlineImage,
} from "@/lib/gemini";
import type { Part } from "@google/genai";
import { buildPanelPrompt } from "./panelPrompts";
import { composeCardsGrid } from "./compositor";
import type { CardsInput, CardsResult, PanelId } from "./types";

const PANELS: PanelId[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

/** Vertex AI generateContent endpoint — explicit URL, called via direct fetch
 * (no SDK abstraction). The URL is exactly the one specified by the user. */
const VERTEX_GENERATE_URL = (model: string, apiKey: string) =>
  `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${apiKey}`;

type VertexResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ inlineData?: { data?: string } }> };
  }>;
  error?: { code?: number; message?: string; status?: string };
};

async function callVertexGenerateContent(args: {
  model: string;
  parts: Part[];
  aspectRatio: string;
}): Promise<VertexResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const url = VERTEX_GENERATE_URL(args.model, apiKey);
  const redactedUrl = url.replace(apiKey, "[REDACTED]");
  console.log(`[cards] POST ${redactedUrl}`);

  const body = {
    contents: [{ role: "user", parts: args.parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: args.aspectRatio, imageSize: "2K" },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  if (!res.ok) {
    throw new Error(responseText);
  }
  return JSON.parse(responseText) as VertexResponse;
}

/** Retry on Vertex 429 RESOURCE_EXHAUSTED with exponential backoff.
 * Long delays give per-minute quota windows time to reset. If the failure
 * persists after all retries, the daily quota is likely exhausted and only
 * a tier upgrade or quota window reset will help. */
async function withRetryOn429<T>(fn: () => Promise<T>): Promise<T> {
  const retries = 3;
  const baseDelayMs = 30000; // 30s → 60s → 120s
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit =
        msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429");
      if (!isRateLimit || attempt >= retries) throw err;
      await new Promise((r) =>
        setTimeout(r, baseDelayMs * Math.pow(2, attempt)),
      );
    }
  }
  throw lastErr;
}

/** Generate a single panel image via direct fetch to Vertex AI. */
async function generatePanel(args: {
  panel: PanelId;
  images: InlineImage[];
  description?: string;
  aspectRatio: InfographicAspect;
  language: InfographicLanguage;
}): Promise<Buffer> {
  const { panel, images, description, aspectRatio, language } = args;

  const parts: Part[] = images.map((img) => ({
    inlineData: { mimeType: img.mimeType, data: img.base64 },
  }));
  parts.push({ text: buildPanelPrompt(panel, description, language) });

  console.log(`[cards] generating panel: ${panel}`);
  const response = await withRetryOn429(() =>
    callVertexGenerateContent({
      model: INFOGRAPHIC_MODEL,
      parts,
      aspectRatio,
    }),
  );

  const respParts = response.candidates?.[0]?.content?.parts ?? [];
  for (const p of respParts) {
    if (p.inlineData?.data) {
      return Buffer.from(p.inlineData.data, "base64");
    }
  }
  throw new Error(`Panel "${panel}" generation returned no image`);
}

/**
 * Run the 4 panel calls SEQUENTIALLY. Each Gemini image-gen call already
 * takes 30–60s, so sequential paces calls naturally at 1 every ~30–60s,
 * staying well under Vertex Express Mode's per-minute quota (~5–10 image
 * RPM). Concurrent calls were exhausting the burst quota.
 */
async function runPanelsSequential(
  inputs: CardsInput,
): Promise<Record<PanelId, Buffer>> {
  const results: Partial<Record<PanelId, Buffer>> = {};
  for (const panel of PANELS) {
    results[panel] = await generatePanel({
      panel,
      images: inputs.images,
      description: inputs.description,
      aspectRatio: inputs.aspectRatio,
      language: inputs.language,
    });
  }
  return results as Record<PanelId, Buffer>;
}

/**
 * Cards pipeline: 4 separate single-panel Gemini calls + sharp composite.
 *
 * Cost: 4× normal Gemini call.
 * Latency: ~1–2 minutes (concurrency=2, ~30–60s per panel).
 */
export async function generateCards(input: CardsInput): Promise<CardsResult> {
  if (input.images.length === 0) {
    throw new Error("At least one product image is required.");
  }

  const panels = await runPanelsSequential(input);
  const composed = await composeCardsGrid({
    topLeft: panels.topLeft,
    topRight: panels.topRight,
    bottomLeft: panels.bottomLeft,
    bottomRight: panels.bottomRight,
    aspectRatio: input.aspectRatio,
  });

  return {
    imageBase64: composed.toString("base64"),
    mimeType: "image/png",
  };
}
