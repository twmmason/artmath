import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, type Attempt } from "../../db/db";
import { useRocketState, allPartsCertified } from "../../mission/useRocketState";
import { planMission } from "../../mission/runPlanner";
import { destinationById } from "../../mission/destinations";
import { siteById } from "../../mission/launchSites";
import { partLevel } from "../../engine/mastery";
import { RocketScene } from "../../three/RocketScene";
import { Rocket3D } from "../../three/Rocket3D";
import { AttachmentNodes } from "../../three/AttachmentNodes";
import { SiteTerrain } from "../../three/SiteTerrain";
import { PartsTray } from "./PartsTray";
import { StagePanel } from "./StagePanel";
import { PerformanceDashboard } from "../../components/PerformanceDashboard";
import { ALL_PARTS, PART_EMOJI, PART_LABELS, type RocketPart } from "../../three/rocketDesign";

/** Vehicle Assembly Building — Kerbal-style free assembly (§5). */
export function VABPage() {
  const profile = useRocketState((s) => s.profile);
  const design = useRocketState((s) => s.design);
  const mission = useRocketState((s) => s.mission);
  const selectedPart = useRocketState((s) => s.selectedPart);
  const selectPart = useRocketState((s) => s.selectPart);
  const startMission = useRocketState((s) => s.startMission);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    void db.attempts.where("profileId").equals(profile.id).toArray().then(setAttempts);
  }, [profile?.id, panelOpen]);

  // ensure a mission exists (direct nav to /vab)
  useEffect(() => {
    if (!profile || mission) return;
    void (async () => {
      const atts = await db.attempts.where("profileId").equals(profile.id).toArray();
      const count = await db.missions.where("profileId").equals(profile.id).count();
      startMission("orbit", planMission(destinationById("orbit"), atts, count));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  if (!profile) return null;
  const site = siteById(profile.launchSiteId);
  const partLevels = Object.fromEntries(
    ALL_PARTS.map((p) => [p, partLevel(p, attempts)]),
  ) as Record<RocketPart, 1 | 2 | 3>;
  const dest = destinationById(mission?.destinationId ?? "orbit");
  const installed = ALL_PARTS.filter((p) => design.installedParts[p]);
  const readyForFlight = allPartsCertified(design);

  const onPartClick = (part: RocketPart) => {
    selectPart(part);
    setPanelOpen(true);
  };

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)]">
      {/* parts tray */}
      <div className="z-30 w-60 shrink-0 border-r border-cyan-900/40 bg-space-900/80 p-3">
        <PartsTray partLevels={partLevels} />
      </div>

      {/* 3D assembly floor */}
      <div className="relative flex-1">
        <RocketScene cameraPosition={[11, 8, 13]} target={[0, 5, 0]}>
          <SiteTerrain site={site} />
          <Rocket3D
            design={design}
            assemblyMode
            selectedPart={selectedPart}
            onPartClick={onPartClick}
            partLevels={partLevels}
          />
          <AttachmentNodes design={design} onNodeClick={onPartClick} />
        </RocketScene>

        {/* mission strip */}
        <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full border border-cyan-600/50 bg-space-900/90 px-4 py-1.5 text-xs text-cyan-200">
          Mission: {dest.emoji} {dest.name} · tasks {mission?.tasksCorrect ?? 0}/{mission?.tasksTotal ?? 0} certified
        </div>

        {/* certification board */}
        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-xl border border-cyan-800/50 bg-space-900/90 px-3 py-2">
          {installed.length === 0 && (
            <span className="text-xs text-slate-400">
              Drag or click parts from the catalogue to start building →
            </span>
          )}
          {installed.map((p) => {
            const cert = design.installedParts[p]?.certified;
            return (
              <button
                key={p}
                onClick={() => onPartClick(p)}
                className={`rounded-lg px-2 py-1 text-xs ${
                  cert
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                    : "bg-amber-500/15 text-amber-300 border border-amber-600/40 animate-pulse"
                } ${selectedPart === p ? "ring-2 ring-cyan-400" : ""}`}
              >
                {PART_EMOJI[p]} {PART_LABELS[p]} {cert ? "✅" : "⬜ DRAFT"}
              </button>
            );
          })}
          {installed.length > 0 && (
            <button
              onClick={() => readyForFlight && navigate("/launch")}
              disabled={!readyForFlight}
              className={`ml-2 rounded-lg px-3 py-1 text-xs font-bold ${
                readyForFlight
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-space-700 text-slate-500"
              }`}
              title={readyForFlight ? "" : "Certify every attached part first"}
            >
              ✅ Pre-flight → 🚀 Launch
            </button>
          )}
        </div>

        {/* performance dashboard */}
        <div className="absolute right-3 top-3 z-30 w-72">
          <PerformanceDashboard design={design} />
        </div>
      </div>

      {/* stage panel (engineering tasks) */}
      {panelOpen && selectedPart && design.installedParts[selectedPart] && (
        <div className="z-30 w-96 shrink-0 border-l border-cyan-900/40 bg-space-900/90 p-3">
          <StagePanel
            part={selectedPart}
            onCertified={() => setPanelOpen(false)}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
}