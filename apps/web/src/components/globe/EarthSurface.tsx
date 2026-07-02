"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * EarthSurface — a textured sphere representing Earth.
 * Uses a procedural approach when texture files aren't available,
 * falling back to a gradient material with landmass suggestion.
 */
export function EarthSurface() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Earth sphere with procedural material
  // In production, this would use an 8K texture map.
  // For development, we use a procedural earth-like material.
  const earthMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#1a3a5c"), // Ocean blue
      emissive: new THREE.Color("#0a1628"),
      specular: new THREE.Color("#334466"),
      shininess: 15,
    });
  }, []);

  // Cloud layer material — semi-transparent white
  const cloudMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#000000"),
      specular: new THREE.Color("#000000"),
      shininess: 0,
      transparent: true,
      opacity: 0.15,
    });
  }, []);

  // Gentle auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Earth sphere */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[6.371, 128, 128]} />
      </mesh>

      {/* Cloud layer — slightly larger sphere */}
      <mesh material={cloudMaterial}>
        <sphereGeometry args={[6.421, 64, 64]} />
      </mesh>

      {/* Atmosphere outline ring */}
      <mesh>
        <ringGeometry args={[6.35, 6.55, 128]} />
        <meshBasicMaterial
          color="#4488cc"
          side={THREE.DoubleSide}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
