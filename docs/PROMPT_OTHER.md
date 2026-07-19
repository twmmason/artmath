# Rocket Lab — KS3 Expansion: REMAINING WORK (build prompt)

> **Give this entire document to the AI coding agent.** It contains ONLY the
> work still outstanding on the KS3 "Astronaut Academy" expansion. Everything
> else from the original expansion prompt has already been built, verified and
> signed off in `PROGRESS.md` — do not rebuild it. Nothing that already works
> may regress: all 146 criteria (81 KS2 + 65 KS3), the multi-profile system,
> the VAB loop, launch sim, mastery engine and `pnpm verify` must stay green
> throughout.

## Already DONE — do not redo (see PROGRESS.md for evidence)

- ✅ KS3 curriculum data: 65 criteria with `keyStage` field, cross-checked
  against `docs/SECONDARY_national_curriculum_-_Mathematics.pdf`
  (KS3N 16 · KS3A 16 · KS3R 10 · KS3G 16 · KS3P 4 · KS3S 3)
- ✅ `scripts/coverage-check.ts` + `/dev/status` enforce/display the enlarged
  146 total per key stage with zero gaps
- ✅ KS3 engineering homes: the six Mission Control stations (R&D Lab,
  Guidance Computer, Propulsion Lab, Trajectory Planner, Mission Assurance,
  Telemetry Centre) with locked/unlocked 3D states
- ✅ All 65 KS3 task templates (all tiers), with the `notation` field for
  displayed equations and the briefing symbol rule enforced in tests
- ✅ KS3 widgets: Equation, Graph (4-quadrant, gradients/intercepts,
  sequences), Construction, Venn (incl. sample-space grids), DataChart
  (bar/pie/scatter, fed by real mission history), ScaleDiagram, RiskDial —
  all registered in TaskRenderer, keyboard-accessible
- ✅ Statistics tasks use the commander's own Dexie mission data (synthetic
  fallback below 5 missions)
- ✅ Progression: station unlocks derived from KS2 strand mastery, advanced
  destinations (Jupiter / Saturn / Interstellar) with Mission Control
  science-package phase in the planner, KS3 patches, Flight Log KS2+KS3
  coverage grids
- ✅ Gemini client on `gemini-3.5-flash` with key pool + 429 rotation;
  adaptive hints, paraphrase, debrief and Chief Engineer cover KS2+KS3 tasks
- ✅ Mission Camera (Workshop / 📸 Photo / 🎞 Poster) with style presets,
  overlay behaviour, photos saved to mission records; Launch Film recording

The golden rules from `PROMPT.md` §10–11 still apply word-for-word to all new
work: real engineering situations only, briefings symbol-free (KS3 notation
only inside widgets/`notation` segments), deterministic maths core, gentle
tone, UK conventions, answers change the 3D scene.

**Network-first**: this app runs on a connected machine with working API keys
in `.env.local` (`VITE_GEMINI_API_KEY` + pool, `VITE_GOOGLE_MAPS_API_KEY`).
Use Gemini and Google Maps/3D Tiles wherever possible and helpful — static
fallbacks exist only as graceful degradation if a call fails mid-session.

---

## 1. Profile: "I'm in Year 7+" Academy toggle

- KS3 stations currently unlock only via KS2 strand mastery. Add an explicit
  **"I'm in Year 7+" toggle** when creating (and editing) a profile, so an
  older child isn't forced to grind Year 1 content first.
- Store `yearGroupHint` / `academyUnlocked` on the Profile (Dexie schema
  migration). When set, ALL six Mission Control stations count as unlocked
  and the advanced destinations use their KS3-mastery gates only.
- Roster "New Commander" card gains the toggle; a small edit affordance on
  the Hangar commander panel lets it be changed later.

## 2. Real terrain, sky and clouds at the launch site (takram + Google 3D Tiles)

The Phase 7 deferral in `PROGRESS.md` is now cancelled — implement it properly:
- Stream **Google Photorealistic 3D Tiles** (via `3d-tiles-renderer` + the
  `@takram/three-geospatial` plugins, following Gaudi's
  `GeospatialEnvironment.tsx` in `/Users/tomason/dev/gaudi`) using
  `VITE_GOOGLE_MAPS_API_KEY`, positioned at the exact lat/lon of the chosen
  launch site from `launchSites.ts` — the commander should recognise the real
  coastline at Cape Canaveral or the real Shetland cliffs at SaxaVord.
- Add `@takram/three-atmosphere` (physically-based sky, sun, stars, aerial
  perspective) and `@takram/three-clouds` (volumetric cloud layer) so the
  launch shows the real sky→space transition: golden hour on the pad → sky
  darkening → clouds falling away below → stars.
- If the takram packages genuinely cannot coexist with the pinned R3F v8
  stack, upgrade the three/R3F stack as needed (sanctioned breaking upgrade —
  keep `pnpm verify` green afterwards). Only if that is impossible after a
  real attempt may the drei fallback remain, with the exact version conflict
  documented in PROGRESS.md.
- Tiles/atmosphere failures at runtime degrade gracefully to the current
  stylised terrain — but degradation is an error path, not the default.

## 3. Cinematic launch: camera tracking + photorealism (REQUIRED)

The launch must look like real launch footage and the camera must genuinely
TRACK the rocket from ignition to space:

**Launch director (driven by the real `simulateFlight` trajectory):**
- Cuts between shots as altitude/events dictate, each smoothly eased
  (lerp/damp, never snapping):
  1. **Pad cam** — low wide shot for countdown/ignition, camera shake at T-0
  2. **Tower cam** — close pass as the rocket clears the gantry
  3. **Ground tracking telephoto** — planted press-site shot pitching up as
     the rocket climbs and shrinks
  4. **Chase cam** — alongside/behind through the cloud layer, staging visible
  5. **Orbit reveal** — pulls back as the sky turns black: Earth's curve,
     terrain falling away, coasting rocket
- Every shot looks at the rocket's actual simulated position each frame; slow
  ascents hold shots longer. A "📺 shot" indicator lets the player cycle
  cameras manually; `prefers-reduced-motion` gets one steady tracking shot.

**Photorealism:**
- ACES filmic tone mapping, physically correct lights, HDR environment,
  PCFSoft shadows, high-DPI aware.
- Post-processing (`postprocessing` / `@takram/three-geospatial-effects`):
  bloom on the plume, sun lens flare, subtle vignette + film grain,
  aerial-perspective haze fading with altitude.
- Engine exhaust: layered plume (bright core + expanding translucent cone)
  that lengthens as the atmosphere thins, mach-diamond hints low down,
  particle smoke/steam billowing across the pad at ignition.
- PBR rocket materials: procedural metalness/roughness variation, panel-line
  detail, sun glinting off the hull.
- Target 60fps on Apple Silicon; add a Cinematic/Standard graphics toggle if
  needed.

## 4. Remaining Gemini touches

- **Academy tutor pitch**: when the current task is a KS3 criterion, the
  Chief Engineer persona addresses a Year 7–9 commander with richer, slightly
  older-pitched explanations (update the shared persona prompt accordingly).
- **Telemetry insights**: on the Telemetry Centre / Flight Log, after the
  deterministic stats are computed, ask Gemini to narrate ONE interesting
  pattern in the commander's own flight data ("your altitude jumped once you
  started using the Needle Cone…"). Validated, cached, static fallback.
- **Optional launch-film flourish**: `gemini-omni-flash-preview` may generate
  a short cinematic clip from the poster frame — nice-to-have only.

## 5. Mission Camera audit (verify with the real keys)

- Verify Photo (`gemini-3.1-flash-lite-image`) and Poster
  (`gemini-3-pro-image-preview`) modes end-to-end in the browser with the
  real keys: capture → repaint → pointer-transparent overlay → dismiss on
  Workshop/camera move → "developing photo… 📷" shimmer → saved to the
  mission record's `photos`.
- If the image model returns nothing/invalid, save the plain screenshot — but
  surface a gentle **"camera glitch" toast**, not a silent downgrade.
- Destination-appropriate imagery prompts for Academy missions (Jupiter's
  moons, Saturn's rings…).

### What must NOT change
- All 146 criteria, templates and tests keep passing untouched.
- Multi-profile system; deterministic LLM-free maths core (`pnpm verify`
  headless without keys); `run.sh` boot on port 3003.

---

## 6. Process (same discipline as `PROMPT.md` §9)

1. Add a "KS3 Expansion — remaining work" phase plan to `PROGRESS.md`
   (Phase 9: Academy toggle; Phase 10: takram + 3D Tiles; Phase 11: cinematic
   launch; Phase 12: Gemini touches + Mission Camera audit). Tick items only
   when verified.
2. Vitest tests for any new pure logic; `pnpm verify` stays the single
   green/red command.
3. Commit per completed item with `phaseN:` prefixes.
4. Final acceptance: `pnpm verify` green, and a dated browser walkthrough in
   PROGRESS.md showing: the Year 7+ toggle unlocking the Academy, real 3D
   Tiles terrain + takram sky at the chosen launch site, a full launch
   watched end-to-end with the multi-shot camera tracking pad→orbit, a live
   Gemini hint/debrief/telemetry-insight with the real keys, and both Photo
   and Poster modes producing real repaints saved to the Flight Log scrapbook.