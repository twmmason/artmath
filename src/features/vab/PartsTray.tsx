import { useState } from "react";
import { ALL_PARTS, PART_EMOJI, PART_LABELS, type RocketPart } from "../../three/rocketDesign";
import { variantsForPart, type PartVariant } from "../../mission/partsCatalog";
import { useRocketState } from "../../mission/useRocketState";
import { sfx } from "../../mission/sound";

interface Props {
  partLevels: Record<RocketPart, 1 | 2 | 3>;
}

/**
 * Kerbal-style categorised parts catalogue. Drag a variant onto the canvas
 * (or click it) to snap it to its attachment node as a DRAFT part.
 * Higher-level variants unlock via strand mastery (§7).
 */
export function PartsTray({ partLevels }: Props) {
  const [tab, setTab] = useState<RocketPart>("noseCone");
  const [hovered, setHovered] = useState<PartVariant | null>(null);
  const design = useRocketState((s) => s.design);
  const attachPart = useRocketState((s) => s.attachPart);
  const detachPart = useRocketState((s) => s.detachPart);
  const updateDesign = useRocketState((s) => s.updateDesign);
  const installed = design.installedParts[tab];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 text-xs font-bold tracking-widest text-cyan-300">🧰 PARTS CATALOGUE</div>
      <div className="mb-2 grid grid-cols-4 gap-1">
        {ALL_PARTS.map((p) => (
          <button
            key={p}
            onClick={() => setTab(p)}
            title={PART_LABELS[p]}
            className={`rounded p-1.5 text-lg ${
              tab === p ? "bg-cyan-500/30 ring-1 ring-cyan-400" : "bg-space-800/70 hover:bg-space-700"
            } ${design.installedParts[p] ? "opacity-100" : "opacity-70"}`}
          >
            {PART_EMOJI[p]}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 mb-1">{PART_LABELS[tab]}</div>
      <div className="flex-1 space-y-1.5 overflow-auto pr-1">
        {variantsForPart(tab).map((v) => {
          const locked = v.unlockLevel > partLevels[tab];
          const isInstalled = installed?.variantId === v.id;
          return (
            <div key={v.id} className="relative">
              <button
                draggable={!locked}
                onDragEnd={() => {
                  if (!locked) {
                    attachPart(v.id);
                    sfx.snap();
                  }
                }}
                onClick={() => {
                  if (!locked) {
                    attachPart(v.id);
                    sfx.snap();
                  }
                }}
                onMouseEnter={() => setHovered(v)}
                onMouseLeave={() => setHovered(null)}
                disabled={locked}
                className={`w-full rounded-lg border p-2 text-left text-xs transition ${
                  isInstalled
                    ? "border-emerald-400/70 bg-emerald-500/10 text-emerald-100"
                    : locked
                      ? "border-slate-700/50 bg-space-900/60 text-slate-600"
                      : "border-cyan-700/50 bg-space-800/70 text-cyan-100 hover:border-cyan-400 cursor-grab"
                }`}
              >
                <div className="font-bold">
                  {locked ? "🔒 " : ""}
                  {v.name}
                  {isInstalled && " ✓"}
                </div>
                <div className="text-[10px] text-slate-400">
                  {locked ? `Unlocks at ${PART_LABELS[tab]} level ${v.unlockLevel}` : v.description}
                </div>
              </button>
              {/* holographic stat card */}
              {hovered?.id === v.id && !locked && (
                <div className="absolute left-full top-0 z-40 ml-2 w-44 rounded-lg border border-cyan-400/50 bg-space-900/95 p-2 text-[10px] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <div className="mb-1 font-bold">{v.name}</div>
                  {Object.entries(v.stats).map(([k, val]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}</span>
                      <span>{String(val)}</span>
                    </div>
                  ))}
                  <div className="mt-1 text-amber-300/80">Certified by: {PART_LABELS[tab]} tasks</div>
                </div>
              )}
            </div>
          );
        })}
        {installed && (
          <button
            onClick={() => detachPart(tab)}
            className="w-full rounded border border-red-800/60 px-2 py-1 text-[10px] text-red-400 hover:bg-red-900/20"
          >
            ✕ Detach {PART_LABELS[tab]}
          </button>
        )}
      </div>
      {/* radial symmetry tool for fins/boosters */}
      {(tab === "fins" || tab === "booster") && installed && (
        <div className="mt-2 rounded border border-cyan-800/50 bg-space-900/70 p-2 text-[10px]">
          <div className="mb-1 text-cyan-400">Radial symmetry</div>
          <div className="flex gap-1">
            {[2, 3, 4].map((n) => {
              const current = tab === "fins" ? design.finCount : design.boosterCount;
              return (
                <button
                  key={n}
                  onClick={() =>
                    updateDesign(tab === "fins" ? { finCount: n } : { boosterCount: n })
                  }
                  className={`flex-1 rounded py-1 ${
                    current === n ? "bg-cyan-500 text-black font-bold" : "bg-space-700 text-cyan-200"
                  }`}
                >
                  ×{n}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}