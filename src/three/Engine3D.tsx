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
  /** plume lengthens/expands as the atmosphere thins (1 = sea level). */
  plumeStretch?: number;
}

export const ENGINE_HEIGHT = 1.4;

export function Engine3D({ design, y, draft, selected, onClick, level, flame = 0, plumeStretch = 1 }: Props) {
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
              <group position={[x, y, z]}>
                {/* bright core (mach-diamond hint at sea level) */}
                <mesh position={[0, -flame * plumeStretch * 1.0, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[bellR * 0.45, flame * plumeStretch * 2.2, 12]} />
                  <meshBasicMaterial color="#fff3c4" transparent opacity={0.95} depthWrite={false} />
                </mesh>
                {/* mid plume */}
                <mesh position={[0, -flame * plumeStretch * 1.6, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry args={[bellR * 0.8, flame * plumeStretch * 3.4, 16]} />
                  <meshBasicMaterial color="#ffb347" transparent opacity={0.7} depthWrite={false} />
                </mesh>
                {/* expanding translucent outer cone — widens in vacuum */}
                <mesh position={[0, -flame * plumeStretch * 2.3, 0]} rotation={[Math.PI, 0, 0]}>
                  <coneGeometry
                    args={[bellR * (0.9 + (plumeStretch - 1) * 0.6), flame * plumeStretch * 4.6, 16, 1, true]}
                  />
                  <meshBasicMaterial color="#7db3ff" transparent opacity={0.2} depthWrite={false} />
                </mesh>
                <pointLight
                  position={[0, -1.5, 0]}
                  intensity={flame * 30}
                  distance={25}
                  decay={2}
                  color="#ffc46b"
                />
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
