import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";

/**
 * 404 — custom not-found page with space theme.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-void-900 flex items-center justify-center">
      <GlassPanel variant="heavy" padding="lg" className="text-center max-w-md">
        <div className="text-5xl mb-4">🛸</div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">404</h1>
        <p className="text-white/50 text-sm mb-6">
          This orbit doesn&apos;t exist. The signal has been lost in space.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-colors"
        >
          Return to Earth
        </Link>
      </GlassPanel>
    </div>
  );
}
