import { PartMesh } from "./PartMesh";
import type { RocketDesign, RocketPart } from "./rocketDesign";

interface Props {
  design: RocketDesign;
  y: number;
  draft?: boolean;
  selected?: boolean;
  onClick?: (part: RocketPart) => void;
  level?: 1 | 2 | 3;
  flame?: number; // 0..1 — engine glow / plume during launch
}

export const ENGINE_HEIGHT = 1.4;

export function Engine3D({ design, y, draft, selected, onClick, level, flame = 0 }: Props) {
  const n = Math.max(1, Math.min(design.engineCount, 6));
  const bellR = Math.min(design.hullRadius * 0.7, (design.hullRadius * 1.6) / n);
  const ringR = n === 1 ? 0 : design.hullRadius - bellR * 0.9;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * ringR;
        const z = Math.sin(a) * ringR;
        return (
          <group key={i}>
            <PartMesh
              part="engine"
              draft={draft}
              selected={selected}
              onClick={onClick}
              level={level}
              position={[x, y + ENGINE_HEIGHT / 2, z]}
            >
              <coneGeometry args={[bellR, ENGINE_HEIGHT, 24, 1, true]} />
            </PartMesh>
            {flame > 0 && (
              <mesh position={[x, y - flame * 1.6, z]}>
                <coneGeometry args={[bellR * 0.8, flame * 3.4, 16]} />
                <meshBasicMaterial color="#ffb347" transparent opacity={0.85} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
