import type { LaunchSite } from "../mission/launchSites";

const TERRAIN_COLORS: Record<LaunchSite["terrain"], string> = {
  coastal: "#2e4a3f",
  steppe: "#5a5136",
  jungle: "#1f4a2a",
  island: "#31514a",
};

/**
 * Stylised ground for the chosen launch site. (The Google Photorealistic 3D
 * Tiles integration is the Phase 7 upgrade path; this offline fallback keeps
 * launches working with no network — the launch is never blocked on tiles.)
 */
export function SiteTerrain({ site }: { site: LaunchSite }) {
  const color = TERRAIN_COLORS[site.terrain];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[120, 48]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      {/* concrete pad + blast deflector */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#67707f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[3.4, 3.8, 0.3, 24]} />
        <meshStandardMaterial color="#4c5563" roughness={0.85} />
      </mesh>
      {/* service tower */}
      <group position={[4, 0, 0]}>
        <mesh position={[0, 6, 0]} castShadow>
          <boxGeometry args={[0.8, 12, 0.8]} />
          <meshStandardMaterial color="#8b2d2d" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[-1.2, 9, 0]}>
          <boxGeometry args={[2.4, 0.2, 0.2]} />
          <meshStandardMaterial color="#8b2d2d" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>
      {/* ocean/horizon flavour for coastal & island sites */}
      {(site.terrain === "coastal" || site.terrain === "island") && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[80, -0.2, 0]}>
          <circleGeometry args={[100, 32]} />
          <meshStandardMaterial color="#123a5e" roughness={0.3} metalness={0.1} />
        </mesh>
      )}
    </group>
  );
}
