import { useEffect, useState } from "react";
import { CRITERIA, KS2_CRITERIA, KS3_CRITERIA } from "../../curriculum/criteria";
import { ALL_TEMPLATES, generateTask } from "../../engine";
import { db } from "../../db/db";
import { hasKey } from "../../ai/gemini";
import { STATIONS } from "../../mission/stations";
import { ALL_PARTS, PART_LABELS } from "../../three/rocketDesign";
import { PART_CRITERIA } from "../../mission/parts";

interface CoverageCell {
  code: string;
  ok: boolean;
  error?: string;
}

/** Dev-only status page: live 146-criteria coverage map + system status. */
export function DevStatusPage() {
  const [cells, setCells] = useState<CoverageCell[]>([]);
  const [profiles, setProfiles] = useState(0);

  useEffect(() => {
    const results: CoverageCell[] = CRITERIA.map((c) => {
      try {
        if (!ALL_TEMPLATES[c.code]) return { code: c.code, ok: false, error: "no template" };
        for (const tier of [1, 2, 3]) {
          const t = generateTask(c.code, tier, 42);
          if (!t.briefing || !t.answer) return { code: c.code, ok: false, error: "empty task" };
        }
        return { code: c.code, ok: true };
      } catch (e) {
        return { code: c.code, ok: false, error: String(e) };
      }
    });
    setCells(results);
    void db.profiles.count().then(setProfiles);
  }, []);

  const ok = (code: string) => cells.find((c) => c.code === code)?.ok;
  const ks2ok = KS2_CRITERIA.filter((c) => ok(c.code)).length;
  const ks3ok = KS3_CRITERIA.filter((c) => ok(c.code)).length;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6 text-sm">
      <h1 className="font-display text-2xl font-bold text-cyan-300">/dev/status</h1>
      <div className="hud-panel p-4 space-y-1 text-xs">
        <div>Coverage: KS2 {ks2ok}/81 {ks2ok === 81 ? "✅" : "❌"} · KS3 {ks3ok}/65 {ks3ok === 65 ? "✅" : "❌"} · total {ks2ok + ks3ok}/146</div>
        <div>DB: open, {profiles} profile(s) (nothing seeded by default ✅)</div>
        <div>Gemini key: {hasKey() ? "active ✅" : "fallback mode (no key) ⚠️"}</div>
        <div>Phase (PROGRESS.md): see repo root — Phases 1–8 implemented in this build</div>
      </div>

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold text-cyan-300">KS2 STRAND × YEAR GRID</div>
        <div className="grid grid-cols-12 gap-1">
          {KS2_CRITERIA.map((c) => (
            <div
              key={c.code}
              title={c.code}
              className={`rounded-sm px-1 py-0.5 text-center text-[8px] ${ok(c.code) ? "bg-emerald-500/60 text-black" : "bg-red-500/70 text-white"}`}
            >
              {c.code}
            </div>
          ))}
        </div>
      </div>

      <div className="hud-panel p-4">
        <div className="mb-2 text-xs font-bold text-violet-300">KS3 DOMAIN × STATION GRID</div>
        {STATIONS.map((st) => (
          <div key={st.id} className="mb-1 flex flex-wrap items-center gap-1">
            <span className="w-40 text-[10px] text-slate-400">{st.emoji} {st.name}</span>
            {KS3_CRITERIA.filter((c) => c.strand === st.ks3Strand).map((c) => (
              <div
                key={c.code}
                title={c.code}
                className={`rounded-sm px-1 py-0.5 text-[8px] ${ok(c.code) ? "bg-emerald-500/60 text-black" : "bg-red-500/70 text-white"}`}
              >
                {c.code.replace("KS3", "")}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hud-panel p-4 text-xs">
        <div className="mb-2 font-bold text-cyan-300">TEMPLATES PER PART</div>
        {ALL_PARTS.map((p) => (
          <div key={p} className="text-slate-300">
            {PART_LABELS[p]}: {PART_CRITERIA[p].length} criteria wired
          </div>
        ))}
      </div>

      {cells.filter((c) => !c.ok).length > 0 && (
        <div className="hud-panel border-red-500/50 p-4 text-xs text-red-300">
          {cells.filter((c) => !c.ok).map((c) => (
            <div key={c.code}>{c.code}: {c.error}</div>
          ))}
        </div>
      )}
    </div>
  );
}
