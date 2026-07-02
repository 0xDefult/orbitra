/**
 * Globe store — manages 3D globe state, camera, and selected satellite.
 */

import { create } from "zustand";
import type { CameraState, CameraTarget } from "@/types";

interface GlobeStore {
  // Camera
  cameraState: CameraState;
  cameraTarget: CameraTarget | null;
  setCameraState: (state: CameraState) => void;
  setCameraTarget: (target: CameraTarget) => void;

  // Selection
  selectedSatelliteId: string | null;
  hoveredSatelliteId: string | null;
  selectSatellite: (id: string | null) => void;
  hoverSatellite: (id: string | null) => void;

  // Globe rotation
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;

  // Interaction
  isGlobeReady: boolean;
  setGlobeReady: (ready: boolean) => void;
  isSatelliteDataLoaded: boolean;
  setSatelliteDataLoaded: (loaded: boolean) => void;
}

export const useGlobeStore = create<GlobeStore>((set) => ({
  cameraState: "IDLE",
  cameraTarget: null,
  setCameraState: (cameraState) => set({ cameraState }),
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),

  selectedSatelliteId: null,
  hoveredSatelliteId: null,
  selectSatellite: (id) => set({ selectedSatelliteId: id }),
  hoverSatellite: (id) => set({ hoveredSatelliteId: id }),

  autoRotate: true,
  setAutoRotate: (autoRotate) => set({ autoRotate }),

  isGlobeReady: false,
  setGlobeReady: (isGlobeReady) => set({ isGlobeReady }),
  isSatelliteDataLoaded: false,
  setSatelliteDataLoaded: (isSatelliteDataLoaded) => set({ isSatelliteDataLoaded }),
}));
