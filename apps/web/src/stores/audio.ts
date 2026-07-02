/**
 * Audio store — manages ambient audio playback state.
 */

import { create } from "zustand";

interface AudioStore {
  isEnabled: boolean;
  isPlaying: boolean;
  volume: number;

  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  isEnabled: false,
  isPlaying: false,
  volume: 0.3,

  toggle: () =>
    set((state) => {
      const newEnabled = !state.isEnabled;
      return {
        isEnabled: newEnabled,
        isPlaying: newEnabled,
      };
    }),

  setEnabled: (isEnabled) => set({ isEnabled, isPlaying: isEnabled }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
}));
