import { PartMesh } from "./PartMesh";
import type { RocketDesign, RocketPart } from "./rocketDesign";

interface Props {
  design: RocketDesign;
  y: number;
  draft?: boolean;
  selected?: boolean;
  onClick?: (part: RocketPart) => void;
  level?: 1 | 2 | 3;
}

/** Circuit breadboard mounted on the hull with status LEDs. */
export function ElectronicsBay3D({ design, y, draft, selected, onClick, level }: Props) {
  const leds = 5;
  const wired = Math.min(design.circuitsWired, leds);
  return (
    <group
      position={[design.hullRadius + 0.08, y, 0]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <PartMesh
        part="electronics"
        draft={draft}
        selected={selected}
        onClick={onClick}
        level={level}
      >
        <boxGeometry args={[1, 1.3, 0.15]} />
      </PartMesh>
      {Array.from({ length: leds }, (_, i) => (
        <mesh key={i} position={[-0.35 + i * 0.18, 0.45, 0.1]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial
            color={i < wired ? "#34d399" : "#fbbf24"}
            emissive={i < wired ? "#34d399" : "#8a6d1a"}
            emissiveIntensity={i < wired ? 1 : 0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
