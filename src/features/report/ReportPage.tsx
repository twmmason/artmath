import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRocketState } from "../../mission/useRocketState";
import { getLastFlight } from "../../mission/lastFlight";
import { destinationById } from "../../mission/destinations";
import { siteById } from "../../mission/launchSites";
import { narrateDebrief } from "../../ai/debrief";
import { fallbackDebrief, fallbackMilestone } from "../../ai/fallbacks";
import { patchById } from "../../mission/patches";

/** After-action report: what maths flew this mission + flight replay plot. */
export function ReportPage() {
  const profile = useRocketState((s) => s.profile);
  const [debrief, setDebrief] = useState<string | null>(null);
  const navigate = useNavigate();
  const last = getLastFlight();

  useEffect(() => {
    if (!profile || !last) return;
    const dest = destinationById(last.destinationId);
    const site = siteById(profile.launchSiteId);
    setDebrief(
      fallbackDebrief(
        profile.name,
        dest.name,
        last.tasksCorrect,
        last.tasksTotal,
        last.flight.maxAltitudeKm,
        last.flight.reached,
      ),
    );
    void narrateDebrief({
      profileName: profile.name,
      destinationName: dest.name,
      siteName: site.name,
      tasksCorrect: last.tasksCorrect,
      tasksTotal: last.tasksTotal,
      maxAltitudeKm: last.flight.maxAltitudeKm,
      reached: last.flight.reached,
      eventLabels: last.flight.events.map((e) => e.label),
    }).then(setDebrief);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile) return null;
  if (!last) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
        <p className="text-slate-400">No flight on record yet, Commander.</p>
        <button onClick={() => navigate("/hangar")} className="rounded bg-cyan-500 px-4 py-2 font-bold text-black">
          Back to the Hangar
        </button>
      </div>
    );
  }
  const dest = destinationById(last.destinationId);
  const samples = last.flight.samples;
  const maxAlt = Math.max(last.flight.maxAltitudeKm, 1);
  const maxT = samples.length ? samples[samples.length - 1].t : 1;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-center font-display text-3xl font-bold tracking-widest text-cyan-300">
        📋 AFTER-ACTION REPORT
      </h1>
      <div className="text-center text-sm text-slate-400">
        {profile.name}'s Rocket Lab · Mission to {dest.emoji} {dest.name}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Peak altitude", `${Math.round(last.flight.maxAltitudeKm)} km`],
          ["Target", `${dest.targetAltitudeKm} km`],
          ["Tasks certified", `${last.tasksCorrect}/${last.tasksTotal}`],
          ["Outcome", last.flight.reached ? "ARRIVED 🎉" : "VALUABLE DATA 📡"],
        ].map(([k, v]) => (
          <div key={k} className="hud-panel p-3 text-center">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{k}</div>
            <div className="mt-1 font-display text-lg font-bold text-cyan-200">{v}</div>
          </div>
        ))}
      </div>

      {/* flight replay: altitude vs time */}
      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold tracking-widest text-cyan-300">🛰 FLIGHT REPLAY</div>
        <svg viewBox="0 0 400 120" className="w-full">
          <line x1="0" y1="119" x2="400" y2="119" stroke="#164e63" />
          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            points={samples
              .map((s) => `${(s.t / maxT) * 400},${118 - (s.altitudeKm / maxAlt) * 110}`)
              .join(" ")}
          />
          <line
            x1="0"
            x2="400"
            y1={118 - (dest.targetAltitudeKm / maxAlt) * 110}
            y2={118 - (dest.targetAltitudeKm / maxAlt) * 110}
            stroke="#fbbf24"
            strokeDasharray="6 4"
          />
        </svg>
        <div className="mt-2 space-y-1 text-xs text-slate-300">
          {last.flight.events.map((e, i) => (
            <div key={i}>• T+{Math.round(e.t)}s — {e.label}</div>
          ))}
        </div>
      </div>

      {/* Flight Director debrief (§5a #3) */}
      <div className="hud-panel border-cyan-400/40 p-4">
        <div className="mb-1 text-xs font-bold tracking-widest text-cyan-300">
          🎧 FLIGHT DIRECTOR DEBRIEF
        </div>
        <p className="text-sm leading-relaxed text-cyan-100">{debrief ?? "…"}</p>
      </div>

      {last.newPatches.length > 0 && (
        <div className="hud-panel border-amber-400/40 p-4">
          <div className="mb-2 text-xs font-bold tracking-widest text-amber-300">
            🏅 NEW MISSION PATCHES
          </div>
          {last.newPatches.map((id) => {
            const p = patchById(id);
            return (
              p && (
                <div key={id} className="text-sm text-amber-100">
                  {p.emoji} <b>{p.name}</b> — {fallbackMilestone(p.description.toLowerCase())}
                </div>
              )
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button onClick={() => navigate("/hangar")} className="rounded-lg bg-cyan-500 px-5 py-2 font-bold text-black hover:bg-cyan-400">
          🏠 Back to the Hangar
        </button>
        <button onClick={() => navigate("/flightlog")} className="rounded-lg border border-cyan-600/50 px-5 py-2 text-cyan-200 hover:bg-space-700">
          📖 Flight Log
        </button>
      </div>
    </div>
  );
}