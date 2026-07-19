import { PartMesh } from "./PartMesh";
import type { RocketDesign, RocketPart } from "./rocketDesign";

interface Props {
  design: RocketDesign;
  y: number;
  draft?: boolean;
  selected?: boolean;
  onClick?: (part: RocketPart) => void;
  level?: 1 | 2 | 3;
  /** staging animation: 0 = attached, 1 = fully separated/tumbled */
  separation?: number;
}

/** Radial solid boosters — separate + tumble away at staging. */
export function Booster3D({
  design,
  y,
  draft,
  selected,
  onClick,
  level,
  separation = 0,
}: Props) {
  const n = Math.max(1, Math.min(design.boosterCount, 4));
  const h = 4;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + Math.PI / n;
        const drift = separation * 4;
        const drop = separation * 6;
        return (
          <group
            key={i}
            position={[
              Math.cos(a) * (design.hullRadius + 0.55 + drift),
              y + h / 2 - drop,
              Math.sin(a) * (design.hullRadius + 0.55 + drift),
            ]}
            rotation={[separation * 1.6, 0, separation * 1.2]}
          >
            <PartMesh
              part="booster"
              draft={draft}
              selected={selected}
              onClick={onClick}
              level={level}
            >
              <capsuleGeometry args={[0.35, h - 0.7, 6, 16]} />
            </PartMesh>
          </group>
        );
      })}
    </group>
  );
}
