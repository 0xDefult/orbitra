/**
 * Personal Mode store — manages user location and overhead satellite data.
 */

import { create } from "zustand";
import type { UserLocation, SatellitePass } from "@/types";

interface PersonalStore {
  location: UserLocation | null;
  locationPermission: "prompt" | "granted" | "denied";
  overheadSatellites: SatellitePass[];
  issNextPass: SatellitePass | null;
  isLoading: boolean;

  // Actions
  setLocation: (location: UserLocation) => void;
  setPermission: (permission: "prompt" | "granted" | "denied") => void;
  setOverheadSatellites: (satellites: SatellitePass[]) => void;
  setIssNextPass: (pass: SatellitePass | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const usePersonalStore = create<PersonalStore>((set) => ({
  location: null,
  locationPermission: "prompt",
  overheadSatellites: [],
  issNextPass: null,
  isLoading: false,

  setLocation: (location) => set({ location }),
  setPermission: (locationPermission) => set({ locationPermission }),
  setOverheadSatellites: (overheadSatellites) => set({ overheadSatellites }),
  setIssNextPass: (issNextPass) => set({ issNextPass }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      location: null,
      overheadSatellites: [],
      issNextPass: null,
      isLoading: false,
    }),
}));
