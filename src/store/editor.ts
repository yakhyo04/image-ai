import { create } from "zustand";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  imageDataUrl?: string;
  selectionPreview?: string;
};

type EditorState = {
  history: string[];
  cursor: number;
  messages: ChatMessage[];
  loading: boolean;

  setInitialImage: (dataUrl: string) => void;
  pushImage: (dataUrl: string) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;

  addMessage: (m: ChatMessage) => void;
  setLoading: (b: boolean) => void;
};

export const useEditor = create<EditorState>((set) => ({
  history: [],
  cursor: -1,
  messages: [],
  loading: false,

  setInitialImage: (dataUrl) =>
    set({ history: [dataUrl], cursor: 0, messages: [] }),

  pushImage: (dataUrl) =>
    set((s) => {
      const trimmed = s.history.slice(0, s.cursor + 1);
      trimmed.push(dataUrl);
      return { history: trimmed, cursor: trimmed.length - 1 };
    }),

  undo: () =>
    set((s) => ({ cursor: Math.max(0, s.cursor - 1) })),

  redo: () =>
    set((s) => ({ cursor: Math.min(s.history.length - 1, s.cursor + 1) })),

  reset: () => set({ history: [], cursor: -1, messages: [] }),

  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setLoading: (b) => set({ loading: b }),
}));

export function currentImage(state: {
  history: string[];
  cursor: number;
}): string | undefined {
  return state.cursor >= 0 ? state.history[state.cursor] : undefined;
}
