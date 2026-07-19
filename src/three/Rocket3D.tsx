import type { RocketDesign, RocketPart } from "./rocketDesign";
import { NoseCone3D, noseConeHeight } from "./NoseCone3D";
import { Hull3D } from "./Hull3D";
import { FuelTank3D } from "./FuelTank3D";
import { Engine3D, ENGINE_HEIGHT } from "./Engine3D";
import { Fins3D } from "./Fins3D";
import { PayloadBay3D, BAY_HEIGHT } from "./PayloadBay3D";
import { ElectronicsBay3D } from "./ElectronicsBay3D";
import { Booster3D } from "./Booster3D";

export interface Rocket3DProps {
  design: RocketDesign;
  /** if true, only render parts present in design.installedParts (VAB mode) */
  assemblyMode?: boolean;
  selectedPart?: RocketPart | null;
  onPartClick?: (part: RocketPart) => void;
  partLevels?: Partial<Record<RocketPart, 1 | 2 | 3>>;
  flame?: number;
  boosterSeparation?: number;
}

/** Parametric 3D rocket assembled from individual part components. */
export function Rocket3D({
  design,
  assemblyMode,
  selectedPart,
  onPartClick,
  partLevels,
  flame = 0,
  boosterSeparation = 0,
}: Rocket3DProps) {
  const has = (part: RocketPart) =>
    assemblyMode ? Boolean(design.installedParts[part]) : true;
  const isDraft = (part: RocketPart) =>
    assemblyMode ? !design.installedParts[part]?.certified : false;
  const lvl = (part: RocketPart) => partLevels?.[part] ?? 1;

  const tankH = design.hullHeight * 0.45;
  const hullH = design.hullHeight * 0.55;
  let y = 0;
  const engineY = y;
  y += has("engine") ? ENGINE_HEIGHT : 0.2;
  const tankY = y;
  y += has("fuelTank") ? tankH : 0;
  const hullY = y;
  y += has("hull") ? hullH : 0;
  const bayY = y;
  y += has("payloadBay") ? BAY_HEIGHT : 0;
  const noseY = y;
  const totalH = y + (has("noseCone") ? noseConeHeight(design) : 0);
  void totalH;

  return (
    <group>
      {has("engine") && (
        <Engine3D
          design={design}
          y={engineY}
          draft={isDraft("engine")}
          selected={selectedPart === "engine"}
          onClick={onPartClick}
          level={lvl("engine")}
          flame={flame}
        />
      )}
      {has("fuelTank") && (
        <FuelTank3D
          design={design}
          y={tankY}
          height={tankH}
          draft={isDraft("fuelTank")}
          selected={selectedPart === "fuelTank"}
          onClick={onPartClick}
          level={lvl("fuelTank")}
        />
      )}
      {has("hull") && (
        <Hull3D
          design={design}
          y={hullY}
          height={hullH}
          draft={isDraft("hull")}
          selected={selectedPart === "hull"}
          onClick={onPartClick}
          level={lvl("hull")}
        />
      )}
      {has("payloadBay") && (
        <PayloadBay3D
          design={design}
          y={bayY}
          draft={isDraft("payloadBay")}
          selected={selectedPart === "payloadBay"}
          onClick={onPartClick}
          level={lvl("payloadBay")}
        />
      )}
      {has("noseCone") && (
        <NoseCone3D
          design={design}
          y={noseY}
          draft={isDraft("noseCone")}
          selected={selectedPart === "noseCone"}
          onClick={onPartClick}
          level={lvl("noseCone")}
        />
      )}
      {has("fins") && (
        <Fins3D
          design={design}
          y={tankY}
          draft={isDraft("fins")}
          selected={selectedPart === "fins"}
          onClick={onPartClick}
          level={lvl("fins")}
        />
      )}
      {has("electronics") && (
        <ElectronicsBay3D
          design={design}
          y={hullY + hullH * 0.5}
          draft={isDraft("electronics")}
          selected={selectedPart === "electronics"}
          onClick={onPartClick}
          level={lvl("electronics")}
        />
      )}
      {has("booster") && design.boosterCount > 0 && boosterSeparation < 1 && (
        <Booster3D
          design={design}
          y={engineY}
          draft={isDraft("booster")}
          selected={selectedPart === "booster"}
          onClick={onPartClick}
          level={lvl("booster")}
          separation={boosterSeparation}
        />
      )}
    </group>
  );
}

export function rocketTotalHeight(design: RocketDesign): number {
  return (
    ENGINE_HEIGHT +
    design.hullHeight * 0.45 +
    design.hullHeight * 0.55 +
    BAY_HEIGHT +
    noseConeHeight(design)
  );
}
