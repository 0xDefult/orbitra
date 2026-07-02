"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";

/**
 * Personal Mode — show satellites currently overhead, next ISS pass,
 * and a daily "Space Around You" summary.
 */
export default function PersonalPage() {
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string } | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: "Your Location",
        });
        setLocationPermission("granted");
      },
      () => {
        setLocationPermission("denied");
      },
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold neon-text-blue">Personal</h1>
          <p className="text-white/50 mt-2">Space around you, right now.</p>
        </div>

        {locationPermission !== "granted" ? (
          /* Location permission prompt */
          <GlassPanel variant="heavy" padding="lg" className="text-center">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-xl font-display font-bold text-white mb-3">
              See Space Around You
            </h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Share your location to see which satellites are passing overhead,
              when the ISS flies by, and your daily space summary.
            </p>
            <button
              onClick={requestLocation}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20
                border border-neon-cyan/30 text-neon-cyan font-medium text-sm
                hover:from-neon-blue/30 hover:to-neon-cyan/30 transition-all
                shadow-[0_0_30px_rgba(0,240,255,0.1)]"
            >
              Share My Location
            </button>
            {locationPermission === "denied" && (
              <p className="text-red-400/70 text-xs mt-4">
                Location access was denied. Enable it in your browser settings to use this feature.
              </p>
            )}
          </GlassPanel>
        ) : (
          /* Active personal dashboard */
          <div className="space-y-4">
            {/* ISS Countdown */}
            <GlassPanel variant="heavy" glow="cyan" padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-wider text-neon-cyan/60">
                    Next ISS Pass
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">International Space Station</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-mono font-bold text-neon-gold">12:34</span>
                  <p className="text-2xs text-white/40">in 3h 22m</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-xs text-white/50">
                <span>Max Elevation: 67°</span>
                <span>Direction: SW → NE</span>
                <span>Visible: Yes ✨</span>
              </div>
            </GlassPanel>

            {/* Overhead now */}
            <GlassPanel variant="medium" padding="md">
              <h3 className="text-sm font-medium text-white mb-3">
                🛰️ Satellites Overhead Right Now
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Starlink-2041", alt: "550 km", type: "Communication" },
                  { name: "NOAA 19", alt: "850 km", type: "Weather" },
                  { name: "Sentinel-3B", alt: "815 km", type: "Earth Observation" },
                  { name: "Iridium 118", alt: "780 km", type: "Communication" },
                ].map((sat) => (
                  <div key={sat.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03]">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                    <div>
                      <p className="text-xs text-white/80">{sat.name}</p>
                      <p className="text-2xs text-white/30">{sat.alt} · {sat.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Daily summary */}
            <GlassPanel variant="light" padding="md" glow="gold">
              <h3 className="text-sm font-medium text-white mb-2">
                📋 Your Daily Space Summary
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { value: "2,431", label: "Satellites passed overhead" },
                  { value: "5", label: "Visible to naked eye" },
                  { value: "1", label: "ISS passes" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-mono font-bold text-neon-gold">{stat.value}</p>
                    <p className="text-2xs text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>
        )}
      </div>
    </motion.div>
  );
}
