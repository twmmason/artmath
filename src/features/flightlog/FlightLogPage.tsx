import { useEffect, useState } from "react";
import { db, type Attempt, type MissionRecord } from "../../db/db";
import { telemetryInsight } from "../../ai/telemetryInsights";
import { useRocketState } from "../../mission/useRocketState";
import { CRITERIA } from "../../curriculum/criteria";
import { KS2_STRANDS, KS3_STRANDS, type Strand } from "../../curriculum/types";
import { masteryForCriterion } from "../../engine/mastery";
import { destinationById } from "../../mission/destinations";
import { siteById } from "../../mission/launchSites";
import { PATCHES } from "../../mission/patches";
import { STATIONS } from "../../mission/stations";

const STRAND_LABELS: Record<string, string> = {
  NPV: "Place Value", NF: "Number Facts", AS: "Add/Subtract",
  MD: "Multiply/Divide", F: "Fractions", G: "Geometry",
  KS3N: "Number", KS3A: "Algebra", KS3R: "Ratio", KS3G: "Geometry",
  KS3P: "Probability", KS3S: "Statistics",
};

/** Telemetry console: coverage maps, mission history, patches, scrapbook. */
export function FlightLogPage() {
  const profile = useRocketState((s) => s.profile);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [missions, setMissions] = useState<MissionRecord[]>([]);
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    void db.attempts.where("profileId").equals(profile.id).toArray().then(setAttempts);
    void db.missions.where("profileId").equals(profile.id).reverse().sortBy("createdAt").then((ms) => {
      setMissions(ms);
      void telemetryInsight(profile.id, profile.name, ms).then(setInsight);
    });
  }, [profile?.id]);

  if (!profile) return null;

  const cell = (code: string) => {
    const m = masteryForCriterion(code, attempts);
    return m.mastered
      ? "bg-emerald-500/70"
      : m.attempts > 0
        ? "bg-amber-500/50"
        : "bg-space-700";
  };

  const strandRow = (strand: Strand) => {
    const crits = CRITERIA.filter((c) => c.strand === strand);
    return (
      <div key={strand} className="flex items-center gap-2">
        <span className="w-28 text-[10px] text-slate-400">{STRAND_LABELS[strand]}</span>
        <div className="flex flex-wrap gap-1">
          {crits.map((c) => (
            <div key={c.code} title={`${c.code}: ${c.description}`} className={`h-4 w-4 rounded-sm ${cell(c.code)}`} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-center font-display text-3xl font-bold tracking-widest text-cyan-300">
        📖 {profile.name.toUpperCase()}'S FLIGHT LOG
      </h1>

      {insight && (
        <div className="hud-panel border-violet-500/40 p-4 text-sm text-violet-100">
          <div className="mb-1 text-xs font-bold tracking-widest text-violet-300">📡 TELEMETRY INSIGHT</div>
          {insight}
        </div>
      )}

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold tracking-widest text-cyan-300">🗺 KS2 SYSTEMS COVERAGE (81 criteria)</div>
        <div className="space-y-1.5">{KS2_STRANDS.map(strandRow)}</div>
      </div>

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold tracking-widest text-violet-300">🛰 KS3 DOMAIN × STATION COVERAGE (65 criteria)</div>
        <div className="space-y-1.5">
          {KS3_STRANDS.map((s) => {
            const st = STATIONS.find((x) => x.ks3Strand === s);
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="w-28 text-[10px] text-slate-400">{st?.emoji} {st?.name}</span>
                <div className="flex flex-wrap gap-1">
                  {CRITERIA.filter((c) => c.strand === s).map((c) => (
                    <div key={c.code} title={`${c.code}: ${c.description}`} className={`h-4 w-4 rounded-sm ${cell(c.code)}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-3 text-[10px] text-slate-400">
          <span><span className="inline-block h-3 w-3 rounded-sm bg-emerald-500/70 align-middle" /> mastered</span>
          <span><span className="inline-block h-3 w-3 rounded-sm bg-amber-500/50 align-middle" /> in progress</span>
          <span><span className="inline-block h-3 w-3 rounded-sm bg-space-700 align-middle" /> not started</span>
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold tracking-widest text-amber-300">🏅 MISSION PATCHES</div>
        <div className="flex flex-wrap gap-2">
          {PATCHES.map((p) => {
            const earned = profile.patches.includes(p.id);
            return (
              <div key={p.id} title={p.description} className={`rounded-lg border px-3 py-2 text-center text-xs ${earned ? "border-amber-400/60 bg-amber-500/10 text-amber-200" : "border-slate-700 bg-space-900/60 text-slate-600"}`}>
                <div className="text-xl">{earned ? p.emoji : "🔒"}</div>
                {p.name}
              </div>
            );
          })}
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold tracking-widest text-cyan-300">🚀 MISSION HISTORY & SCRAPBOOK</div>
        {missions.length === 0 && <div className="text-xs text-slate-500">No launches yet — the pad is waiting, Commander.</div>}
        <div className="space-y-2">
          {missions.map((m) => {
            const d = destinationById(m.destinationId);
            return (
              <div key={m.id} className="flex items-center gap-3 rounded border border-cyan-900/40 bg-space-900/60 p-2 text-xs">
                {m.screenshot && <img src={m.screenshot} alt="mission" className="h-14 w-20 rounded object-cover" />}
                <div className="flex-1">
                  <div className="font-bold text-cyan-100">{d.emoji} {d.name} {m.reachedDestination ? "· ARRIVED 🎉" : ""}</div>
                  <div className="text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString("en-GB")} · {Math.round(m.maxAltitudeKm)} km ·
                    tasks {m.tasksCorrect}/{m.tasksTotal}
                    {m.launchSiteId ? ` · from ${siteById(m.launchSiteId).name}` : ""}
                  </div>
                </div>
                {(m.photos ?? []).slice(0, 3).map((ph, i) => (
                  <img key={i} src={ph} alt="mission photo" className="h-14 w-14 rounded object-cover" />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
