"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Atmosphere — an atmospheric glow around Earth.
 * Uses a custom shader material for Rayleigh scattering approximation.
 */
export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vNormal = normalize(mat3(modelMatrix) * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        uniform vec3 uSunDirection;
        uniform float uIntensity;

        void main() {
          // View direction from camera to fragment (in world space)
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

          // Fresnel effect — more glow at edges (grazing angles)
          float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
          fresnel = pow(fresnel, 3.0);

          // Sun direction influence
          float sunInfluence = dot(normalize(uSunDirection), vNormal) * 0.5 + 0.5;

          // Atmospheric colors
          vec3 dayGlow = vec3(0.3, 0.6, 1.0);  // Blue daytime glow
          vec3 nightGlow = vec3(0.05, 0.1, 0.3); // Darker night glow

          vec3 glowColor = mix(nightGlow, dayGlow, sunInfluence);

          float alpha = fresnel * uIntensity * 0.6;
          gl_FragColor = vec4(glowColor, alpha);
        }
      `,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(1, 0.5, 1).normalize() },
        uIntensity: { value: 1.2 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  return (
    <mesh ref={meshRef} material={atmosphereMaterial}>
      <sphereGeometry args={[6.55, 64, 64]} />
    </mesh>
  );
}
