import { useState } from "react";
import { generateMissionPhoto, RENDER_STYLES, type RenderStyle } from "../ai/missionPhoto";
import { hasKey } from "../ai/gemini";

export type ViewMode = "cad" | "fast" | "quality";

interface Props {
  siteName: string;
  getScreenshot: () => string | undefined;
  onPhoto?: (dataUrl: string) => void;
}

/**
 * Mission Camera pill (§5b): Workshop is the live viewport; Photo/Poster
 * capture the canvas and have Gemini repaint it. Overlay dismisses when
 * returning to Workshop. Without a key it simply saves the plain screenshot.
 */
export function ViewSwitcher({ siteName, getScreenshot, onPhoto }: Props) {
  const [mode, setMode] = useState<ViewMode>("cad");
  const [style, setStyle] = useState<RenderStyle>("photorealistic");
  const [overlay, setOverlay] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const shoot = async (quality: "fast" | "quality") => {
    const shot = getScreenshot();
    if (!shot) return;
    setBusy(true);
    setOverlay(null);
    const painted = hasKey()
      ? await generateMissionPhoto(shot, siteName, style, quality)
      : null;
    if (hasKey() && !painted) {
      // error path, not a silent downgrade — surface a gentle toast
      setGlitch(true);
      setTimeout(() => setGlitch(false), 4500);
    }
    const final = painted ?? shot;
    setOverlay(final);
    onPhoto?.(final);
    setBusy(false);
  };

  return (
    <>
      {overlay && mode !== "cad" && (
        <img
          src={overlay}
          alt="Mission photo"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
        />
      )}
      {busy && (
        <div className="absolute inset-x-0 top-16 z-30 text-center text-sm text-cyan-200 animate-pulse">
          developing photo… 📷
        </div>
      )}
      {glitch && (
        <div className="absolute inset-x-0 top-16 z-30 mx-auto w-fit rounded-full border border-amber-500/60 bg-space-900/95 px-4 py-1.5 text-center text-xs text-amber-200">
          📷 Camera glitch — the AI darkroom hiccupped, so we saved the plain workshop shot instead.
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 space-y-1.5 text-center">
        <div className="inline-flex overflow-hidden rounded-full border border-cyan-600/50 bg-space-900/90 text-xs">
          {(
            [
              ["cad", "🛠 Workshop"],
              ["fast", "📸 Photo"],
              ["quality", "🎞 Poster"],
            ] as [ViewMode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (m === "cad") setOverlay(null);
                else void shoot(m === "fast" ? "fast" : "quality");
              }}
              className={`px-3 py-1.5 ${
                mode === m ? "bg-cyan-500 text-black font-bold" : "text-cyan-200 hover:bg-space-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode !== "cad" && (
          <div className="flex justify-center gap-1">
            {RENDER_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  style === s ? "bg-amber-400 text-black" : "bg-space-800/90 text-amber-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
