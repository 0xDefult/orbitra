"use client";

import { useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

/**
 * Root error boundary — graceful error display for unhandled exceptions.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center">
      <GlassPanel variant="heavy" padding="lg" className="text-center max-w-md">
        <div className="text-4xl mb-4">🚀</div>
        <h1 className="text-xl font-display font-bold text-white mb-3">
          Signal Lost
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Something went wrong in the mission. Let&apos;s re-establish contact.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-colors"
        >
          Retry Connection
        </button>
      </GlassPanel>
    </div>
  );
}
