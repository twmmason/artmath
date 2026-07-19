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

/** Parametric nose cone — sharper noseAngle = taller, thinner cone. */
export function NoseCone3D({ design, y, draft, selected, onClick, level }: Props) {
  // tip angle → cone height relative to radius: sharper angle = taller cone
  const h = Math.max(
    0.8,
    design.hullRadius / Math.tan(((design.noseAngle / 2) * Math.PI) / 180),
  );
  const height = Math.min(h, design.noseHeight * 2.2);
  return (
    <PartMesh
      part="noseCone"
      draft={draft}
      selected={selected}
      onClick={onClick}
      level={level}
      position={[0, y + height / 2, 0]}
    >
      <coneGeometry args={[design.hullRadius, height, 32]} />
    </PartMesh>
  );
}

export function noseConeHeight(design: RocketDesign): number {
  const h = Math.max(
    0.8,
    design.hullRadius / Math.tan(((design.noseAngle / 2) * Math.PI) / 180),
  );
  return Math.min(h, design.noseHeight * 2.2);
}
