import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, newProfile, type Profile } from "../../db/db";
import { useRocketState } from "../../mission/useRocketState";
import { ProfileCard } from "./ProfileCard";

/** Commander Roster: pick / create / switch profiles (§4). */
export function RosterPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [year7, setYear7] = useState(false);
  const setProfile = useRocketState((s) => s.setProfile);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Rocket Lab";
    void db.profiles.toArray().then(setProfiles);
  }, []);

  const create = async (n: string) => {
    if (!n.trim()) return;
    const p = newProfile(n, year7);
    await db.profiles.put(p);
    pick(p);
  };

  const pick = (p: Profile) => {
    setProfile(p);
    navigate("/hangar");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="glow-text font-display text-5xl font-bold tracking-[0.25em] text-cyan-300">
          ROCKET LAB
        </h1>
        <p className="mt-2 text-sm text-slate-400">Who's flying today, Commander?</p>
      </div>
      <div className="flex flex-wrap items-stretch justify-center gap-4">
        {profiles.map((p) => (
          <ProfileCard key={p.id} profile={p} onPick={() => pick(p)} />
        ))}
        <div className="hud-panel flex w-56 flex-col items-center justify-center gap-3 p-5">
          <div className="text-4xl">➕</div>
          <div className="font-display text-sm text-cyan-300">New Commander</div>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void create(name);
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="New commander name"
              className="w-full rounded border border-cyan-700/50 bg-space-900/80 px-2 py-1.5 text-sm text-white"
            />
            <label className="flex items-center gap-2 text-[11px] text-slate-300">
              <input
                type="checkbox"
                checked={year7}
                onChange={(e) => setYear7(e.target.checked)}
                aria-label="I'm in Year 7 or above — unlock the Astronaut Academy"
              />
              🎓 I'm in Year 7+ (unlock the Astronaut Academy)
            </label>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded bg-cyan-500 py-1.5 text-sm font-bold text-black hover:bg-cyan-400 disabled:opacity-40"
            >
              Join the programme
            </button>
          </form>
          {profiles.length === 0 && (
            <div className="flex gap-2">
              {["Artie", "Walter"].map((n) => (
                <button
                  key={n}
                  onClick={() => void create(n)}
                  className="rounded-full border border-cyan-600/50 px-3 py-1 text-xs text-cyan-300 hover:bg-space-700"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
