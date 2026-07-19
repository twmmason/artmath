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

/** Radially symmetric fins around the hull base. */
export function Fins3D({ design, y, draft, selected, onClick, level }: Props) {
  const n = Math.max(1, Math.min(design.finCount, 6));
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return (
          <PartMesh
            key={i}
            part="fins"
            draft={draft}
            selected={selected}
            onClick={onClick}
            level={level}
            position={[
              Math.cos(a) * (design.hullRadius + 0.45),
              y + 1,
              Math.sin(a) * (design.hullRadius + 0.45),
            ]}
            rotation={[0, -a + Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.12, 2.2, 1.1]} />
          </PartMesh>
        );
      })}
    </group>
  );
}
