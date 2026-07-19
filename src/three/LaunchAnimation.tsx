import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Vector3, PerspectiveCamera } from "three";
import type { Group } from "three";
import type { RocketDesign, RocketPart } from "../three/rocketDesign";
import type { FlightResult } from "../physics/types";
import { Rocket3D } from "./Rocket3D";

interface Props {
  design: RocketDesign;
  flight: FlightResult;
  partLevels?: Partial<Record<RocketPart, 1 | 2 | 3>>;
  onComplete?: () => void;
  /** Manual camera override from the "📺 shot" button (null = auto director). */
  shotOverride?: number | null;
  /** Reports the current shot name to the HUD. */
  onShot?: (label: string) => void;
}

const COUNTDOWN = 3;

export const SHOT_NAMES = [
  "📺 Pad Cam",
  "📺 Tower Cam",
  "📺 Tracking Cam",
  "📺 Chase Cam",
  "📺 Orbit Cam",
] as const;

/** Launch director: pick the shot from the rocket's actual simulated state.
 *  Slow ascents naturally hold each shot longer — the cut points are
 *  altitude-driven, not time-driven. */
function directShot(t: number, sceneY: number): number {
  if (t < 2 || sceneY < 4) return 0; // pad cam: countdown + ignition
  if (sceneY < 26) return 1; // tower cam: clearing the gantry
  if (sceneY < 140) return 2; // ground tracking telephoto
  if (sceneY < 320) return 3; // chase cam through the clouds
  return 4; // orbit reveal
}

/**
 * 3D launch sequence: countdown → ignition → liftoff → staging → coast,
 * filmed by a multi-shot launch director that tracks the rocket's ACTUAL
 * simulated position every frame (bad TWR visibly struggles off the pad and
 * the shots hold longer). Camera moves are damped, never snapped.
 */
export function LaunchAnimation({
  design,
  flight,
  partLevels,
  onComplete,
  shotOverride = null,
  onShot,
}: Props) {
  const group = useRef<Group>(null);
  const elapsed = useRef(-COUNTDOWN);
  const done = useRef(false);
  const activeShot = useRef(0);
  const camPos = useRef(new Vector3());
  const camLook = useRef(new Vector3(0, 6, 0));
  const camInit = useRef(false);
  const [phaseLabel, setPhaseLabel] = useState("T-3");
  const [flame, setFlame] = useState(0);
  const [stretch, setStretch] = useState(1);
  const [sep, setSep] = useState(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const timeScale = reducedMotion ? 8 : 2.5;

  useFrame((state, dt) => {
    if (done.current) return;
    elapsed.current += dt * (elapsed.current < 0 ? 1 : timeScale);
    const t = elapsed.current;

    // rocket position from the real flight samples
    const samples = flight.samples;
    if (!samples.length) {
      done.current = true;
      onComplete?.();
      return;
    }
    const idx = Math.max(0, Math.min(samples.length - 1, Math.floor(t / 0.5)));
    const s = samples[idx];
    // scene: 1 km altitude → scene metres, log-ish scale for drama
    const sceneY = t < 0 ? 0 : Math.min(400, Math.pow(s.altitudeKm, 0.75) * 6);
    const shake = t >= 0 && s.phase === "liftoff" && s.altitudeKm < 12 ? 0.04 : 0;
    if (group.current) {
      group.current.position.y = sceneY;
      group.current.position.x = (Math.random() - 0.5) * shake;
    }
    if (t >= 0) {
      setFlame(s.phase === "coast" || s.phase === "falling" ? 0 : 1);
      // plume lengthens/expands as the atmosphere thins
      setStretch(1 + Math.min(2.2, s.altitudeKm / 35));
      if (design.boosterCount > 0) {
        const stEvent = flight.events.find((e) => e.label.includes("separation"));
        if (stEvent && t > stEvent.t) setSep(Math.min(1, (t - stEvent.t) / 3));
      }
    }
    setPhaseLabel(
      t < 0
        ? `T-${Math.ceil(-t)}`
        : s.phase === "arrival"
          ? "ARRIVAL 🎉"
          : s.phase === "coast"
            ? `COAST · ${Math.round(s.altitudeKm)} km`
            : s.phase === "falling"
              ? `DESCENT · ${Math.round(s.altitudeKm)} km`
              : `T+${Math.round(t)}s · ${Math.round(s.altitudeKm)} km`,
    );

    // ── Launch director ──────────────────────────────────────────────
    const rocketMid = new Vector3(0, sceneY + design.hullHeight * 0.6, 0);
    let shot = reducedMotion ? 2 : shotOverride ?? directShot(t, sceneY);
    if (shot !== activeShot.current) {
      activeShot.current = shot;
      onShot?.(SHOT_NAMES[shot]);
    }
    shot = activeShot.current;

    const cam = state.camera as PerspectiveCamera;
    let targetPos: Vector3;
    let targetFov = 40;
    switch (shot) {
      case 0: // pad cam — low wide shot
        targetPos = new Vector3(18, 2.5, 22);
        targetFov = 45;
        break;
      case 1: // tower cam — close pass at the gantry
        targetPos = new Vector3(7, 13, 9);
        targetFov = 42;
        break;
      case 2: // ground tracking telephoto — planted press-site shot
        targetPos = new Vector3(55, 3, 62);
        targetFov = Math.max(10, 34 - sceneY * 0.09);
        break;
      case 3: // chase cam — alongside/behind through the cloud layer
        targetPos = new Vector3(9, sceneY - 3, 12);
        targetFov = 45;
        break;
      default: // orbit reveal — pull back as the sky turns black
        targetPos = new Vector3(46, sceneY + 16, 56);
        targetFov = 50;
    }

    if (!camInit.current) {
      camInit.current = true;
      camPos.current.copy(cam.position);
      camLook.current.copy(rocketMid);
    }
    // smooth ease (damp) — never snap
    const k = 1 - Math.exp(-2.6 * dt);
    camPos.current.lerp(targetPos, k);
    camLook.current.lerp(rocketMid, Math.min(1, k * 2));
    // ignition camera shake
    const igniteShake = t >= 0 && t < 2.5 ? 0.22 * (1 - t / 2.5) : 0;
    cam.position.set(
      camPos.current.x + (Math.random() - 0.5) * igniteShake,
      camPos.current.y + (Math.random() - 0.5) * igniteShake,
      camPos.current.z,
    );
    cam.lookAt(camLook.current);
    cam.fov += (targetFov - cam.fov) * k;
    cam.updateProjectionMatrix();

    if (t >= 0 && idx >= samples.length - 1) {
      done.current = true;
      setTimeout(() => onComplete?.(), 1200);
    }
  });

  return (
    <group>
      <group ref={group}>
        <Rocket3D
          design={design}
          partLevels={partLevels}
          flame={flame}
          plumeStretch={stretch}
          boosterSeparation={sep}
        />
      </group>
      {/* pad smoke/steam at ignition */}
      {flame > 0 && elapsed.current < 8 && (
        <group>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            const r = 2.5 + elapsed.current * 1.4;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * r, 0.6 + Math.sin(i * 3.7) * 0.4, Math.sin(a) * r]}
              >
                <sphereGeometry args={[1.4 + elapsed.current * 0.25, 10, 10]} />
                <meshStandardMaterial
                  color="#e8e4dc"
                  transparent
                  opacity={Math.max(0, 0.5 - elapsed.current * 0.06)}
                  depthWrite={false}
                />
              </mesh>
            );
          })}
        </group>
      )}
      <Html center position={[0, 2, 0]} zIndexRange={[10, 0]}>
        <div className="text-4xl font-bold text-cyan-300 font-display drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] whitespace-nowrap select-none">
          {phaseLabel}
        </div>
      </Html>
    </group>
  );
}