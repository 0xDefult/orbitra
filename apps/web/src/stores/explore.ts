/**
 * Explore Mode store — manages filter state for satellite discovery.
 */

import { create } from "zustand";
import type { ExploreFilters } from "@/types";

interface ExploreStore {
  filters: ExploreFilters;
  isFilterPanelOpen: boolean;
  sortBy: "name" | "launchDate" | "altitude" | "speed";
  sortDir: "asc" | "desc";

  // Actions
  setFilter: <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => void;
  resetFilters: () => void;
  toggleFilterPanel: () => void;
  setSortBy: (sort: "name" | "launchDate" | "altitude" | "speed") => void;
  toggleSortDir: () => void;
}

const defaultFilters: ExploreFilters = {
  countries: [],
  organizations: [],
  missionTypes: [],
  orbitalClasses: [],
  launchYearRange: null,
  constellations: [],
  activeOnly: true,
  searchQuery: "",
};

export const useExploreStore = create<ExploreStore>((set) => ({
  filters: { ...defaultFilters },
  isFilterPanelOpen: false,
  sortBy: "name",
  sortDir: "asc",

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  toggleFilterPanel: () =>
    set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),

  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortDir: () =>
    set((state) => ({ sortDir: state.sortDir === "asc" ? "desc" : "asc" })),
}));
