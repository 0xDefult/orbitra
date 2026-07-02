"use client";

import { motion } from "framer-motion";

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  isActive: boolean;
  isCompleted: boolean;
}

// Sample chapters — in production, generated from orbital path
const sampleChapters: Chapter[] = [
  {
    id: "1",
    title: "Over the Pacific",
    subtitle: "Crossing international waters",
    isActive: false,
    isCompleted: true,
  },
  {
    id: "2",
    title: "Approaching Chile",
    subtitle: "South American coastline",
    isActive: true,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Entering Argentina",
    subtitle: "Patagonian skies",
    isActive: false,
    isCompleted: false,
  },
  {
    id: "4",
    title: "South Atlantic",
    subtitle: "Heading toward Africa",
    isActive: false,
    isCompleted: false,
  },
];

/**
 * JourneyTimeline — horizontal chapter timeline showing the satellite's path.
 * Each chapter represents crossing a geographic boundary.
 */
export function JourneyTimeline() {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {sampleChapters.map((chapter, i) => (
        <motion.div
          key={chapter.id}
          className={`flex-shrink-0 px-3 py-2 rounded-lg border text-left min-w-[140px] cursor-default
            ${chapter.isActive
              ? "bg-neon-cyan/10 border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              : chapter.isCompleted
                ? "bg-white/[0.03] border-white/[0.06]"
                : "bg-white/[0.01] border-white/[0.04] opacity-60"
            }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                chapter.isActive
                  ? "bg-neon-cyan animate-pulse-glow"
                  : chapter.isCompleted
                    ? "bg-neon-cyan/60"
                    : "bg-white/20"
              }`}
            />
            <span className="text-2xs font-mono text-white/30 uppercase tracking-wider">
              {chapter.isCompleted ? "Completed" : chapter.isActive ? "Now" : `Ch ${i + 1}`}
            </span>
          </div>
          <p
            className={`text-xs font-medium ${
              chapter.isActive ? "text-white" : "text-white/60"
            }`}
          >
            {chapter.title}
          </p>
          <p className="text-2xs text-white/30 mt-0.5">{chapter.subtitle}</p>
        </motion.div>
      ))}
    </div>
  );
}
