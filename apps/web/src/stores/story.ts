/**
 * Story Mode store — manages satellite story/narration state.
 */

import { create } from "zustand";
import type { JourneyChapter, StoryData } from "@/types";

interface StoryStore {
  isActive: boolean;
  selectedSatelliteId: string | null;
  storyData: StoryData | null;
  chapters: JourneyChapter[];
  currentChapterIndex: number;
  narration: string;
  isNarrationLoading: boolean;

  // Actions
  activate: (satelliteId: string) => void;
  deactivate: () => void;
  setStoryData: (data: StoryData) => void;
  setChapters: (chapters: JourneyChapter[]) => void;
  advanceChapter: () => void;
  setNarration: (text: string) => void;
  setNarrationLoading: (loading: boolean) => void;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  isActive: false,
  selectedSatelliteId: null,
  storyData: null,
  chapters: [],
  currentChapterIndex: 0,
  narration: "",
  isNarrationLoading: false,

  activate: (satelliteId) =>
    set({
      isActive: true,
      selectedSatelliteId: satelliteId,
      currentChapterIndex: 0,
      narration: "",
    }),

  deactivate: () =>
    set({
      isActive: false,
      selectedSatelliteId: null,
      storyData: null,
      currentChapterIndex: 0,
      narration: "",
    }),

  setStoryData: (storyData) => set({ storyData }),
  setChapters: (chapters) => set({ chapters }),
  advanceChapter: () =>
    set((state) => ({
      currentChapterIndex: Math.min(state.currentChapterIndex + 1, state.chapters.length - 1),
    })),
  setNarration: (narration) => set({ narration }),
  setNarrationLoading: (isNarrationLoading) => set({ isNarrationLoading }),
}));
