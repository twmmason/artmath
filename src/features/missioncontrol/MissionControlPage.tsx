import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db, type Attempt } from "../../db/db";
import { useRocketState } from "../../mission/useRocketState";
import { stationUnlocks } from "../../engine/mastery";
import { RocketScene } from "../../three/RocketScene";
import { MissionControlWing } from "../../three/MissionControlWing";
import { StationPanel } from "./StationPanel";
import type { MissionStation } from "../../engine/types";

/** KS3 Advanced Programme — the six-station Mission Control wing (§3i–3n). */
export function MissionControlPage() {
  const profile = useRocketState((s) => s.profile);
  const mission = useRocketState((s) => s.mission);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [missionCount, setMissionCount] = useState(0);
  const [selected, setSelected] = useState<MissionStation | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sciencePhase = params.get("phase") === "science";

  const load = () => {
    if (!profile) return;
    void db.attempts.where("profileId").equals(profile.id).toArray().then(setAttempts);
    void db.missions.where("profileId").equals(profile.id).count().then(setMissionCount);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [profile?.id]);

  if (!profile) return null;
  const unlocks = stationUnlocks(attempts, missionCount, profile.academyUnlocked);
  const scienceNeeded = Math.max(3, mission?.plan?.stationTasks.length ?? 3);
  const scienceDone = mission?.stationTasksDone ?? 0;

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="relative min-w-0 flex-1">
        <RocketScene cameraPosition={[0, 16, 26]} target={[0, 2, 0]}>
          <MissionControlWing
            unlocks={unlocks}
            selected={selected}
            onSelect={(s) => {
              const state = unlocks.find((u) => u.station === s);
              if (state?.unlocked) setSelected(s);
            }}
          />
        </RocketScene>
        <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full border border-violet-500/50 bg-space-900/90 px-4 py-1.5 text-xs text-violet-200">
          🛰 MISSION CONTROL WING — KS3 Advanced Programme
        </div>
        {sciencePhase && (
          <div className="absolute left-1/2 top-12 z-30 -translate-x-1/2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
            <div className="font-bold">MISSION SCIENCE PACKAGE</div>
            <div>
              Complete {scienceNeeded} station tasks to clear the science phase — {scienceDone}/{scienceNeeded} done
            </div>
            {scienceDone >= scienceNeeded && (
              <button
                onClick={() => navigate("/vab")}
                className="mt-1 rounded bg-amber-400 px-3 py-1 font-bold text-black hover:bg-amber-300"
              >
                Science complete → Enter the VAB
              </button>
            )}
          </div>
        )}
        <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 flex flex-wrap justify-center gap-1.5 text-[10px]">
          {unlocks.map((u) => (
            <div
              key={u.station}
              className={`rounded px-2 py-1 ${
                u.unlocked
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-space-900/90 text-amber-500/80"
              }`}
              title={u.requirement}
            >
              {u.station} {u.unlocked ? "⚡ ONLINE" : `🔌 ${Math.round(u.progress * 100)}%`}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="z-30 w-96 shrink-0 border-l border-violet-900/40 bg-space-900/90 p-3">
          <StationPanel
            station={selected}
            attempts={attempts}
            onDone={() => setSelected(null)}
            onAttemptSaved={load}
          />
        </div>
      )}
    </div>
  );
}