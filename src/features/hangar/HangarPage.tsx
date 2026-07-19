import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, type Attempt } from "../../db/db";
import { useRocketState } from "../../mission/useRocketState";
import { DESTINATIONS } from "../../mission/destinations";
import { siteById } from "../../mission/launchSites";
import { planMission } from "../../mission/runPlanner";
import { destinationUnlocked, ks2Mastery, ks3Mastery, partLevel } from "../../engine/mastery";
import { RocketScene } from "../../three/RocketScene";
import { Rocket3D } from "../../three/Rocket3D";
import { SiteTerrain } from "../../three/SiteTerrain";
import { SitePicker } from "./SitePicker";
import { ALL_PARTS, type RocketPart } from "../../three/rocketDesign";

/** Home: the commander's rocket on the pad + destination picker. */
export function HangarPage() {
  const profile = useRocketState((s) => s.profile);
  const design = useRocketState((s) => s.design);
  const startMission = useRocketState((s) => s.startMission);
  const restoreMission = useRocketState((s) => s.restoreMission);
  const mission = useRocketState((s) => s.mission);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [missionCount, setMissionCount] = useState(0);
  const [showSites, setShowSites] = useState(false);
  const [firstVisit, setFirstVisit] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    void db.attempts.where("profileId").equals(profile.id).toArray().then(setAttempts);
    void db.missions.where("profileId").equals(profile.id).count().then((c) => {
      setMissionCount(c);
      setFirstVisit(c === 0 && attempts.length === 0 && profile.xp === 0);
    });
    void db.missionSaves.where("profileId").equals(profile.id).first().then((s) => setHasSave(Boolean(s)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  if (!profile) return null;
  const site = siteById(profile.launchSiteId);
  const partLevels = Object.fromEntries(
    ALL_PARTS.map((p) => [p, partLevel(p, attempts)]),
  ) as Record<RocketPart, 1 | 2 | 3>;

  const begin = (destId: string) => {
    const dest = DESTINATIONS.find((d) => d.id === destId)!;
    const plan = planMission(dest, attempts, missionCount);
    startMission(destId, plan);
    if (dest.ks3) navigate("/missioncontrol?phase=science");
    else navigate("/vab");
  };

  const resume = async () => {
    const save = await db.missionSaves.where("profileId").equals(profile.id).first();
    if (!save) return;
    try {
      const { mission: m, design: d } = JSON.parse(save.state);
      restoreMission(m, d);
      navigate("/vab");
    } catch {
      setHasSave(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <RocketScene autoRotate cameraPosition={[14, 9, 16]}>
        <SiteTerrain site={site} />
        <Rocket3D design={design} partLevels={partLevels} />
      </RocketScene>

      {/* HUD overlays */}
      <div className="absolute left-4 top-4 z-30 w-64 space-y-3">
        <div className="hud-panel p-3 text-xs">
          <div className="font-bold text-cyan-300">🌍 LAUNCH SITE</div>
          <div className="mt-1 text-cyan-100">{site.country} {site.name}</div>
          <div className="text-slate-400">{site.description}</div>
          <button
            onClick={() => setShowSites(true)}
            className="mt-2 rounded border border-cyan-600/50 px-2 py-1 text-cyan-300 hover:bg-space-700"
          >
            change site
          </button>
        </div>
        <div className="hud-panel p-3 text-xs">
          <div className="font-bold text-cyan-300">📈 PROGRAMME STATUS</div>
          <div className="mt-1 text-slate-300">
            KS2 systems mastered: {Math.round(ks2Mastery(attempts) * 100)}%
          </div>
          <div className="text-slate-300">
            KS3 systems mastered: {Math.round(ks3Mastery(attempts) * 100)}%
          </div>
          <div className="text-slate-300">Missions flown: {missionCount}</div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-30 w-72 space-y-2">
        <div className="hud-panel p-3">
          <div className="mb-2 text-xs font-bold tracking-widest text-cyan-300">
            🪐 PICK A DESTINATION
          </div>
          <div className="space-y-1.5">
            {DESTINATIONS.map((d) => {
              const unlocked = destinationUnlocked(d.id, attempts, missionCount);
              return (
                <button
                  key={d.id}
                  disabled={!unlocked}
                  onClick={() => begin(d.id)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    unlocked
                      ? "border-cyan-600/50 bg-space-800/70 text-cyan-100 hover:border-cyan-400 hover:bg-space-700"
                      : "border-slate-700/50 bg-space-900/60 text-slate-600"
                  }`}
                >
                  <span className="text-xl">{d.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-bold">{d.name}</span>
                    <span className="block text-[10px] text-slate-400">
                      {unlocked ? d.description : `🔒 ${d.unlockHint}`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {(hasSave || mission) && (
          <button
            onClick={() => (mission ? navigate("/vab") : void resume())}
            className="w-full rounded-lg border border-amber-500/60 bg-amber-500/15 px-3 py-2 text-sm font-bold text-amber-300 hover:bg-amber-500/25"
          >
            ▶ Resume mission in progress
          </button>
        )}
        <button
          onClick={() => begin("orbit")}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-display text-lg font-bold text-white shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:bg-red-500"
        >
          🏗 ENTER THE VAB
        </button>
        <button
          onClick={() => navigate("/missioncontrol")}
          className="w-full rounded-lg border border-violet-500/50 bg-violet-500/10 px-3 py-2 text-sm text-violet-200 hover:bg-violet-500/20"
        >
          🛰 Mission Control Wing (KS3 Advanced Programme)
        </button>
      </div>

      {(showSites || firstVisit) && (
        <SitePicker
          onClose={() => {
            setShowSites(false);
            setFirstVisit(false);
          }}
        />
      )}
    </div>
  );
}