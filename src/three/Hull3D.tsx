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

export function Hull3D({ design, y, height, draft, selected, onClick, level }: Props) {
  return (
    <PartMesh
      part="hull"
      draft={draft}
      selected={selected}
      onClick={onClick}
      level={level}
      position={[0, y + height / 2, 0]}
    >
      <cylinderGeometry args={[design.hullRadius, design.hullRadius, height, 32]} />
    </PartMesh>
  );
}
