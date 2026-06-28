import { create } from "zustand";

/**
 * Shared credit balance for the dashboard. The layout seeds it from the
 * `profiles` table on navigation; generation components update it directly
 * from each API response's `credits` field so the badge reflects spend
 * immediately, without waiting for a page change.
 */
type CreditsState = {
  credits: number | null;
  setCredits: (credits: number | null) => void;
};

export const useCredits = create<CreditsState>((set) => ({
  credits: null,
  setCredits: (credits) => set({ credits }),
}));
