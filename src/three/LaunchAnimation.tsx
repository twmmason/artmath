import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { RocketDesign, RocketPart } from "../three/rocketDesign";
import type { FlightResult } from "../physics/types";
import { Rocket3D } from "./Rocket3D";

interface Props {
  design: RocketDesign;
  flight: FlightResult;
  partLevels?: Partial<Record<RocketPart, 1 | 2 | 3>>;
  onComplete?: () => void;
}

const COUNTDOWN = 3;

/**
 * 3D launch sequence: countdown → ignition → liftoff → staging → coast.
 * The rocket's climb is driven by the ACTUAL simulateFlight samples — a
 * rocket with bad TWR visibly struggles off the pad.
 */
export function LaunchAnimation({ design, flight, partLevels, onComplete }: Props) {
  const group = useRef<Group>(null);
  const elapsed = useRef(-COUNTDOWN);
  const done = useRef(false);
  const [phaseLabel, setPhaseLabel] = useState("T-3");
  const [flame, setFlame] = useState(0);
  const [sep, setSep] = useState(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const timeScale = reducedMotion ? 8 : 2.5;

  useFrame((state, dt) => {
    if (done.current) return;
    elapsed.current += dt * (elapsed.current < 0 ? 1 : timeScale);
    const t = elapsed.current;

    if (t < 0) {
      setPhaseLabel(`T-${Math.ceil(-t)}`);
      return;
    }
    // find flight sample for time t
    const samples = flight.samples;
    if (!samples.length) {
      done.current = true;
      onComplete?.();
      return;
    }
    let idx = Math.min(samples.length - 1, Math.floor(t / 0.5));
    const s = samples[idx];
    // scene: 1 km altitude → some scene metres, log-ish scale for drama
    const sceneY = Math.min(400, Math.pow(s.altitudeKm, 0.75) * 6);
    if (group.current) {
      group.current.position.y = sceneY;
      // slight vibration during ascent
      const shake = s.phase === "liftoff" && s.altitudeKm < 12 ? 0.04 : 0;
      group.current.position.x = (Math.random() - 0.5) * shake;
    }
    setFlame(s.phase === "coast" || s.phase === "falling" ? 0 : 1);
    if (design.boosterCount > 0) {
      const stEvent = flight.events.find((e) => e.label.includes("separation"));
      if (stEvent && t > stEvent.t) setSep(Math.min(1, (t - stEvent.t) / 3));
    }
    setPhaseLabel(
      s.phase === "arrival"
        ? "ARRIVAL 🎉"
        : s.phase === "coast"
          ? `COAST · ${Math.round(s.altitudeKm)} km`
          : s.phase === "falling"
            ? `DESCENT · ${Math.round(s.altitudeKm)} km`
            : `T+${Math.round(t)}s · ${Math.round(s.altitudeKm)} km`,
    );
    // camera tracks the rocket
    state.camera.position.y += (sceneY + 8 - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, sceneY + 5, 0);

    if (idx >= samples.length - 1) {
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
          boosterSeparation={sep}
        />
      </group>
      <Html center position={[0, 2, 0]} zIndexRange={[10, 0]}>
        <div className="text-4xl font-bold text-cyan-300 font-display drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] whitespace-nowrap select-none">
          {phaseLabel}
        </div>
      </Html>
    </group>
  );
}
