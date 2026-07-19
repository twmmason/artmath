import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { RocketDesign, RocketPart } from "./rocketDesign";
import { ALL_PARTS } from "./rocketDesign";
import { ENGINE_HEIGHT } from "./Engine3D";
import { BAY_HEIGHT } from "./PayloadBay3D";

function Node({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick?: () => void;
}) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.2);
  });
  return (
    <mesh ref={ref} position={position} onClick={onClick}>
      <sphereGeometry args={[0.22, 12, 12]} />
      <meshBasicMaterial color="#34d399" transparent opacity={0.7} />
    </mesh>
  );
}

/**
 * Kerbal-style green snap markers showing where missing parts attach.
 * Clicking a node selects that part slot (the tray then attaches a variant).
 */
export function AttachmentNodes({
  design,
  onNodeClick,
}: {
  design: RocketDesign;
  onNodeClick?: (part: RocketPart) => void;
}) {
  const missing = ALL_PARTS.filter((p) => !design.installedParts[p]);
  const tankH = design.hullHeight * 0.45;
  const hullH = design.hullHeight * 0.55;
  const positions: Partial<Record<RocketPart, [number, number, number]>> = {
    engine: [0, ENGINE_HEIGHT / 2, 0],
    fuelTank: [0, ENGINE_HEIGHT + tankH / 2, 0],
    hull: [0, ENGINE_HEIGHT + tankH + hullH / 2, 0],
    payloadBay: [0, ENGINE_HEIGHT + tankH + hullH + BAY_HEIGHT / 2, 0],
    noseCone: [0, ENGINE_HEIGHT + tankH + hullH + BAY_HEIGHT + 1, 0],
    fins: [design.hullRadius + 0.6, ENGINE_HEIGHT + 1, 0],
    electronics: [-(design.hullRadius + 0.4), ENGINE_HEIGHT + tankH + hullH * 0.5, 0],
    booster: [0, ENGINE_HEIGHT + 1.4, design.hullRadius + 0.7],
  };
  return (
    <group>
      {missing.map((p) => (
        <Node key={p} position={positions[p]!} onClick={() => onNodeClick?.(p)} />
      ))}
    </group>
  );
}
