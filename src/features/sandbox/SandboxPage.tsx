import { useState } from "react";
import { defaultRocketDesign, type RocketDesign } from "../../three/rocketDesign";
import { RocketScene } from "../../three/RocketScene";
import { Rocket3D } from "../../three/Rocket3D";
import { PerformanceDashboard } from "../../components/PerformanceDashboard";

interface SliderDef {
  key: keyof RocketDesign;
  label: string;
  min: number;
  max: number;
  step: number;
  mathsNote: string;
}

const SLIDERS: SliderDef[] = [
  { key: "noseAngle", label: "Nose tip angle (°)", min: 15, max: 120, step: 1, mathsNote: "Geometry: acute angles slice the air" },
  { key: "hullHeight", label: "Hull height (m)", min: 5, max: 14, step: 0.5, mathsNote: "Place value: dimensions & scaling" },
  { key: "tankFill", label: "Fuel fill (fraction)", min: 0, max: 1, step: 0.05, mathsNote: "Fractions: 3/4 fill vs full tanks" },
  { key: "engineCount", label: "Engines", min: 1, max: 6, step: 1, mathsNote: "Multiplication: total thrust per engine" },
  { key: "thrustPerEngine", label: "Thrust per engine (kN)", min: 100, max: 500, step: 10, mathsNote: "Division: sharing thrust across engines" },
  { key: "finCount", label: "Fins", min: 0, max: 6, step: 1, mathsNote: "Symmetry: even fins keep it stable" },
  { key: "payloadPods", label: "Payload pods", min: 0, max: 8, step: 1, mathsNote: "Division: sharing cargo equally" },
  { key: "boosterCount", label: "Boosters", min: 0, max: 4, step: 1, mathsNote: "Number facts: staging maths" },
];

/** Free-design mode: sliders drive the design, dashboard shows consequences. */
export function SandboxPage() {
  const [design, setDesign] = useState<RocketDesign>(defaultRocketDesign());
  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="z-30 w-80 shrink-0 space-y-2 overflow-auto border-r border-cyan-900/40 bg-space-900/80 p-4">
        <div className="text-xs font-bold tracking-widest text-cyan-300">🧪 SANDBOX — FREE DESIGN</div>
        <p className="text-[10px] text-slate-400">
          Experiment freely — every slider shows the maths behind the engineering.
        </p>
        {SLIDERS.map((s) => (
          <label key={String(s.key)} className="block text-xs text-slate-300">
            <span className="flex justify-between">
              <span>{s.label}</span>
              <span className="font-mono text-cyan-300">{String(design[s.key])}</span>
            </span>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={Number(design[s.key])}
              onChange={(e) =>
                setDesign((d) => ({ ...d, [s.key]: Number(e.target.value) }))
              }
              className="w-full accent-cyan-400"
            />
            <span className="text-[9px] text-cyan-600">{s.mathsNote}</span>
          </label>
        ))}
        <PerformanceDashboard design={design} />
      </div>
      <div className="relative flex-1">
        <RocketScene autoRotate cameraPosition={[12, 9, 14]}>
          <Rocket3D design={design} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <circleGeometry args={[40, 40]} />
            <meshStandardMaterial color="#1a2340" roughness={0.9} />
          </mesh>
        </RocketScene>
      </div>
    </div>
  );
}
