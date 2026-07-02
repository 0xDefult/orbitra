"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useUIStore } from "@/stores/ui";

/**
 * PostProcessing — post-processing effect chain for cinematic look.
 *
 * Effects:
 * - Bloom: Glow around bright objects (satellites, atmosphere)
 * - Vignette: Subtle dark edges for cinematic framing
 */
export function PostProcessing() {
  const isStoryActive = useUIStore((s) => s.activeMode === "story");

  // Increase bloom intensity during story mode for dramatic effect
  const bloomIntensity = isStoryActive ? 1.5 : 0.8;

  return (
    <EffectComposer
      multisampling={4}
      enableNormalPass
    >
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={bloomIntensity}
        radius={0.8}
        mipmapBlur
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        eskil={false}
      />
    </EffectComposer>
  );
}
