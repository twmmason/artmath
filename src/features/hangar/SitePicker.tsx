import { LAUNCH_SITES } from "../../mission/launchSites";
import { db } from "../../db/db";
import { useRocketState } from "../../mission/useRocketState";

interface Props {
  onClose: () => void;
}

/** Pick a real global spaceport (§5b) — purely atmospheric, never gates maths. */
export function SitePicker({ onClose }: Props) {
  const profile = useRocketState((s) => s.profile);
  const setProfile = useRocketState((s) => s.setProfile);
  if (!profile) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6">
      <div className="hud-panel max-h-[85vh] w-full max-w-2xl overflow-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-cyan-300">🌍 Choose your launch site</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LAUNCH_SITES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                void db.profiles.update(profile.id, { launchSiteId: s.id });
                setProfile({ ...profile, launchSiteId: s.id });
                onClose();
              }}
              className={`rounded-lg border p-3 text-left transition hover:border-cyan-400 ${
                profile.launchSiteId === s.id
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-cyan-800/50 bg-space-800/60"
              }`}
            >
              <div className="font-bold text-cyan-100">{s.country} {s.name}</div>
              <div className="mt-1 text-xs text-slate-400">{s.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
