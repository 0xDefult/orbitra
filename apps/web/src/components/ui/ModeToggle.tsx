"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore, type AppMode } from "@/stores/ui";
import { useGlobeStore } from "@/stores/globe";

const modes: { id: AppMode; label: string; icon: string }[] = [
  { id: "globe", label: "Globe", icon: "🌍" },
  { id: "explore", label: "Explore", icon: "🔍" },
  { id: "timeline", label: "Timeline", icon: "⏳" },
  { id: "personal", label: "Personal", icon: "📍" },
];

/**
 * ModeToggle — main navigation mode switcher.
 * Renders as a pill-shaped segmented control with glass effect.
 */
export function ModeToggle() {
  const activeMode = useUIStore((s) => s.activeMode);
  const setMode = useUIStore((s) => s.setMode);
  const selectSatellite = useGlobeStore((s) => s.selectSatellite);

  const handleModeChange = (mode: AppMode) => {
    // Exit story mode when switching
    if (activeMode === "story" && mode !== "story") {
      selectSatellite(null);
    }
    setMode(mode);
  };

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.06] backdrop-blur-[20px] border border-white/[0.08]">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            className="relative px-4 py-2 text-xs font-medium transition-colors duration-200 rounded-full"
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-white/[0.12] rounded-full border border-white/[0.12]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10 flex items-center gap-1.5">
              <span className="text-sm">{mode.icon}</span>
              <span
                className={`hidden sm:inline transition-colors ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                {mode.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
