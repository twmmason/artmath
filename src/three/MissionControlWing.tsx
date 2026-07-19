import { Html } from "@react-three/drei";
import type { MissionStation } from "../engine/types";
import { STATIONS } from "../mission/stations";
import type { StationUnlockState } from "../engine/mastery";

interface Props {
  unlocks: StationUnlockState[];
  selected: MissionStation | null;
  onSelect: (s: MissionStation) => void;
}

/** The KS3 wing: six specialist station consoles arranged in an arc. */
export function MissionControlWing({ unlocks, selected, onSelect }: Props) {
  return (
    <group>
      {/* wing floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[24, 48]} />
        <meshStandardMaterial color="#141c33" roughness={0.8} metalness={0.2} />
      </mesh>
      {STATIONS.map((st, i) => {
        const a = (i / STATIONS.length) * Math.PI * 2;
        const x = Math.cos(a) * 12;
        const z = Math.sin(a) * 12;
        const state = unlocks.find((u) => u.station === st.id);
        const open = state?.unlocked ?? false;
        const isSel = selected === st.id;
        return (
          <group key={st.id} position={[x, 0, z]} rotation={[0, -a + Math.PI, 0]}>
            {/* console desk */}
            <mesh
              position={[0, 1, 0]}
              castShadow
              onClick={(e) => {
                e.stopPropagation();
                onSelect(st.id);
              }}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "default")}
            >
              <boxGeometry args={[3.4, 2, 1.4]} />
              <meshStandardMaterial
                color={open ? "#1d2a5e" : "#101423"}
                emissive={open ? (isSel ? "#22d3ee" : "#1b6f83") : "#442200"}
                emissiveIntensity={open ? (isSel ? 0.7 : 0.3) : 0.15}
                roughness={0.4}
                metalness={0.4}
              />
            </mesh>
            {/* screen */}
            <mesh position={[0, 2.6, 0]}>
              <boxGeometry args={[3, 1.4, 0.15]} />
              <meshStandardMaterial
                color={open ? "#0e2b3d" : "#0a0a12"}
                emissive={open ? "#22d3ee" : "#332211"}
                emissiveIntensity={open ? 0.6 : 0.08}
              />
            </mesh>
            <Html center position={[0, 4, 0]} zIndexRange={[5, 0]}>
              <button
                onClick={() => onSelect(st.id)}
                className={`whitespace-nowrap rounded-lg border px-3 py-1 text-xs font-display ${
                  open
                    ? "border-cyan-400/60 bg-space-800/90 text-cyan-200 hover:bg-space-700"
                    : "border-amber-700/60 bg-black/80 text-amber-500/80"
                }`}
              >
                {st.emoji} {st.name}
                {!open && (
                  <span className="block text-[10px] text-amber-600">
                    POWER OFFLINE — master more KS2 systems ({st.feedingStrands})
                  </span>
                )}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
