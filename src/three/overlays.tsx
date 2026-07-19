import { Html } from "@react-three/drei";

/** Small HUD label pinned in 3D space. */
export function SceneLabel({
  position,
  text,
}: {
  position: [number, number, number];
  text: string;
}) {
  return (
    <Html center position={position} zIndexRange={[5, 0]}>
      <div className="whitespace-nowrap rounded border border-cyan-500/40 bg-space-900/80 px-2 py-0.5 text-[11px] text-cyan-200">
        {text}
      </div>
    </Html>
  );
}
