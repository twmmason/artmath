import { useEffect, useState, type ReactElement } from "react";
import {
  HashRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { db, getActiveProfileId } from "../db/db";
import { ensureDbReady } from "../db/seed";
import { useRocketState } from "../mission/useRocketState";
import { setSoundEnabled, soundEnabled } from "../mission/sound";
import { RosterPage } from "../features/roster/RosterPage";
import { HangarPage } from "../features/hangar/HangarPage";
import { VABPage } from "../features/vab/VABPage";
import { MissionControlPage } from "../features/missioncontrol/MissionControlPage";
import { LaunchPage } from "../features/launch/LaunchPage";
import { ReportPage } from "../features/report/ReportPage";
import { FlightLogPage } from "../features/flightlog/FlightLogPage";
import { SandboxPage } from "../features/sandbox/SandboxPage";
import { DevStatusPage } from "../features/dev/DevStatusPage";

function Header() {
  const profile = useRocketState((s) => s.profile);
  const setProfile = useRocketState((s) => s.setProfile);
  const navigate = useNavigate();
  const [sound, setSound] = useState(soundEnabled());
  if (!profile) return null;
  return (
    <header className="flex h-14 items-center gap-4 border-b border-cyan-900/40 bg-space-900/90 px-4">
      <button
        onClick={() => navigate("/hangar")}
        className="glow-text font-display text-sm font-bold tracking-[0.2em] text-cyan-300"
      >
        {profile.name.toUpperCase()}'S ROCKET LAB
      </button>
      <nav className="flex gap-1 text-xs">
        {[
          ["/hangar", "🏠 Hangar"],
          ["/vab", "🏗 VAB"],
          ["/missioncontrol", "🛰 Mission Control"],
          ["/flightlog", "📖 Flight Log"],
          ["/sandbox", "🧪 Sandbox"],
        ].map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded px-2.5 py-1.5 ${
                isActive ? "bg-cyan-500/20 text-cyan-200" : "text-slate-400 hover:text-cyan-300"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
        <span>⭐ {profile.xp.toLocaleString("en-GB")} XP</span>
        <span>🔥 {profile.launchStreak}</span>
        <button
          onClick={() => {
            setSoundEnabled(!sound);
            setSound(!sound);
          }}
          title="Sound (off by default)"
          className="rounded border border-cyan-800/50 px-2 py-1 hover:bg-space-700"
        >
          {sound ? "🔊" : "🔇"}
        </button>
        <button
          onClick={() => {
            setProfile(null);
            navigate("/");
          }}
          className="rounded border border-cyan-800/50 px-2 py-1 text-cyan-300 hover:bg-space-700"
        >
          Switch Commander
        </button>
      </div>
    </header>
  );
}

function Guard({ children }: { children: ReactElement }) {
  const profile = useRocketState((s) => s.profile);
  if (!profile) return <Navigate to="/" replace />;
  return children;
}

function Shell() {
  const [ready, setReady] = useState(false);
  const profile = useRocketState((s) => s.profile);
  const setProfile = useRocketState((s) => s.setProfile);

  useEffect(() => {
    void (async () => {
      await ensureDbReady();
      const activeId = getActiveProfileId();
      if (activeId) {
        const p = await db.profiles.get(activeId);
        if (p) setProfile(p);
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center text-cyan-400 animate-pulse">
        Powering up the lab…
      </div>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={profile ? <Navigate to="/hangar" replace /> : <RosterPage />}
        />
        <Route path="/hangar" element={<Guard><HangarPage /></Guard>} />
        <Route path="/vab" element={<Guard><VABPage /></Guard>} />
        <Route path="/missioncontrol" element={<Guard><MissionControlPage /></Guard>} />
        <Route path="/launch" element={<Guard><LaunchPage /></Guard>} />
        <Route path="/report" element={<Guard><ReportPage /></Guard>} />
        <Route path="/flightlog" element={<Guard><FlightLogPage /></Guard>} />
        <Route path="/sandbox" element={<Guard><SandboxPage /></Guard>} />
        <Route path="/dev/status" element={<DevStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}