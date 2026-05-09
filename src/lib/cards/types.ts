import type {
  InfographicAspect,
  InfographicLanguage,
  InlineImage,
} from "@/lib/gemini";

/** Identifies which of the 4 panels a generation call is for. */
export type PanelId = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type CardsInput = {
  images: InlineImage[];
  description?: string;
  aspectRatio: InfographicAspect;
  language: InfographicLanguage;
};

export type PanelGenInput = {
  panel: PanelId;
  images: InlineImage[];
  description?: string;
  aspectRatio: InfographicAspect;
  language: InfographicLanguage;
};

export type CardsResult = {
  imageBase64: string;
  mimeType: string;
};
