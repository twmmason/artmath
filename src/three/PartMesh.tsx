import { useRef, useState, type ReactNode } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { RocketPart } from "./rocketDesign";
import { PART_MATERIALS } from "./materials";

interface PartMeshProps {
  part: RocketPart;
  draft?: boolean;
  selected?: boolean;
  onClick?: (part: RocketPart) => void;
  level?: 1 | 2 | 3;
  children: ReactNode; // geometry element
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Shared interactive mesh: hover glow, click select, draft ghosting,
 * emissive pulse when selected, shinier materials at higher levels.
 */
export function PartMesh({
  part,
  draft,
  selected,
  onClick,
  level = 1,
  children,
  position,
  rotation,
}: PartMeshProps) {
  const mesh = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);
  const mat = PART_MATERIALS[part];

  useFrame(({ clock }) => {
    const m = mesh.current?.material as MeshStandardMaterial | undefined;
    if (!m) return;
    if (selected) {
      m.emissiveIntensity = 0.25 + Math.sin(clock.elapsedTime * 4) * 0.15;
    } else if (hover) {
      m.emissiveIntensity = 0.3;
    } else {
      m.emissiveIntensity = draft ? 0.12 : 0.02;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.(part);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "default";
      }}
    >
      {children}
      <meshStandardMaterial
        color={draft ? "#8899cc" : mat.color}
        roughness={Math.max(0.1, mat.roughness - (level - 1) * 0.12)}
        metalness={Math.min(1, mat.metalness + (level - 1) * 0.2)}
        transparent={draft || mat.transparent}
        opacity={draft ? 0.3 : (mat.opacity ?? 1)}
        emissive={draft ? "#fbbf24" : "#22d3ee"}
        emissiveIntensity={0.02}
      />
    </mesh>
  );
}
