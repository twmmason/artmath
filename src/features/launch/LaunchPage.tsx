import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/db";
import { useRocketState } from "../../mission/useRocketState";
import { destinationById } from "../../mission/destinations";
import { siteById } from "../../mission/launchSites";
import { simulateFlight } from "../../physics/simulateFlight";
import type { FlightResult } from "../../physics/types";
import { generateChecklist } from "../../engine";
import { makeRng } from "../../engine/rng";
import { TaskRenderer, type TaskResult } from "../../components/TaskRenderer";
import { RocketScene, captureCanvas } from "../../three/RocketScene";
import { LaunchAnimation, SHOT_NAMES } from "../../three/LaunchAnimation";
import { HAS_MAPS_KEY } from "../../three/GeoEnvironment";
import { SiteTerrain } from "../../three/SiteTerrain";
import { recordMission } from "../../mission/recordMission";
import { setLastFlight } from "../../mission/lastFlight";
import { xpForAnswer } from "../../engine/mastery";
import { sfx } from "../../mission/sound";

type Phase = "checklist" | "launching";

/** Pre-flight checklist → 3D launch sequence → after-action report. */
export function LaunchPage() {
  const profile = useRocketState((s) => s.profile);
  const design = useRocketState((s) => s.design);
  const mission = useRocketState((s) => s.mission);
  const recordTaskResult = useRocketState((s) => s.recordTaskResult);
  const completeChecklist = useRocketState((s) => s.completeChecklist);
  const clearMission = useRocketState((s) => s.clearMission);
  const addXp = useRocketState((s) => s.addXp);
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("checklist");
  const [idx, setIdx] = useState(0);
  const [passed, setPassed] = useState<boolean[]>([]);
  const [flight, setFlight] = useState<FlightResult | null>(null);
  const [recording, setRecording] = useState(false);
  const [shotOverride, setShotOverride] = useState<number | null>(null);
  const [shotLabel, setShotLabel] = useState<string>("📺 Auto director");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const savedRef = useRef(false);

  const dest = destinationById(mission?.destinationId ?? "orbit");
  const site = siteById(profile?.launchSiteId ?? "canaveral");
  const checklist = useMemo(
    () => generateChecklist(makeRng(Date.now() % 2147483647), Math.max(1, dest.tierRange[0])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!profile) navigate("/");
  }, [profile, navigate]);

  if (!profile) return null;

  const handleChecklistResolve = async (result: TaskResult) => {
    const task = checklist[idx];
    await db.attempts.add({
      profileId: profile.id,
      criterionCode: task.criterionCode,
      tier: task.tier,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      createdAt: Date.now(),
    });
    recordTaskResult(result.correct, result.firstTry);
    addXp(xpForAnswer(task.tier, result.hintsUsed, result.correct));
    setPassed((p) => [...p, result.correct]);
    if (idx + 1 < checklist.length) {
      setIdx(idx + 1);
    } else {
      completeChecklist();
      const correct = (mission?.tasksCorrect ?? 0) + (result.correct ? 1 : 0);
      const total = (mission?.tasksTotal ?? 0) + 1;
      const quality = total > 0 ? correct / total : 1;
      const f = simulateFlight(design, dest.targetAltitudeKm, quality);
      setFlight(f);
      setPhase("launching");
      sfx.launch();
    }
  };

  const finishFlight = async (f: FlightResult) => {
    if (savedRef.current) return;
    savedRef.current = true;
    const screenshot = captureCanvas(canvasRef.current);
    const tasksCorrect = mission?.tasksCorrect ?? 0;
    const tasksTotal = mission?.tasksTotal ?? 0;
    const { record, newPatches } = await recordMission(
      profile,
      dest.id,
      tasksCorrect,
      tasksTotal,
      f,
      mission?.firstTryAll ?? false,
      screenshot,
    );
    setLastFlight({
      flight: f,
      missionId: record.id,
      destinationId: dest.id,
      tasksCorrect,
      tasksTotal,
      newPatches,
    });
    clearMission();
    navigate("/report");
  };

  const toggleRecording = () => {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const stream = canvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "launch-film.webm";
        a.click();
        URL.revokeObjectURL(url);
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      // recording unsupported — non-fatal
    }
  };

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      {phase === "checklist" ? (
        <div className="mx-auto flex h-full max-w-xl flex-col justify-center gap-3 p-6">
          <h2 className="text-center font-display text-2xl font-bold tracking-widest text-cyan-300">
            ✅ PRE-FLIGHT CHECKLIST
          </h2>
          <div className="flex justify-center gap-2">
            {checklist.map((_, i) => (
              <span
                key={i}
                className={`text-xl transition ${
                  i < passed.length ? (passed[i] ? "opacity-100" : "opacity-60") : "opacity-25"
                }`}
              >
                {i < passed.length ? (passed[i] ? "✅" : "🟡") : "⬜"}
              </span>
            ))}
          </div>
          <div className="hud-panel p-4">
            <TaskRenderer
              key={checklist[idx].id}
              task={checklist[idx]}
              profileName={profile.name}
              onResolve={handleChecklistResolve}
            />
          </div>
        </div>
      ) : (
        flight && (
          <>
            <RocketScene
              cameraPosition={[16, 10, 20]}
              target={[0, 6, 0]}
              onCanvasReady={(c) => (canvasRef.current = c)}
              geoSite={site}
              controlsEnabled={false}
            >
              <SiteTerrain site={site} ground={!HAS_MAPS_KEY} />
              <LaunchAnimation
                design={design}
                flight={flight}
                shotOverride={shotOverride}
                onShot={(l) => setShotLabel(shotOverride === null ? `${l} (auto)` : l)}
                onComplete={() => void finishFlight(flight)}
              />
            </RocketScene>
            <button
              onClick={() =>
                setShotOverride((cur) => {
                  const next = cur === null ? 0 : cur + 1;
                  if (next >= SHOT_NAMES.length) {
                    setShotLabel("📺 Auto director");
                    return null;
                  }
                  setShotLabel(SHOT_NAMES[next]);
                  return next;
                })
              }
              className="absolute left-4 top-4 z-30 rounded-full border border-cyan-600/50 bg-space-900/90 px-3 py-1.5 text-xs text-cyan-200"
            >
              {shotLabel} — tap to switch
            </button>
            <button
              onClick={toggleRecording}
              className={`absolute right-4 top-4 z-30 rounded-full border px-3 py-1.5 text-xs ${
                recording
                  ? "border-red-500 bg-red-600/30 text-red-200 animate-pulse"
                  : "border-cyan-600/50 bg-space-900/90 text-cyan-200"
              }`}
            >
              🎬 {recording ? "Stop & save film" : "Record launch film"}
            </button>
          </>
        )
      )}
    </div>
  );
}