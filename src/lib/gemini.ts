import { GoogleGenAI, type Content, type Part } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment");
}

export const ai = new GoogleGenAI({ apiKey });

export const IMAGE_MODEL = "gemini-2.5-flash-image";

export type Turn = {
  role: "user" | "model";
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
};

export type EditResult = {
  imageBase64: string;
  mimeType: string;
  text?: string;
};

function turnToContent(turn: Turn): Content {
  const parts: Part[] = [];
  if (turn.imageBase64) {
    parts.push({
      inlineData: {
        mimeType: turn.imageMimeType ?? "image/png",
        data: turn.imageBase64,
      },
    });
  }
  if (turn.text) parts.push({ text: turn.text });
  return { role: turn.role, parts };
}

export async function editImage(turns: Turn[]): Promise<EditResult> {
  const contents = turns.map(turnToContent);

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents,
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  let imageBase64: string | undefined;
  let mimeType = "image/png";
  let text: string | undefined;

  for (const part of parts) {
    if (part.inlineData?.data) {
      imageBase64 = part.inlineData.data;
      if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
    } else if (part.text) {
      text = (text ? text + "\n" : "") + part.text;
    }
  }

  if (!imageBase64) {
    throw new Error(
      text
        ? `Gemini returned no image. Message: ${text}`
        : "Gemini returned no image (likely blocked by safety filters).",
    );
  }

  return { imageBase64, mimeType, text };
}
