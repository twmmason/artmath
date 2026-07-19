import { PartMesh } from "./PartMesh";
import type { RocketDesign, RocketPart } from "./rocketDesign";

interface Props {
  design: RocketDesign;
  y: number;
  height: number;
  draft?: boolean;
  selected?: boolean;
  onClick?: (part: RocketPart) => void;
  level?: 1 | 2 | 3;
}

/** Translucent tank with a liquid column that rises/falls with tankFill. */
export function FuelTank3D({ design, y, height, draft, selected, onClick, level }: Props) {
  const liquidH = Math.max(0.05, height * design.tankFill);
  return (
    <group>
      <PartMesh
        part="fuelTank"
        draft={draft}
        selected={selected}
        onClick={onClick}
        level={level}
        position={[0, y + height / 2, 0]}
      >
        <cylinderGeometry
          args={[design.hullRadius * 0.98, design.hullRadius * 0.98, height, 32]}
        />
      </PartMesh>
      {/* the liquid */}
      <mesh position={[0, y + liquidH / 2, 0]}>
        <cylinderGeometry
          args={[design.hullRadius * 0.9, design.hullRadius * 0.9, liquidH, 24]}
        />
        <meshStandardMaterial
          color="#0891b2"
          transparent
          opacity={draft ? 0.2 : 0.7}
          emissive="#22d3ee"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
}
