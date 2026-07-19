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

export const BAY_HEIGHT = 1.5;

/** Payload bay ring with visible pod compartments. */
export function PayloadBay3D({ design, y, draft, selected, onClick, level }: Props) {
  const pods = Math.max(1, Math.min(design.payloadPods, 8));
  return (
    <group>
      <PartMesh
        part="payloadBay"
        draft={draft}
        selected={selected}
        onClick={onClick}
        level={level}
        position={[0, y + BAY_HEIGHT / 2, 0]}
      >
        <cylinderGeometry
          args={[design.hullRadius * 1.02, design.hullRadius * 1.02, BAY_HEIGHT, 32]}
        />
      </PartMesh>
      {Array.from({ length: pods }, (_, i) => {
        const a = (i / pods) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * design.hullRadius * 1.03,
              y + BAY_HEIGHT / 2,
              Math.sin(a) * design.hullRadius * 1.03,
            ]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.08, 0.8, 0.5]} />
            <meshStandardMaterial color="#7c5cd6" metalness={0.3} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
