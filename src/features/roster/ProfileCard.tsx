import type { Profile } from "../../db/db";

interface Props {
  profile: Profile;
  onPick: () => void;
}

/** One commander per card: name, rocket thumbnail, XP, launch streak. */
export function ProfileCard({ profile, onPick }: Props) {
  return (
    <button
      onClick={onPick}
      className="hud-panel group flex w-56 flex-col items-center gap-2 p-5 transition hover:border-cyan-400/70 hover:shadow-[0_0_24px_rgba(34,211,238,0.25)]"
    >
      <div className="text-5xl transition group-hover:-translate-y-1">🚀</div>
      <div className="font-display text-lg font-bold text-cyan-200">{profile.name}</div>
      <div className="flex gap-3 text-xs text-slate-400">
        <span>⭐ {profile.xp.toLocaleString("en-GB")} XP</span>
        <span>🔥 {profile.launchStreak}-day streak</span>
      </div>
      <div className="text-[10px] text-cyan-500/70">
        {profile.patches.length} mission patch{profile.patches.length === 1 ? "" : "es"}
      </div>
    </button>
  );
}
