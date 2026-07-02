/**
 * UI store — manages app-level UI state: mode, menus, audio, loading.
 */

import { create } from "zustand";

export type AppMode = "globe" | "story" | "timeline" | "explore" | "personal";

interface UIStore {
  activeMode: AppMode;
  previousMode: AppMode | null;
  isMenuOpen: boolean;
  isAudioEnabled: boolean;
  isLoading: boolean;
  loadingProgress: number;

  // Actions
  setMode: (mode: AppMode) => void;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  toggleAudio: () => void;
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  completeLoading: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  activeMode: "globe",
  previousMode: null,
  isMenuOpen: false,
  isAudioEnabled: false,
  isLoading: true,
  loadingProgress: 0,

  setMode: (mode) =>
    set((state) => ({
      previousMode: state.activeMode,
      activeMode: mode,
    })),

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),

  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),

  setLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  completeLoading: () => set({ isLoading: false, loadingProgress: 1 }),
}));
