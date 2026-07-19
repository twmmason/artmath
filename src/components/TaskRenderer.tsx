import { useEffect, useMemo, useState, type ReactElement } from "react";
import type { GeneratedTask } from "../engine/types";
import { checkAnswer } from "../engine/types";
import { adaptiveHint } from "../ai/hints";
import { askChiefEngineer } from "../ai/chiefEngineer";
import { FALLBACK_NUDGE, fallbackHint } from "../ai/fallbacks";
import { ProtractorWidget } from "./widgets/ProtractorWidget";
import { RulerWidget } from "./widgets/RulerWidget";
import { FuelGaugeWidget } from "./widgets/FuelGaugeWidget";
import { NumberLineWidget } from "./widgets/NumberLineWidget";
import { RatioMixerWidget } from "./widgets/RatioMixerWidget";
import { PayloadSplitWidget } from "./widgets/PayloadSplitWidget";
import { GridWidget } from "./widgets/GridWidget";
import { CircuitWidget } from "./widgets/CircuitWidget";
import { BarModelWidget } from "./widgets/BarModelWidget";
import { ChecklistWidget } from "./widgets/ChecklistWidget";
import { GraphWidget } from "./widgets/GraphWidget";
import { EquationWidget } from "./widgets/EquationWidget";
import { ScaleDiagramWidget } from "./widgets/ScaleDiagramWidget";
import { ConstructionWidget } from "./widgets/ConstructionWidget";
import { VennWidget } from "./widgets/VennWidget";
import { DataChartWidget } from "./widgets/DataChartWidget";
import { RiskDialWidget } from "./widgets/RiskDialWidget";
import type { WidgetProps } from "./widgets/types";

const WIDGETS: Record<string, (p: WidgetProps) => ReactElement> = {
  protractor: ProtractorWidget,
  ruler: RulerWidget,
  fuelGauge: FuelGaugeWidget,
  numberLine: NumberLineWidget,
  ratioMixer: RatioMixerWidget,
  payloadSplit: PayloadSplitWidget,
  grid: GridWidget,
  circuit: CircuitWidget,
  barModel: BarModelWidget,
  checklist: ChecklistWidget,
  graph: GraphWidget,
  equation: EquationWidget,
  scaleDiagram: ScaleDiagramWidget,
  construction: ConstructionWidget,
  venn: VennWidget,
  dataChart: DataChartWidget,
  riskDial: RiskDialWidget,
};

export interface TaskResult {
  correct: boolean;
  firstTry: boolean;
  hintsUsed: number;
  /** true when the worked steps were shown and the incorrect value applied */
  gaveManual: boolean;
}

interface TaskRendererProps {
  task: GeneratedTask;
  profileName: string;
  /** called once the task resolves (correct, or manual shown + continue) */
  onResolve: (result: TaskResult) => void;
  /** live rocket effect callback on each attempt (correct/incorrect value) */
  onEffect?: (property: string, value: number) => void;
}

/**
 * The engineering task panel: briefing → interactive widget → answer →
 * gentle feedback ladder (§7 answering flow). The part is never blocked.
 */
export function TaskRenderer({ task, profileName, onResolve, onEffect }: TaskRendererProps) {
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hintText, setHintText] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [resolved, setResolved] = useState<"correct" | "manual" | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const [askQ, setAskQ] = useState("");
  const [askA, setAskA] = useState<string | null>(null);

  useEffect(() => {
    setValue("");
    setAttempts(0);
    setHintsUsed(0);
    setFeedback(null);
    setHintText(null);
    setShowManual(false);
    setResolved(null);
    setAskA(null);
  }, [task.id]);

  const Widget = useMemo(() => WIDGETS[task.visual.widget] ?? RulerWidget, [task.visual.widget]);

  const submit = (given: string) => {
    if (resolved) return;
    const ok = checkAnswer(task, given);
    if (ok) {
      setResolved("correct");
      setFeedback(
        attempts === 0 ? "Locked in! ✅ Spot on, Commander." : "Systems nominal ✅ — locked in!",
      );
      onEffect?.(task.rocketEffect.property, task.rocketEffect.correctValue);
      setTimeout(
        () =>
          onResolve({ correct: true, firstTry: attempts === 0, hintsUsed, gaveManual: false }),
        900,
      );
      return;
    }
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) {
      setFeedback(FALLBACK_NUDGE);
    } else if (n === 2) {
      setFeedback("Close! Check the readout — here's a nudge from the Flight Director:");
      const staticHint = fallbackHint(task.hints, hintsUsed);
      setHintText(staticHint);
      setHintsUsed((h) => h + 1);
      // swap in the smarter Gemini hint only if it arrives quickly (§5a fail-soft)
      void adaptiveHint(task, given, hintsUsed, profileName).then((smart) => {
        setHintText((cur) => (cur === staticHint ? smart : cur));
      });
    } else {
      setShowManual(true);
      setResolved("manual");
      setFeedback("Here's the engineering manual — this one goes in the review pile.");
      onEffect?.(task.rocketEffect.property, task.rocketEffect.incorrectValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-cyan-700/40 bg-space-800/70 p-3">
        <div className="text-[10px] uppercase tracking-widest text-cyan-500/70 mb-1">
          Engineering task · {task.criterionCode} · tier {task.tier}
        </div>
        <p className="text-sm leading-relaxed text-slate-100">{task.briefing}</p>
        {task.notation && (
          <div className="mt-2 rounded bg-black/50 px-3 py-1.5 text-center font-mono text-lg text-emerald-300">
            {task.notation}
          </div>
        )}
        <p className="mt-2 text-xs italic text-cyan-400/80">💡 {task.engineeringContext}</p>
      </div>

      <Widget task={task} value={value} onChange={setValue} />

      {!resolved && (
        <div className="space-y-2">
          {task.choices ? (
            <div className="flex flex-wrap justify-center gap-2">
              {task.choices.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setValue(c);
                    submit(c);
                  }}
                  className="rounded-lg border border-cyan-500/50 bg-space-700/70 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-600/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) submit(value);
              }}
            >
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your reading…"
                aria-label="Task answer"
                className="flex-1 rounded-lg border border-cyan-600/50 bg-space-900/80 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-40"
              >
                Lock in
              </button>
            </form>
          )}
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            resolved === "correct"
              ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40"
              : "bg-amber-500/15 text-amber-200 border border-amber-500/30"
          }`}
        >
          {feedback}
        </div>
      )}
      {hintText && !resolved && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
          🎧 {hintText}
        </div>
      )}

      {showManual && (
        <div className="rounded-lg border border-violet-500/40 bg-violet-500/10 p-3 text-sm text-violet-100">
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-violet-300">
            📖 Engineering manual
          </div>
          <ol className="list-decimal space-y-1 pl-5">
            {task.workedSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <button
            onClick={() => onResolve({ correct: false, firstTry: false, hintsUsed, gaveManual: true })}
            className="mt-3 rounded-lg bg-violet-500 px-4 py-1.5 text-sm font-bold text-black hover:bg-violet-400"
          >
            Continue mission →
          </button>
        </div>
      )}

      {/* Ask the Chief Engineer (§5a #4) */}
      <div className="pt-1">
        <button
          onClick={() => setAskOpen((o) => !o)}
          className="text-xs text-cyan-500/80 hover:text-cyan-300 underline underline-offset-2"
        >
          🧑‍🔧 Ask the Chief Engineer
        </button>
        {askOpen && (
          <div className="mt-2 space-y-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!askQ.trim()) return;
                setAskA("The Chief Engineer is thinking…");
                setAskA(await askChiefEngineer(askQ, task, profileName));
              }}
            >
              <input
                value={askQ}
                onChange={(e) => setAskQ(e.target.value)}
                placeholder="e.g. what does thrust mean?"
                aria-label="Question for the Chief Engineer"
                className="flex-1 rounded border border-cyan-700/50 bg-space-900/80 px-2 py-1 text-xs text-white"
              />
              <button className="rounded bg-space-600 px-3 py-1 text-xs text-cyan-200 hover:bg-space-700">
                Ask
              </button>
            </form>
            {askA && (
              <div className="rounded border border-cyan-700/40 bg-space-900/70 p-2 text-xs text-cyan-100">
                {askA}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}