import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, ContactShadows } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { LaunchSite } from "../mission/launchSites";
import { GeoEnvironment, HAS_MAPS_KEY } from "./GeoEnvironment";

interface RocketSceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  autoRotate?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
  /** Real-world environment: takram atmosphere + Google 3D Tiles at this
   *  launch site (network-first — requires VITE_GOOGLE_MAPS_API_KEY). */
  geoSite?: LaunchSite;
  /** 0–24 local solar hour for the geo environment sun. */
  solarHour?: number;
  /** Disable OrbitControls (the launch director drives the camera). */
  controlsEnabled?: boolean;
}

/** Shared Canvas: stars, lighting, ground-aware orbit, WebGL loss recovery. */
export function RocketScene({
  children,
  cameraPosition = [10, 7, 12],
  target = [0, 5, 0],
  autoRotate = false,
  onCanvasReady,
  geoSite,
  solarHour,
  controlsEnabled = true,
}: RocketSceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const geo = Boolean(geoSite) && HAS_MAPS_KEY;

  return (
    <Canvas
      shadows={{ type: PCFSoftShadowMap }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        preserveDrawingBuffer: true,
      }}
      camera={{ position: cameraPosition, fov: 40, near: 0.5, far: 80000 }}
      onCreated={({ gl }) => {
        onCanvasReady?.(gl.domElement);
        gl.domElement.addEventListener("webglcontextlost", (e) =>
          e.preventDefault(),
        );
      }}
    >
      {!geo && <color attach="background" args={["#070b1a"]} />}
      <Suspense fallback={null}>
        {geo && geoSite ? (
          <GeoEnvironment site={geoSite} solarHour={solarHour} clouds={!reducedMotion}>
            <ContactShadows position={[0, -0.01, 0]} opacity={0.35} scale={30} blur={2} />
            {children}
          </GeoEnvironment>
        ) : (
          <>
            <Stars radius={200} depth={60} count={4000} factor={4} fade speed={0.5} />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[15, 25, 10]}
              intensity={2.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <hemisphereLight args={["#8ab6ff", "#20263a", 0.5]} />
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={30} blur={2} />
            {children}
          </>
        )}
      </Suspense>
      {controlsEnabled && (
      <OrbitControls
        ref={controls}
        target={target}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={4}
        maxDistance={80}
        autoRotate={autoRotate && !reducedMotion}
        autoRotateSpeed={0.6}
        enableDamping
      />
      )}
    </Canvas>
  );
}

/** Capture the live canvas as a PNG dataURL (same-frame via preserveDrawingBuffer). */
export function captureCanvas(canvas: HTMLCanvasElement | null): string | undefined {
  try {
    return canvas?.toDataURL("image/png");
  } catch {
    return undefined;
  }
}

/** hook: expose the R3F canvas element to the page */
export function useCanvasRef() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => () => void (ref.current = null), []);
  return ref;
}
