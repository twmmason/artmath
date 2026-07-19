import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, ContactShadows } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface RocketSceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  autoRotate?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

/** Shared Canvas: stars, lighting, ground-aware orbit, WebGL loss recovery. */
export function RocketScene({
  children,
  cameraPosition = [10, 7, 12],
  target = [0, 5, 0],
  autoRotate = false,
  onCanvasReady,
}: RocketSceneProps) {
  const controls = useRef<OrbitControlsImpl>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      shadows
      gl={{
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        preserveDrawingBuffer: true,
      }}
      camera={{ position: cameraPosition, fov: 40 }}
      onCreated={({ gl }) => {
        onCanvasReady?.(gl.domElement);
        gl.domElement.addEventListener("webglcontextlost", (e) =>
          e.preventDefault(),
        );
      }}
    >
      <color attach="background" args={["#070b1a"]} />
      <Suspense fallback={null}>
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
      </Suspense>
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
