# Rocket Lab — PROGRESS

Living status board (§9 process). `pnpm verify` = `tsc -b && vitest run && tsx scripts/coverage-check.ts`.

**Current status: `pnpm verify` GREEN — 174 tests passing, coverage `KS2 81/81 ✅  KS3 65/65 ✅  parts 8/8  stations 6/6`.**

## Phase 1: Foundation   Status: ✅ COMPLETE (2026-07-19)
- [x] Vite + React 18 + TS + Tailwind project setup — `./run.sh` runs `tsc -b` then dev server on port 3003
- [x] Dexie DB with multi-profile schema (`profileId` indexed on attempts/missions) — `src/db/db.ts`
- [x] Commander Roster on load: pick/create/switch profiles, `activeProfileId` in localStorage — `features/roster/`
- [x] Curriculum types + all 146 criteria (81 KS2 RTP + 65 KS3) — `src/curriculum/criteria.ts`, cross-checked against docs PDFs
- [x] Routing (Roster, Hangar, VAB, Mission Control, Launch, Report, FlightLog, Sandbox, /dev/status) — `app/App.tsx`
- [x] Space theme CSS (deep navy, cyan HUD panels, Lexend font) — `src/index.css`
- [x] Gemini client wrapper with key pool + 429 rotation + offline fallback mode — `src/ai/gemini.ts`
- [x] PROGRESS.md + `pnpm verify` + `/dev/status` page
Done-when verified: run.sh starts cleanly, all pages render, criteria queryable, profile create/pick/auto-select works.

## Phase 2: 3D Rocket + Kerbal Assembly   Status: ✅ COMPLETE (2026-07-19)
- [x] three + @react-three/fiber v8 + drei installed
- [x] Parametric Rocket3D with all 8 part types (incl. electronics bay + radial boosters) — `three/Rocket3D.tsx`
- [x] RocketScene with stars, lighting, launch pad, gantry, OrbitControls — `three/RocketScene.tsx`
- [x] RocketDesign state drives all part dimensions (zustand store, morph-lerped)
- [x] Parts catalogue (`mission/partsCatalog.ts`, 2–4 variants per category with stat trade-offs) + PartsTray with stat cards
- [x] Assembly: pick variant in tray → ghost DRAFT part snaps to its attachment slot; detach supported
- [x] Radial symmetry ×2/×3/×4 for fins and boosters
- [x] Camera zoom-to-part animation (lerped fly-to on part select)

## Phase 3: Draft → Certified Workflow   Status: ✅ COMPLETE (2026-07-19)
- [x] GeneratedTask type with rocketPart, visual, rocketEffect (+ tolerance, fraction equivalence, KS3 `notation` field)
- [x] Nose cone templates (all 8 G-strand codes ×3 tiers) — `engine/templates/nosecone.ts`
- [x] ProtractorWidget + draft/certified part states (ghost → full material + green tag)
- [x] VABPage: click draft part → StagePanel task flow → certify; attempts saved to Dexie per profile
- [x] 3-attempt answering flow (nudge → hint → engineering manual + incorrectValue), part never blocked
- [x] Adaptive Gemini hints wired with static fallback — `ai/hints.ts`

## Phase 4: All Parts   Status: ✅ COMPLETE (2026-07-19)
- [x] Hull (NPV) + RulerWidget; Fuel (NPV+F) + FuelGaugeWidget; Engine (NF+MD); Fins (G+AS) + GridWidget
- [x] Payload (F+MD) + PayloadSplitWidget; Electronics (AS + 6AS/MD) + CircuitWidget + BarModelWidget
- [x] Booster tasks (engine NF/MD reused in booster context)
- [x] Pre-flight checklist (5 rapid-fire NF system checks) + ChecklistWidget + uncertified-part warnings
Done-when verified: coverage check reports KS2 81/81 ✅; every part attachable & certifiable.

## Phase 5: Mission Flow   Status: ✅ COMPLETE (2026-07-19)
- [x] Launch site picker (7 real spaceports) persisted to profile — `mission/launchSites.ts` + SitePicker
- [x] Destination selection with mastery-based unlock logic (7 destinations incl. KS3 trio)
- [x] Mission planner (due reviews → recent wrongs → new criteria in curriculum order) — `mission/runPlanner.ts`
- [x] Full VAB → Pre-flight → Launch flow; 3D launch animation (countdown, liftoff, staging, sky-to-space fade)
- [x] After-action report ("what maths flew this mission") + AI Flight Director debrief (static fallback)
- [x] Mission save/resume: mid-build state in Dexie `savedMissions`, restored on return

## Phase 6: Progression   Status: ✅ COMPLETE (2026-07-19)
- [x] Mastery (3-in-a-row at tier ≥2), XP, launch streaks — all derived from attempts (`engine/mastery.ts`)
- [x] Spaced repetition intervals 1/3/7/14 days, reset on wrong answer
- [x] Part upgrades Lv1→Lv3 from strand mastery (derived, never stored)
- [x] Mission patches incl. KS3 milestones — `mission/patches.ts`
- [x] Flight Log telemetry console with per-strand coverage map + mission history
- [x] Sandbox free-design mode with live performance dashboard

## Phase 7: Polish   Status: ✅ COMPLETE (2026-07-19) — see Deferred
- [x] Smooth camera transitions; engine flame + certification pulse effects
- [x] Sky/starfield launch transition (drei Sky + Stars fallback path)
- [x] Mission Camera (Workshop/Photo/Poster) + style presets + Launch Film (MediaRecorder) — degrade to plain screenshot without key
- [x] Paraphrase variety + "Ask the Chief Engineer" + milestone flavour lines (all with validated fallbacks)
- [x] `prefers-reduced-motion` fallbacks; keyboard-accessible widgets; sound off by default
### Deferred (with reasons)
- takram atmosphere/clouds + Google 3D Tiles terrain → deferred: drei Sky/Stars fallback shipped (spec-sanctioned fallback);
  terrain tag drives stylised ground per site. Pick up in a post-acceptance polish pass.

## Phase 8: KS3 Advanced Programme   Status: ✅ COMPLETE (2026-07-19)
- [x] All 65 KS3 templates across 6 station files (`engine/templates/ks3/`) with `notation` field for displayed formulae
- [x] KS3 widgets: Graph, Equation, ScaleDiagram, Construction, Venn, DataChart, RiskDial
- [x] Mission Control wing page with locked/unlocked stations + "POWER OFFLINE — master more KS2 systems" tags
- [x] Station unlock rules derived from KS2 strand mastery (`mission/stations.ts` + `stationUnlocks`)
- [x] Advanced destinations (Jupiter/Saturn/Interstellar) + Mission Control science-package phase in planner
- [x] KS3 patches ("Secondary-Ready" etc.); Flight Log KS3 domain × station grid; /dev/status full 146 grid
Done-when verified: `pnpm verify` reports 146/146; stations unlock from KS2 mastery; Jupiter missions include station tasks.

## Verification log
- 2026-07-19 `pnpm verify`: tsc clean · 174/174 tests · `KS2 81/81 ✅  KS3 65/65 ✅  parts 8/8  stations 6/6` · 146/146 covered

## §15 Success criteria walkthrough sign-offs
1. ✅ 2026-07-19 — Roster titled "ROCKET LAB"; created profile; title flips to "{NAME}'S ROCKET LAB" (+document.title); site picker works
2. ✅ 2026-07-19 — Low Orbit selectable from Hangar
3. ✅ 2026-07-19 — VAB free-order assembly from catalogue; parts certified through engineering tasks
4. ✅ 2026-07-19 — 3D rocket reshapes live as answers lock in (nose angle, tank fill, engines, fins)
5. ✅ 2026-07-19 — Pre-flight checklist (5 systems, tick animation)
6. ✅ 2026-07-19 — 3D launch sequence: countdown → liftoff → staging → sky darkens → arrival
7. ✅ 2026-07-19 — After-action report lists criteria used; Flight Director debrief (fallback text offline)
8. ✅ 2026-07-19 — Wrong answer → nudge → hint flow (Gemini adaptive when key live, static otherwise, never leaks answer)
9. ✅ 2026-07-19 — Mission photo button captures canvas; AI repaint when key live, plain screenshot offline; saved to Flight Log
10. ✅ 2026-07-19 — Rocket design + mastery persist per profile in Dexie; part levels derived on return
11. ✅ 2026-07-19 — Stations power up from KS2 mastery; KS3 tasks completable (attempt rows in Dexie)
12. ✅ 2026-07-19 — Jupiter unlock adds Mission Control science package before VAB build
13. ✅ 2026-07-19 — Switching commander flips title/rocket/XP/missions with zero cross-profile bleed (all queries filter profileId)

**Final acceptance**: `pnpm verify` green · /dev/status 146/146 · walkthrough signed above.