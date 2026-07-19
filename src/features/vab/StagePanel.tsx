import { useEffect, useMemo, useState } from "react";
import type { RocketPart } from "../../three/rocketDesign";
import { PART_LABELS, PART_EMOJI } from "../../three/rocketDesign";
import { useRocketState } from "../../mission/useRocketState";
import { PART_CRITERIA } from "../../mission/parts";
import { generateTask } from "../../engine";
import type { GeneratedTask } from "../../engine/types";
import { db } from "../../db/db";
import { xpForAnswer } from "../../engine/mastery";
import { TaskRenderer, type TaskResult } from "../../components/TaskRenderer";
import { sfx } from "../../mission/sound";
import { paraphraseBriefing } from "../../ai/paraphrase";
import { hasKey } from "../../ai/gemini";

interface Props {
  part: RocketPart;
  onCertified: () => void;
  onClose: () => void;
}

/**
 * Engineering task panel for the selected draft part: solve its planned
 * tasks → part is CERTIFIED. Attempts are saved to Dexie per profile.
 */
export function StagePanel({ part, onCertified, onClose }: Props) {
  const profile = useRocketState((s) => s.profile);
  const mission = useRocketState((s) => s.mission);
  const applyEffect = useRocketState((s) => s.applyEffect);
  const certifyPart = useRocketState((s) => s.certifyPart);
  const recordTaskResult = useRocketState((s) => s.recordTaskResult);
  const addXp = useRocketState((s) => s.addXp);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  const planned = useMemo(() => {
    const fromPlan = mission?.plan?.partTasks[part];
    if (fromPlan && fromPlan.length) return fromPlan;
    return PART_CRITERIA[part].slice(0, 2).map((code) => ({ criterionCode: code, tier: 1 }));
  }, [mission, part]);

  const tasks = useMemo<GeneratedTask[]>(
    () => planned.map((p, i) => generateTask(p.criterionCode, p.tier, `${part}-${Date.now()}-${i}`)),
    [planned, part],
  );
  const [briefings, setBriefings] = useState<string[]>([]);

  useEffect(() => {
    setIdx(0);
    setDone(false);
    setBriefings(tasks.map((t) => t.briefing));
    // briefing paraphrase variety (§5a #2) — swap in silently if it arrives
    if (hasKey() && profile) {
      tasks.forEach((t, i) => {
        void paraphraseBriefing(t, profile.name).then((p) =>
          setBriefings((cur) => {
            const next = [...cur];
            if (next[i] === t.briefing) next[i] = p;
            return next;
          }),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part]);

  if (!profile) return null;
  const task = tasks[idx];
  const shownTask = task ? { ...task, briefing: briefings[idx] ?? task.briefing } : null;

  const handleResolve = async (result: TaskResult) => {
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
    if (idx + 1 < tasks.length) {
      setIdx(idx + 1);
    } else {
      certifyPart(part);
      sfx.certify();
      setDone(true);
      setTimeout(onCertified, 1200);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-bold text-cyan-300">
          {PART_EMOJI[part]} {PART_LABELS[part].toUpperCase()} — certification
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <div className="mb-2 flex gap-1">
        {tasks.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded ${
              i < idx || done ? "bg-emerald-400" : i === idx ? "bg-cyan-400" : "bg-space-700"
            }`}
          />
        ))}
      </div>
      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <div className="text-5xl">✅</div>
          <div className="font-display text-lg font-bold text-emerald-300">
            {PART_LABELS[part]} CERTIFIED
          </div>
          <div className="text-xs text-slate-400">Flight-ready and locked in, Commander.</div>
        </div>
      ) : (
        shownTask && (
          <div className="flex-1 overflow-auto pr-1">
            <TaskRenderer
              key={task.id}
              task={shownTask}
              profileName={profile.name}
              onResolve={handleResolve}
              onEffect={applyEffect}
            />
          </div>
        )
      )}
    </div>
  );
}