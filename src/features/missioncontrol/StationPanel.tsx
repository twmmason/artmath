import { useMemo, useState } from "react";
import type { MissionStation } from "../../engine/types";
import { stationById } from "../../mission/stations";
import { criteriaForStrand } from "../../curriculum/criteria";
import { generateTask } from "../../engine";
import { db, type Attempt } from "../../db/db";
import { masteryForCriterion, tierFor, xpForAnswer } from "../../engine/mastery";
import { useRocketState } from "../../mission/useRocketState";
import { TaskRenderer, type TaskResult } from "../../components/TaskRenderer";

interface Props {
  station: MissionStation;
  attempts: Attempt[];
  onDone: () => void;
  onAttemptSaved: () => void;
}

/** Task panel for a Mission Control station — reuses TaskRenderer (§3i–3n). */
export function StationPanel({ station, attempts, onDone, onAttemptSaved }: Props) {
  const profile = useRocketState((s) => s.profile);
  const applyEffect = useRocketState((s) => s.applyEffect);
  const recordStationTaskDone = useRocketState((s) => s.recordStationTaskDone);
  const addXp = useRocketState((s) => s.addXp);
  const [taskIndex, setTaskIndex] = useState(0);
  const config = stationById(station);

  const task = useMemo(() => {
    const codes = criteriaForStrand(config.ks3Strand).map((c) => c.code);
    const unmastered = codes.filter(
      (code) => !masteryForCriterion(code, attempts).mastered,
    );
    const pool = unmastered.length ? unmastered : codes;
    const code = pool[taskIndex % pool.length];
    return generateTask(code, tierFor(code, attempts), `${station}-${Date.now()}-${taskIndex}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station, taskIndex]);

  if (!profile) return null;

  const handleResolve = async (result: TaskResult) => {
    await db.attempts.add({
      profileId: profile.id,
      criterionCode: task.criterionCode,
      tier: task.tier,
      correct: result.correct,
      hintsUsed: result.hintsUsed,
      createdAt: Date.now(),
    });
    addXp(xpForAnswer(task.tier, result.hintsUsed, result.correct));
    recordStationTaskDone();
    onAttemptSaved();
    setTaskIndex((i) => i + 1);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-bold text-cyan-300">
          {config.emoji} {config.name.toUpperCase()}
        </div>
        <button onClick={onDone} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <p className="mb-2 text-[11px] text-slate-400">{config.description}</p>
      <div className="flex-1 overflow-auto pr-1">
        <TaskRenderer
          key={task.id}
          task={task}
          profileName={profile.name}
          onResolve={handleResolve}
          onEffect={applyEffect}
        />
      </div>
    </div>
  );
}