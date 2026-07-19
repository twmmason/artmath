/** Optional SFX — off by default (§8). Pure WebAudio beeps, no assets. */
let enabled = false;

export function soundEnabled(): boolean {
  return enabled;
}
export function setSoundEnabled(on: boolean): void {
  enabled = on;
}

function beep(freq: number, durationMs: number, type: OscillatorType = "sine"): void {
  if (!enabled) return;
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
    osc.onended = () => ctx.close();
  } catch {
    // audio unavailable
  }
}

export const sfx = {
  countdown: () => beep(660, 120),
  snap: () => beep(880, 60, "square"),
  certify: () => beep(1040, 180),
  launch: () => beep(220, 600, "sawtooth"),
};
