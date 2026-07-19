# Artie's Rocket Lab — Full Build Prompt (from scratch)

> **Give this entire document to an AI coding agent. It contains everything needed
> to build the project from zero.**

---

## 1. Who is Artie?

Arthur ("Artie"), age 10, Year 6, England. He loves rockets and space. His maths
confidence is fragile — he needs small wins, gentle feedback, and the feeling that
he's *doing something real*, not filling in worksheets. We have the summer holidays
to cover the entire KS1 & KS2 Ready-to-Progress (RTP) curriculum through a game
where **maths IS rocket engineering** — and, because he starts secondary school in
September, the game must also carry him into the **KS3 (secondary) National
Curriculum for Mathematics** (`docs/SECONDARY_national_curriculum_-_Mathematics.pdf`)
as each primary strand is mastered. The full syllabus is **146 criteria: 81 KS1–KS2
RTP items + 65 KS3 statements** (see §6).

Artie isn't necessarily the only player. The app supports **multiple local
profiles**: on load, a **Commander Roster** screen lets the player pick (or
create) their profile — Artie, his brother Walter, or any other name. Every
profile has its own rocket, XP, mastery, mission history and launch site,
completely independent of the others. Artie is the design persona throughout
this document, but nothing may hard-code his name.

---

## 2. The Core Concept: Kerbal-style Rocket Lab

Artie is a **Rocket Engineer at Mission Control**. The entire app is a 3D rocket
design studio + mission simulator. There are no "maths questions" — there are
**engineering tasks**. Every task is *about* the rocket part being designed, and the
maths is the tool that makes the engineering work.

### How it works (end-to-end flow)

```
APP LOAD
  → COMMANDER ROSTER: pick your profile (e.g. Artie / Walter / ➕ New Commander)
      • Each profile card shows name, rocket thumbnail, XP and launch streak
      • Creating a profile just needs a name — no passwords, no accounts
      • All progress, mastery, missions and the rocket itself are per-profile

HANGAR (home)
  → First visit: pick your LAUNCH SITE (real global spaceports — see §5b)
  → Pick a mission destination (Low Orbit / Moon / Mars / Deep Space —
    and later Jupiter / Saturn / Interstellar in the KS3 Advanced Programme)
  → Enter the Vehicle Assembly Building (VAB)
  → Kerbal-style FREE ASSEMBLY — Artie builds in ANY order he likes:
      • Browse the PARTS CATALOGUE (each category has 2–4 variants with stats):
          NOSE CONES   — geometry: cone angles, dimensions, symmetry
          HULLS        — place value: hull dimensions, panel counts, scaling
          FUEL TANKS   — decimals, fractions, ratios for fuel loading
          ENGINES      — multiplication, division, number facts for thrust
          FINS         — angles, coordinates, symmetry for stability
          PAYLOAD BAYS — fractions & division to load cargo fairly
          ELECTRONICS  — circuits, power grids, 2 unknowns, inverse ops
          BOOSTERS     — optional radial parts: extra thrust + a staging event
      • Drag a part onto the rocket → it snaps to an attachment node (DRAFT, ghosted)
      • Click a draft part → solve its 2-4 engineering tasks → part is CERTIFIED
  → When every attached part is certified → PRE-FLIGHT CHECKLIST (rapid-fire checks)

  → ADVANCED PROGRAMME (unlocks per strand as KS2 mastery grows — see §6b):
      MISSION CONTROL WING — six specialist stations covering the KS3 syllabus:
          R&D LAB             — KS3 Number: standard form, powers & roots, percentages,
                                negative numbers, rounding & error intervals
          GUIDANCE COMPUTER   — KS3 Algebra: expressions, formulae, linear/quadratic
                                graphs, equations, sequences
          PROPULSION LAB      — KS3 Ratio & proportion: mixtures, scale, percentage
                                change, direct/inverse proportion, speed & density
          TRAJECTORY PLANNER  — KS3 Geometry & measures: Pythagoras, trig ratios,
                                area/volume, angle facts, constructions, transformations
          MISSION ASSURANCE   — KS3 Probability: risk scales, sample spaces, Venn diagrams
          TELEMETRY CENTRE    — KS3 Statistics: flight-data averages, charts, scatter graphs
      Advanced destinations (Jupiter / Saturn / Interstellar) require station sign-offs

  → LAUNCH SEQUENCE (3D animated: countdown → liftoff → staging → orbit)
  → Flight success/height depends on engineering quality (% correct)
  → AFTER-ACTION REPORT (what maths flew the mission)
```

**The 3D rocket in the scene is LIVE** — it changes shape, size, and detail as
Artie answers. If he gets the nose cone angle right, the cone visibly updates. If
he fills 73% fuel, the translucent tank fills to 73%. The rocket he launches is
the one he built with his answers.

### Session design (one mission = one sitting)

A full mission should fit a **15–20 minute session**: roughly 2 tasks per part
on a first playthrough (~14 tasks) + a 5-item pre-flight checklist + launch.
The mission planner (`runPlanner.ts`) picks which criteria each part pulls, so
a mission never feels endless. A mission can be **saved mid-build** and resumed
— never lose progress if the tab closes.

---

## 3. Engineering Tasks (not "questions")

Every task must be **intrinsically about the part being designed**. The child
should never feel like they're doing a maths worksheet — they should feel like
they're solving an engineering problem. Examples:

### 3a. NOSE CONE (Geometry strand)

| Curriculum code | Engineering task |
|---|---|
| 1G-1 (recognise shapes) | "Which of these parts is the cone we need for the nose? Click the cone in the parts tray." |
| 1G-2 (compose shapes) | "Build the nose section: stack the cone on top of the cylinder so they fit together." |
| 2G-1 (describe shapes) | "The nose cone cross-section is a triangle. How many sides and corners does it have?" |
| 3G-1 (right angles) | "The nose cone needs a 90° joint where it meets the hull. Use the protractor to set the joint angle." |
| 4G-1 (classify angles) | "Is this nose cone angle acute, right, or obtuse? Drag it to classify." |
| 4G-2 (compare/order angles) | "Which nose cone design has the smallest drag? Order them by tip angle." |
| 5G-1 (measure angles) | "Measure the tip angle of this nose cone with the protractor. Type your reading." |
| 6G-1 (properties of shapes) | "How many lines of symmetry does this nose cone cross-section have?" |

**Visual**: The 3D nose cone in the scene rotates to show the angle being measured.
A protractor overlay appears. When Artie answers, the cone reshapes to match.

### 3b. HULL / BODY (Number & Place Value strand)

| Curriculum code | Engineering task |
|---|---|
| 1NPV-1 (count within 10) | "Count the hull panels on this section. How many?" |
| 2NPV-1 (count in 10s) | "Each ring has 10 panels. The hull needs 4 rings. How many panels total?" |
| 3NPV-1 (100s, 10s, 1s) | "The hull is 347 cm long. What digit is in the tens place?" |
| 4NPV-1 (1000s) | "Hull mass is 2,450 kg. What is the value of the 4?" |
| 5NPV-1 (powers of 10) | "Scale the hull blueprint: multiply 3.5 m by 100 for the real size." |
| 6NPV-1 (read/write large) | "The hull costs £1,250,000 to build. Write this in words." |
| 3NPV-3 (number line) | "Place the hull length (3.5 m) on this number line (0–5 m)." |
| 4NPV-4 (round) | "Round the hull mass of 2,347 kg to the nearest 100." |
| 5NPV-4 (decimals) | "The hull diameter is 2.45 m. Round to 1 decimal place." |

**Visual**: The 3D hull stretches/shrinks as dimensions are set. Hull panels
highlight and count up. A ruler overlay shows measurements.

### 3c. FUEL SYSTEM (Number & Place Value + Fractions strand)

| Curriculum code | Engineering task |
|---|---|
| 2NPV-2 (recognize place value) | "The fuel tank holds 58 litres. How many tens is that?" |
| 5NPV-3 (scale number line) | "Read the fuel gauge: the needle points to ___ litres." |
| 6NPV-3 (decimals) | "The fuel:oxidiser mix is 2.75:1. What's 2.75 as a fraction?" |
| 3F-1 (unit fractions) | "Fill the tank to 1/4. Drag the fuel slider." |
| 4F-1 (fraction families) | "Is 2/8 the same fill level as 1/4? Check on the gauge." |
| 5F-1 (fractions of quantities) | "The tank holds 600 litres. Fill it to 3/4. How many litres?" |
| 6F-1 (simplify) | "The gauge reads 6/8 full. Simplify that fraction." |
| 6AS/MD-3 (ratio) | "Fuel:oxidiser ratio is 5:1. You have 300L fuel. How much oxidiser?" |

**Visual**: A translucent 3D fuel tank with liquid that rises/falls as Artie drags
a slider or types a value. Gauge readout updates in real time. The ratio mixer
shows two colored liquids.

### 3d. ENGINE (Number Facts + Multiplication/Division strand)

| Curriculum code | Engineering task |
|---|---|
| 1NF-1 (bonds within 10) | "The engine needs 10 bolts. 7 are fitted. How many more?" |
| 2NF-1 (bonds within 20) | "The engine bell has 20 cooling channels. 13 are done. How many left?" |
| 3NF-1 (secure addition to 10) | "The combustion chamber has 6 bolts on the left side and 4 on the right. How many bolts hold the chamber together?" |
| 4NF-1 (times tables) | "Each engine has 8 fuel injectors arranged in a ring. We're fitting 3 engines to this rocket. How many injectors do we need from the workshop?" |
| 5NF-1 (primes/composites) | "The thrust control computer divides its 37 kN output across equal-power channels. Can 37 be split into equal groups? Is it prime or composite?" |
| 3MD-1 (multiply/divide) | "Each engine produces 150 kN of thrust. This rocket has 4 engines. What's the total thrust at liftoff?" |
| 4MD-1 (multiply 3-digit) | "Each engine burns fuel at 245 kg per second. With 3 engines running, what's the total fuel flow rate?" |
| 5MD-1 (multiply up to 4-digit) | "The main engine burn lasts 2,350 seconds. It uses 12 kg of fuel every second. How much fuel do we need to load for the full burn?" |
| 6MD-1 (long division) | "The rocket's total thrust is 4,800 kN, spread equally across 6 engines. What thrust does each individual engine produce?" |


**Visual**: A 3D engine cross-section with bolts/injectors that light up as they're
counted. A thrust gauge that fills. Engine glow intensifies as thrust is set correctly.

### 3e. FINS & AERODYNAMICS (Geometry + Addition/Subtraction strand)

| Curriculum code | Engineering task |
|---|---|
| 3G-2 (horizontal/vertical) | "Are these fins horizontal or vertical? Classify each one." |
| 4G-3 (coordinates) | "Place the fin at coordinates (3, 5) on the blueprint grid." |
| 5G-2 (translation) | "Translate this fin 4 squares right and 2 up on the grid." |
| 6G-2 (coordinate shapes) | "Plot the 4 corners of a rectangular fin on the grid." |
| 4G-1 (symmetry) | "The rocket needs symmetrical fins. Mirror this fin to the other side." |
| 1AS-1 (compose 10) | "Each fin pair is held on by 10 rivets. The workshop has already fitted 6 rivets on the left fin. How many more rivets do you need for the right fin to finish the pair?" |
| 2AS-1 (add/sub within 100) | "Fin A weighs 34 kg and Fin B weighs 28 kg. The launch rail needs the combined weight to check it can hold them. What's their total weight?" |
| 3AS-1 (complements to 100) | "The aerodynamics team says the total fin mass budget is 100 kg. You've already used 67 kg on the lower fins. How much mass is left for the upper fins?" |
| 4AS-1 (add/sub efficiently) | "The four stabiliser fins weigh 125 kg, 175 kg, 150 kg, and 150 kg. The crane needs the total to set its lifting limit. What's the combined weight?" |


**Visual**: 3D fins that snap onto the rocket body. A coordinate grid overlay.
Symmetry line shown. Fins mirror in real time.

### 3f. PAYLOAD BAY (Fractions + Multiplication/Division strand)

| Curriculum code | Engineering task |
|---|---|
| 3F-2 (non-unit fractions) | "The payload bay is divided into 5 equal compartments and 3 are already loaded with science experiments. What fraction of the bay is still empty for more cargo?" |
| 3F-3 (place fractions on line) | "This cargo container weighs 3/4 of a tonne. Place it on the loading scale to check it's within the weight limit." (drag on a number line 0–1 t) |
| 3F-4 (add fractions) | "Cargo Pod A holds 1/4 tonne of food supplies and Pod B holds 2/4 tonne of water. What's the total weight going into the payload bay?" |
| 4F-2 (mixed/improper) | "The loading manifest says we have 7/4 tonnes of equipment. The crane display shows mixed numbers — write 7/4 as a mixed number so the crane operator can read it." |
| 4F-3 (add fractions) | "We're loading three types of cargo: science instruments (3/8 t), crew supplies (2/8 t), and communication gear (1/8 t). What's the total payload weight?" |
| 5F-2 (equivalent fractions) | "The payload bay capacity gauge shows 4/6 full. Mission Control's display shows 2/3 full. Are these the same? Prove they're equivalent." |
| 5F-3 (decimal equivalents) | "The digital readout says the bay is 0.75 full. The analogue gauge uses fractions. What fraction should the analogue gauge show?" |
| 6F-2 (compare fractions) | "We can only fit one more container. Container X weighs 5/8 of a tonne, Container Y weighs 7/12 of a tonne. Which one is heavier? Show your working so we pick the right one." |
| 3MD-1 (share equally) | "24 supply crates have arrived at the loading dock. They need to go equally into 6 compartments so the rocket stays balanced. How many crates go in each compartment?" |
| 5MD-1 (divide) | "The total payload weighs 1,250 kg and must be split equally across 5 pods to keep the centre of gravity stable. What weight goes in each pod?" |


**Visual**: 3D payload bay with draggable crates/pods. Compartments that fill up.
A balance scale that tips. Fraction bars alongside the bay.

### 3g. ELECTRONICS BAY (Addition/Subtraction + advanced AS/MD strand)

The rocket has an **electronics bay** — a visible circuit breadboard mounted on the
hull. This is where the tricky Y6 AS/MD criteria live naturally:

| Curriculum code | Engineering task |
|---|---|
| 6AS/MD-1 (additive vs multiplicative) | "The solar panels add 50 watts of power. The battery multiplier triples whatever the panels produce. Which gives more power to the guidance computer — adding another 50W panel, or switching to a ×4 multiplier? Show why." |
| 6AS/MD-2 (inverse operations) | "The power grid equation shows: ▢ × 8 = 96 watts. The flight computer needs you to find the missing battery output. Use the inverse to solve it." |
| 6AS/MD-4 (2 unknowns) | "Two resistors control the thruster heating. Resistor A + Resistor B = 20 ohms total. Resistor A is 3× Resistor B. What is each resistor's value? Use the bar model on the breadboard to figure it out." |
| 1AS-2 (number sentences) | "The circuit has 3 LEDs lit and some unlit. There are 8 LEDs total on the status board. Write a number sentence to find how many are off." |
| 2AS-2 (difference) | "Sensor A reads 45°C. Sensor B reads 38°C. What's the temperature difference between them? Place it on the thermometer scale." |
| 2AS-3 (bonds to 100) | "The power bus needs exactly 100 watts. The engines draw 65 watts. How much spare capacity is left for the communications array?" |
| 3AS-2 (column addition) | "Three circuit boards draw 156W, 234W, and 189W. The main fuse is rated for 600W. Add up the draws — will the fuse hold?" |
| 3AS-3 (inverse check) | "You calculated the power draw as 423W. Check it by working backwards: if total draw is 423W and board A uses 156W, what do the other boards use? Does it match?" |

**Visual**: A 3D circuit breadboard mounted on the rocket hull. LEDs light up,
resistor values display on labels, power flow arrows animate through traces.
The breadboard has a **bar model overlay** for the 2-unknowns problems — Artie
drags sections of a bar to represent the unknowns and sees the circuit respond.

**3D effect**: When the electronics bay is correctly wired:
- LEDs on the rocket's hull light up green
- The status board shows "SYSTEMS NOMINAL"
- Power flow traces glow with current
- If wrong, LEDs stay amber and the status reads "NEEDS CALIBRATION"

---

### 3h. PRE-FLIGHT CHECKLIST (Number Facts — real system checks)


After all parts are built, a **rapid-fire systems check** — each is a genuine
 engineering verification where the maths arises from the rocket's actual specs:

- ✅ **Guidance computer**: "The flight computer needs 7 backup chips on each of
  8 circuit boards. How many chips total do we need to load?" (7 × 8 = 56)
- ✅ **Life support**: "The crew capsule carries 56 oxygen canisters shared
  equally across 7 compartments. How many per compartment?" (56 ÷ 7 = 8)
- ✅ **Communications**: "Antenna A draws 15 watts, Antenna B draws 27 watts.
  What's the total power draw for comms?" (15 + 27 = 42)
- ✅ **Power systems**: "The solar panels generate 100 watts. The engines use 37
  watts for pre-heating. How much power is left for other systems?" (100 − 37 = 63)
- ✅ **Navigation**: "We need to ping 9 satellites, and each ping takes 6 seconds.
  How long until the position fix is complete?" (9 × 6 = 54 seconds)

Every checklist item states the **physical situation first**, then Artie works out
the number. The bare sum is never shown — only the engineering problem. (The sums
in parentheses above are authoring notes for you, the builder — they must NEVER
appear in the UI.) The checklist ticks off one by one with a satisfying animation
as each system goes green.


---

### KS3 ADVANCED PROGRAMME — Mission Control stations (sections 3i–3n)

Sections 3i–3n cover the **KS3 (secondary) National Curriculum** from
`docs/SECONDARY_national_curriculum_-_Mathematics.pdf`. These tasks live in the
**Mission Control wing** — six specialist 3D stations that unlock as Artie
masters the matching KS2 strands (§6b). Each station is a room/console next to
the VAB with its own camera position, and its tasks gate the **advanced
destinations** (Jupiter, Saturn, Interstellar — §7). Same rules as the VAB:
every task is a real engineering situation, every answer changes something
visible (a trajectory line, a data chart, a risk dial, the rocket itself).

### 3i. R&D LAB (KS3 Number)

A materials-and-measurements laboratory: microscopes, digital calipers, a big
"MISSION DISTANCES" wall display, and a cryogenics rig with negative
temperatures.

| Curriculum code | Engineering task |
|---|---|
| KS3N-1 (place value: decimals/integers any size) | "The nav computer stores the Moon's distance as 384,400 km. What is the value of the 8 in that reading?" |
| KS3N-2 (order pos/neg, symbols ≤ ≥) | "Overnight pad temperatures logged: −4°C, 3°C, −7°C, 1°C. Order them coldest first for the cryogenics report, using the < symbol." |
| KS3N-3 (primes, HCF, LCM, prime factorisation) | "Booster A sends a check-pulse every 12 s, Booster B every 18 s. The sync computer needs the first moment they pulse together. When is it?" |
| KS3N-4 (four operations, negatives, fractions, decimals) | "The probe's battery reads −3.5 V after the cold soak and gains 0.8 V per minute of heating. What does it read after 5 minutes?" |
| KS3N-5 (priority of operations, brackets) | "The power formula on the console is P = 3(a + 2b). With a = 4 and b = 5, what power does the rig deliver?" |
| KS3N-6 (inverse operations) | "The scaler multiplied a signal by 16 and got 208. Work backwards to recover the original signal strength." |
| KS3N-7 (powers and roots) | "The heat-shield is a square panel with area 144 dm². What edge length should the workshop cut?" |
| KS3N-8 (standard form) | "Mars is 225,000,000 km away at closest approach. The nav computer only accepts standard form — enter the distance as A × 10ⁿ." |
| KS3N-9 (fractions ↔ terminating decimals) | "The valve opens 0.375 of a turn. The mechanical dial only shows fractions — what fraction should the technician set?" |
| KS3N-10 (percentages, % change, >100%) | "The Mk2 tank upgrade cut dry mass by 15% from 240 kg. What's the new mass on the certification plate?" |
| KS3N-11 (fractions/percentages as operators) | "Thrust must be held at 85% of the 340 kN maximum during ascent. What thrust should the throttle show?" |
| KS3N-12 (standard units with decimals) | "The fuel line is 2.4 m of pipe plus 65 cm of flexible hose. What total length goes on the parts order, in metres?" |
| KS3N-13 (rounding, decimal places & significant figures) | "Telemetry shows apogee at 187,436 m. Round it to 3 significant figures for the mission summary board." |
| KS3N-14 (estimation & error intervals) | "The strut measures 1.2 m to the nearest 0.1 m. Write the possible true length as an inequality for the tolerance sheet." |
| KS3N-15 (calculator use & interpretation) | "Use the console calculator: total impulse is 48,600 kNs over a 127 s burn. What average thrust does that give — and is the readout sensible?" |
| KS3N-16 (infinite sets: integers, rationals, reals) | "The countdown clock can show any whole number of seconds. Could we ever run out of possible countdown lengths? Explain to the intern." |

**Visual**: a lab bench in 3D — calipers that open/close, a temperature column
that dips below zero, a wall display where standard-form distances light up
planet by planet.

### 3j. GUIDANCE COMPUTER (KS3 Algebra)

The rocket's flight computer — a full-wall console where ascent profiles are
programmed. Formulae are "flight programs"; graphs are "ascent profiles" drawn
live on the trajectory screen.

| Curriculum code | Engineering task |
|---|---|
| KS3A-1 (algebraic notation) | "The burn program shows 3t + 2t. The compiler wants it in shortest form — rewrite it before upload." |
| KS3A-2 (substitute into formulae) | "The burn-time program is t = f ÷ r (fuel over rate). Fuel f = 900 kg, rate r = 15 kg/s. How long will the engine fire?" |
| KS3A-3 (expressions/equations/inequalities vocabulary) | "The console shows 4t + 60 = 300 and 4t + 60. Which one is the *equation* the autopilot can solve? Tag each correctly." |
| KS3A-4 (simplify & manipulate, expand brackets, factorise) | "Each of the 3 boards draws (p + 40) watts. Expand 3(p + 40) so the fuse calculator can read the total draw." |
| KS3A-5 (rearrange formulae) | "The velocity program is v = d ÷ t. Mission Control knows v and d — rearrange the program so it outputs t for the flight plan." |
| KS3A-6 (model situations algebraically) | "Ground crew charge £50 callout plus £20 per hour. Write the cost program C for h hours so the budget computer can run it." |
| KS3A-7 (solve linear equations) | "The throttle equation reads 4t + 60 = 300. Solve for t to set the throttle position." |
| KS3A-8 (coordinates in four quadrants) | "The recovery ship is at (−3, −5) on the ocean grid. Plot it — the splashdown zone spans all four quadrants." |
| KS3A-9 (linear & quadratic graphs) | "Plot the hop-test height program h = 100t − 5t² on the trajectory screen. What shape does the flight path make?" |
| KS3A-10 (interpret algebraic ↔ graphical) | "Two ascent programs are drawn on screen. Which line belongs to h = 40t + 200? Click it and justify from its steepness." |
| KS3A-11 (y = mx + c, gradients & intercepts) | "The ascent profile is h = 40t + 200. What's the climb rate, and what height does the program start from? Read both off the graph." |
| KS3A-12 (graphs for estimates & simultaneous equations) | "Our rocket climbs along one line, the weather balloon along another. Use the graph: at what time and height do they pass?" |
| KS3A-13 (contextual graphs: piece-wise, exponential, reciprocal) | "The battery-drain curve is on screen. Use it to estimate when power drops below 20% — the flight must end before then." |
| KS3A-14 (generate sequences, term-to-term / position-to-term) | "The beacon flashes at 5 s, 9 s, 13 s, 17 s… Program the next three flash times into the computer." |
| KS3A-15 (arithmetic sequences, nth term) | "Staging pings follow the same pattern: 5, 9, 13, 17… Write the nth-term rule so the computer can predict ping n without counting up." |
| KS3A-16 (geometric & other sequences) | "The signal strength halves with every relay hop: 640, 320, 160… What kind of sequence is this, and what reaches hop 6?" |

**Visual**: a glowing trajectory screen — Artie drags points to plot lines and
parabolas, sliders morph `m` and `c` and the ascent line tilts/lifts live, and
sequence pings appear as pulses on a timeline.

### 3k. PROPULSION LAB (KS3 Ratio, Proportion & Rates of Change)

Where propellant is mixed and performance-per-unit is calculated: mixing vats,
a blueprint table with scale drawings, and a test stand.

| Curriculum code | Engineering task |
|---|---|
| KS3R-1 (convert standard units) | "The pump moves 0.35 m³ of oxidiser. The gauge reads in litres — what should it show?" |
| KS3R-2 (scale factors, scale diagrams, maps) | "The blueprint is drawn at 1:200. The hull measures 4.5 cm on paper. How tall is the real rocket?" |
| KS3R-3 (one quantity as a fraction of another) | "The upgraded tank holds 900 L; the old one held 600 L. Express the new capacity as a fraction of the old for the upgrade report." |
| KS3R-4 (ratio notation, simplest form) | "The vat mixed 240 L fuel with 160 L oxidiser. Write the mix ratio in simplest form for the propellant label." |
| KS3R-5 (divide in a given ratio) | "Mix 500 L of propellant at fuel:oxidiser 7:3. How many litres of each go into the vat?" |
| KS3R-6 (multiplicative relationships as ratio/fraction) | "Every 2 kg of fuel needs 5 kg of oxidiser. The loading computer wants this as a single multiplier — fuel × what gives oxidiser?" |
| KS3R-7 (link ratios to fractions & linear functions) | "The mix line on the graph passes through (2, 5) and (4, 10). What does its steepness tell you about the fuel:oxidiser ratio?" |
| KS3R-8 (percentage change, original value, simple interest) | "After a 20% mass-saving redesign, the fin assembly weighs 96 kg. What did it weigh before? The certification file needs the original." |
| KS3R-9 (direct & inverse proportion) | "With 2 pumps the tank fills in 30 minutes. The launch window closes in 12 minutes — how many pumps does the pad crew need?" |
| KS3R-10 (compound units: speed, unit pricing, density) | "The probe must cover 384,000 km to the Moon in 80 hours. What average speed must the guidance computer hold?" |

**Visual**: mixing vats with two coloured liquids that pour in ratio, a
blueprint that zooms between paper size and real size, and a live speed /
density readout on the test stand.

### 3l. TRAJECTORY PLANNER (KS3 Geometry & Measures)

A giant plotting table + holographic Earth where flight paths, antenna angles
and tank volumes are worked out with real geometry tools.

| Curriculum code | Engineering task |
|---|---|
| KS3G-1 (area/perimeter formulae; volume of prisms & cylinders) | "The fuel tank is a cylinder: radius 1.5 m, height 8 m. The loading computer needs its volume before fuelling. Work it out." |
| KS3G-2 (circles & composite shapes) | "The heat-shield is a disc of radius 2.2 m. How much ablative coating (area) does the workshop need to spray?" |
| KS3G-3 (draw/measure segments & angles, scale drawings) | "On the 1:50 pad drawing, measure the gantry angle with the protractor and mark the crane arm 3.4 cm long." |
| KS3G-4 (ruler & compass constructions) | "The abort corridor must split the launch angle exactly in half. Bisect the angle on the plotting table using compasses." |
| KS3G-5 (conventional terms: parallel, perpendicular, polygons, symmetry) | "The solar array is a regular hexagon. Sketch it on the table and mark its lines of symmetry for the deployment check." |
| KS3G-6 (triangle labelling & congruence criteria) | "Struts ABC and DEF have two equal sides and the same included angle. Can the inspector certify them identical? Which rule applies?" |
| KS3G-7 (properties of triangles, quadrilaterals, circles) | "The service door is a quadrilateral with two pairs of parallel sides. What shape is it, and what does that guarantee about its opposite sides?" |
| KS3G-8 (translations, rotations, reflections) | "Rotate the docking port drawing 90° about the hull centre so it lines up with the station adapter. Describe the transformation for the log." |
| KS3G-9 (congruent triangles; enlargement & similar shapes) | "Enlarge the fin template by scale factor 3 from the origin so it fits the Mk3 booster. Plot the new corners." |
| KS3G-10 (angles at a point / straight line / vertically opposite) | "Three support struts meet at a point on the gantry. Two angles read 115° and 90°. What must the third strut's angle be?" |
| KS3G-11 (parallel lines: alternate & corresponding angles) | "The launch rail crosses two parallel support beams at 38°. Without measuring, what angle does it make with the second beam — and why?" |
| KS3G-12 (angle sums in triangles & polygons) | "The antenna dish rim is a regular octagon. What is each interior angle? The fabricator needs it to bend the rim segments." |
| KS3G-13 (derive results incl. Pythagoras; simple proofs) | "Prove to the safety board that the 3-4-5 m access ramp really contains a right angle — show the check that certifies it." |
| KS3G-14 (Pythagoras & trig ratios in right-angled triangles) | "At cutoff the rocket is 400 km up and 300 km downrange. The tracking dish needs the straight-line distance — calculate it." |
| KS3G-15 (3-D solids: faces, edges, vertices) | "The cargo container is a hexagonal prism. Count its faces, edges and vertices for the packing manifest." |
| KS3G-16 (relationships algebraically & geometrically) | "The ascent line on the plot climbs 40 km for every 1 minute. Express the path as a rule AND sketch it — the two must match." |

**Visual**: a 3D plotting table with draggable compass/protractor/set-square
tools, a right-triangle overlay that appears between rocket and tracking dish,
and tank meshes whose volume readout fills as dimensions are set.

### 3m. MISSION ASSURANCE (KS3 Probability)

The risk-analysis office: a weather board, component test benches, and a big
0–1 probability dial for every mission subsystem.

| Curriculum code | Engineering task |
|---|---|
| KS3P-1 (record/analyse outcomes, 0–1 scale, fairness) | "The weather team ran 20 balloon tests: 14 clear, 6 stormy. Set the launch-weather dial to the experimental probability of clear skies." |
| KS3P-2 (probabilities sum to 1) | "Flight review: P(perfect ascent) = 0.85, P(minor wobble) = 0.10. The board insists every outcome is covered — what's P(abort)?" |
| KS3P-3 (sets, unions/intersections, tables, grids, Venn diagrams) | "40 valves were tested: 28 passed pressure, 25 passed cold-soak, 18 passed both. Sort them into the Venn board — how many failed both tests?" |
| KS3P-4 (theoretical sample spaces & probabilities) | "The capsule has two independent parachute switches, each equally likely to be ON or OFF after re-entry shake. List the sample space — what's the probability at least one is ON?" |

**Visual**: a draggable 0–1 probability dial, a Venn diagram board where valve
tokens are sorted into regions, and a sample-space grid that fills in as
outcomes are enumerated.

### 3n. TELEMETRY CENTRE (KS3 Statistics)

A wall of live flight data from every mission Artie has flown — his OWN Dexie
mission history becomes the dataset wherever possible, so the statistics are
about *his* rockets.

| Curriculum code | Engineering task |
|---|---|
| KS3S-1 (describe/compare distributions; mean, median, mode, range, outliers) | "Your last 7 flights reached 120, 145, 130, 300, 135, 128 and 140 km. Find the mean and median apogee — and flag the outlier the review board should investigate." |
| KS3S-2 (construct/interpret tables, bar charts, pie charts, grouped data) | "Mass budget: engines 40%, fuel 35%, payload 15%, avionics 10%. Build the pie chart for the mission readiness review." |
| KS3S-3 (bivariate data & scatter graphs) | "Plot fin area against stability margin for your last 10 designs on the scatter board. What relationship should the aerodynamics memo report?" |

**Visual**: live bar/pie charts built by dragging segments, a scatter board
where each past mission appears as a plotted rocket icon, and an outlier that
literally glows red on the chart until Artie flags it.

---

## 4. Tech Stack & Architecture

### Stack
- **React 18** + TypeScript + Vite (port 3003)
- **Tailwind CSS** for UI panels/HUD
- **Three.js** via `@react-three/fiber` (v8, React 18 compat) + `@react-three/drei`
- **Zustand** for app/rocket state (simple, works inside and outside the Canvas)
- **react-router-dom** for page routing
- **Dexie.js** (IndexedDB) for local-first storage — no backend
- **@google/genai** (Gemini API) — text model `gemini-3-flash-preview` for the
  AI Flight Director (§5a) and image models for the Mission Camera (§5b).
  Keys read from `.env.local` (`VITE_GEMINI_API_KEY` + pool); the app must
  remain fully playable without a key or network
- **Vitest** for unit tests (task templates + physics — see §9)
- **pnpm** package manager
- Start with `./run.sh` — note: it runs `tsc -b` before starting the dev server,
  so the project MUST type-check cleanly or it won't start

### Project structure
```
src/
  main.tsx                    # entry point
  index.css                   # Tailwind + space theme
  app/
    App.tsx                   # router, layout, nav
  curriculum/
    types.ts                  # Strand, KeyStage, Criterion types
    criteria.ts               # All 146 criteria: 81 KS1–KS2 RTP + 65 KS3 (see §6)
  db/
    db.ts                     # Dexie schema (profiles, attempts, missions)
    seed.ts                   # initial data
  engine/
    types.ts                  # GeneratedTask (not "question"), VisualSpec
    rng.ts                    # seeded random
    mastery.ts                # XP, mastery tracking, spaced repetition
    index.ts                  # generateTask() dispatcher
    templates/
      nosecone.ts             # Geometry tasks for nose cone design
      hull.ts                 # NPV tasks for hull dimensions
      fuel.ts                 # NPV+F tasks for fuel loading
      engine.ts               # NF+MD tasks for engine specs
      fins.ts                 # G+AS tasks for fin placement
      payload.ts              # F+MD tasks for payload loading
      electronics.ts          # AS+AS/MD tasks for circuit/power grid design
      checklist.ts            # NF rapid-fire pre-flight checks
      ks3/
        rdlab.ts              # KS3 Number tasks (standard form, powers, %, rounding) — §3i
        guidance.ts           # KS3 Algebra tasks (formulae, equations, graphs, sequences) — §3j
        propulsionLab.ts      # KS3 Ratio & proportion tasks (mixes, scale, speed, density) — §3k
        trajectory.ts         # KS3 Geometry tasks (Pythagoras, trig, area/volume, angles) — §3l
        assurance.ts          # KS3 Probability tasks (risk dials, Venn, sample spaces) — §3m
        telemetry.ts          # KS3 Statistics tasks (averages, charts, scatter) — §3n

  ai/
    gemini.ts                 # @google/genai client wrapper + model config
    flightDirector.ts         # shared system prompt (persona + guardrails)
    hints.ts                  # adaptive hint generation from wrong answers
    paraphrase.ts             # briefing variety (numbers preserved, validated)
    debrief.ts                # after-action report narration
    chiefEngineer.ts          # "Ask the Chief Engineer" Q&A
    missionPhoto.ts           # Gemini image repaint of canvas screenshots (§5b)
    fallbacks.ts              # static text used when offline / no key / invalid

  physics/
    computePerformance.ts     # RocketDesign → RocketPerformance (TWR, Δv, drag, etc.)
    simulateFlight.ts         # Step-by-step flight sim from performance stats
    types.ts                  # RocketPerformance interface
  three/
    RocketScene.tsx           # Canvas, lighting, stars, launchpad
    Rocket3D.tsx              # Parametric 3D rocket (all parts)
    AttachmentNodes.tsx       # Green/red snap markers + drag-drop ghosting
    NoseCone3D.tsx            # Nose cone mesh + protractor overlay

    Hull3D.tsx                # Hull mesh + ruler/panel overlay
    FuelTank3D.tsx            # Translucent tank + liquid level
    Engine3D.tsx              # Engine bell + nozzle + bolts
    Fins3D.tsx                # Fins + coordinate grid overlay
    PayloadBay3D.tsx          # Payload compartments + crates
    ElectronicsBay3D.tsx      # Circuit breadboard + LEDs + power traces
    Booster3D.tsx             # Radial boosters (separate + tumble at staging)
    LaunchAnimation.tsx       # Countdown → liftoff → staging → orbit

    rocketDesign.ts           # RocketDesign state type
    overlays.ts               # Protractor, ruler, grid overlays in 3D
    SiteTerrain.tsx           # Google 3D Tiles terrain for chosen launch site
    MissionControlWing.tsx    # 3D wing with the six KS3 stations (§3i–3n)
    stations/                 # One 3D set-piece per station (lab bench, console,
                              #   plotting table, Venn board, telemetry wall)
  mission/
    stages.ts                 # Stage definitions (nosecone, hull, etc.)
    destinations.ts           # Destination configs (orbit, moon, mars, deep,
                              #   jupiter, saturn, interstellar — KS3 advanced)
    stations.ts               # MissionStation configs + KS2-strand unlock rules (§6b)
    launchSites.ts            # Real-world spaceport configs (lat/lon, flavour)
    parts.ts                  # Part → strand mapping, upgrade levels
    partsCatalog.ts           # PartVariant definitions per category (Kerbal-style)
    patches.ts                # Mission patch (badge) definitions
    runPlanner.ts             # Plan which criteria each stage pulls
    recordMission.ts          # Save mission results
    useRocketState.ts         # Hook: current rocket progress
    sound.ts                  # Optional SFX (off by default)
  features/
    roster/
      RosterPage.tsx          # Commander Roster: pick / create / switch profiles on load
      ProfileCard.tsx         # Name, rocket thumbnail, XP, streak per profile
    hangar/
      HangarPage.tsx          # Home: 3D rocket on pad, destinations, progress
      SitePicker.tsx          # Pick a real global launch site (§5b)
    vab/
      VABPage.tsx             # Vehicle Assembly Building: free assembly
      PartsTray.tsx           # Kerbal-style categorised parts catalogue
      StagePanel.tsx          # Engineering task panel for the selected part
    missioncontrol/
      MissionControlPage.tsx  # KS3 Advanced Programme: the six stations (§3i–3n)
      StationPanel.tsx        # Task panel for the selected station (reuses TaskRenderer)
    launch/
      LaunchPage.tsx          # 3D launch sequence + result
    report/
      ReportPage.tsx          # After-action report
    flightlog/
      FlightLogPage.tsx       # Telemetry console, coverage map, patches
    sandbox/
      SandboxPage.tsx         # Free-design with sliders, see maths needed
  components/
    TaskRenderer.tsx           # Dispatches to correct interactive widget
    ViewSwitcher.tsx           # Workshop/Photo/Poster mode pill (§5b, from Gaudi)
    widgets/
      ProtractorWidget.tsx    # Drag to set/measure angles
      RulerWidget.tsx         # Drag to measure lengths
      FuelGaugeWidget.tsx     # Drag slider to fill tank
      NumberLineWidget.tsx    # Place values on a line
      RatioMixerWidget.tsx    # Mix two quantities
      PayloadSplitWidget.tsx  # Drag crates into compartments
      GridWidget.tsx          # Coordinate grid for plotting
      CircuitWidget.tsx       # LED board, power traces, resistor labels
      BarModelWidget.tsx      # Draggable bar model for 2-unknowns problems
      ChecklistWidget.tsx     # Rapid-fire timed panel
      GraphWidget.tsx         # Plot/read linear & quadratic graphs, 4 quadrants (KS3)
      EquationWidget.tsx      # Build/solve equations & rearrange formulae (KS3)
      ScaleDiagramWidget.tsx  # Scale drawings, enlargements, transformations (KS3)
      ConstructionWidget.tsx  # Ruler & compass constructions, bisectors (KS3)
      VennWidget.tsx          # Sort outcomes into Venn regions / sample-space grids (KS3)
      DataChartWidget.tsx     # Build/read bar, pie & scatter charts (KS3)
      RiskDialWidget.tsx      # 0–1 probability dial (KS3)

```

### Key types

```ts
// A task is an engineering problem, not a "question"
interface GeneratedTask {
  id: string;
  criterionCode: string;
  rocketPart: RocketPart;         // "noseCone" | "hull" | "fuelTank" | ...
  station?: MissionStation;       // set for KS3 tasks — where the task is worked on
  tier: number;                   // 1 = easy, 2 = medium, 3 = hard
  briefing: string;               // "The nose cone needs a 90° joint..."
  engineeringContext: string;     // "Getting this angle right reduces drag by 12%"
  answer: string;
  choices?: string[];
  workedSteps: string[];
  hints: string[];
  visual: VisualSpec;             // ALWAYS present — every task is visual
  rocketEffect: RocketEffect;    // what changes on the 3D rocket when answered
}

interface RocketEffect {
  property: string;    // e.g. "noseAngle", "tankFill", "thrustPerEngine"
  correctValue: number;
  incorrectValue: number;  // graceful degradation, not broken
  unit: string;
}

type RocketPart = "noseCone" | "hull" | "fuelTank" | "engine" | "fins" | "payloadBay" | "electronics" | "booster";

// The six KS3 Mission Control stations (§3i–3n). KS3 tasks always name a
// station AND a rocketPart — the station is where the work happens, the
// rocketPart is what the answer changes (e.g. a Trajectory Planner task
// still reshapes the fuel tank whose volume was calculated).
type MissionStation = "rdLab" | "guidanceComputer" | "propulsionLab"
                    | "trajectoryPlanner" | "missionAssurance" | "telemetryCentre";

// A catalogue entry (Kerbal-style part with stats and trade-offs)
interface PartVariant {
  id: string;                     // "needle-cone-mk2"
  part: RocketPart;
  name: string;                   // "Needle Cone Mk2"
  description: string;            // shown on the hover stat card
  stats: Partial<RocketDesign>;   // base values this variant contributes
  unlockLevel: 1 | 2 | 3;         // tied to strand mastery (§7)
}

// A part attached to the rocket in the VAB
interface InstalledPart {
  variantId: string;
  certified: boolean;             // all engineering tasks complete
  attachment: "stack" | "radial";
  radialCount?: 2 | 3 | 4;        // symmetry setting (fins/boosters)
}

// Describes the interactive widget shown with a task
interface VisualSpec {
  widget: "protractor" | "ruler" | "fuelGauge" | "numberLine" | "ratioMixer"
        | "payloadSplit" | "grid" | "circuit" | "barModel" | "checklist"
        // KS3 widgets (§3i–3n):
        | "graph" | "equation" | "scaleDiagram" | "construction"
        | "venn" | "dataChart" | "riskDial";
  // Widget-specific config, e.g. { min: 0, max: 5, step: 0.5 } for a number line
  config: Record<string, number | string | boolean>;
}

interface RocketDesign {
  noseAngle: number;        // degrees
  noseHeight: number;       // metres
  hullHeight: number;       // metres
  hullRadius: number;       // metres
  hullPanels: number;       // count
  tankFill: number;         // 0..1
  fuelRatio: number;        // fuel:oxidiser
  engineCount: number;
  thrustPerEngine: number;  // kN
  finCount: number;
  finAngle: number;         // degrees
  finSymmetry: boolean;
  payloadPods: number;
  payloadPerPod: number;
  circuitsWired: number;    // count of completed electronics tasks
  powerBalanced: boolean;   // electronics bay status
  boosterCount: number;     // radial boosters (0 = no staging event)
  installedParts: Partial<Record<RocketPart, InstalledPart>>;  // VAB assembly state
}
```

### Dexie schema

```ts
db.version(1).stores({
  profiles: "id",           // Profile — one row per child ("artie", "walter", …)
  attempts: "++id, profileId, criterionCode, createdAt",   // Attempt
  missions: "++id, profileId, destinationId, createdAt",   // MissionRecord
});

interface Profile {
  id: string;               // slug of the name, e.g. "artie", "walter"
  name: string;             // display name chosen on the Commander Roster
  createdAt: number;
  xp: number;
  launchStreak: number;     // consecutive days with ≥1 launch
  lastPlayedAt: number;
  rocketDesign: RocketDesign;      // persisted rocket (rule: "the rocket is continuous")
  launchSiteId: string;            // chosen real-world spaceport (§5b), seed "canaveral"
  partLevels: Record<RocketPart, 1 | 2 | 3>;
  patches: string[];               // earned mission patch ids
  // NOTE: KS3 station unlocks are NOT stored — they are derived in mastery.ts
  // from KS2 strand mastery over the attempts table (§6b), same "never drift"
  // rule as spaced repetition.
}

interface Attempt {
  id?: number;
  profileId: string;        // owning profile — every query filters on this
  criterionCode: string;
  tier: number;
  correct: boolean;
  hintsUsed: number;
  missionId?: number;
  createdAt: number;
}

interface MissionRecord {
  id?: number;
  profileId: string;        // owning profile
  destinationId: string;
  launchSiteId?: string;    // spaceport the mission launched from (§5b)
  tasksCorrect: number;
  tasksTotal: number;
  maxAltitudeKm: number;
  reachedDestination: boolean;
  screenshot?: string;      // dataURL of launched rocket (see §14)
  photos?: string[];        // AI mission photos / posters (§5b)
  createdAt: number;
}
```

Mastery state (streaks, last-seen, due dates for spaced repetition) is **derived
from the `attempts` table** — don't store it separately, compute it in
`mastery.ts` so it can never drift out of sync.

**Profile selection (Commander Roster):**
- On app load, route to the Commander Roster (`features/roster/RosterPage.tsx`)
  unless a valid `activeProfileId` is stored in `localStorage` — then go
  straight to that commander's Hangar (kids shouldn't re-pick every visit)
- The roster shows one **profile card per row in `profiles`** (name, rocket
  thumbnail, XP, streak) plus a "➕ New Commander" card that asks only for a
  name (no passwords, no accounts — this is a device shared by siblings)
- A small "Switch Commander" control in the Hangar header returns to the
  roster at any time
- **Everything is scoped to the active profile**: rocket design, XP, mastery,
  spaced repetition, station unlocks, patches, missions, photos. Every Dexie
  query for `attempts`/`missions` MUST filter by `profileId` — one child's
  answers must never affect another's mastery or rocket
- Seed nothing by default: the first run shows an empty roster with the
  "New Commander" card (optionally pre-suggest "Artie" and "Walter" as
  one-tap quick-create chips)

---

## 5. The 3D Interactive Experience (Kerbal-style)

The 3D scene is NOT just a pretty background — it's the **primary interface**.
Artie designs in 3D, sees physics consequences in real time, and the rocket he
launches is the exact rocket his maths built.

### Vehicle Assembly Building (VAB) — Kerbal-style free assembly

The VAB is NOT a fixed wizard that marches through parts in order. Like Kerbal
Space Program, Artie **assembles his rocket freely from a parts catalogue** and
the maths is the certification that makes each part flight-worthy.

**Parts catalogue (left tray, Kerbal-style):**
- Categorised tabs: Nose Cones, Hulls, Fuel Tanks, Engines, Fins, Payload Bays,
  Electronics, Boosters
- Each category has **2–4 variants** with genuinely different stats — e.g.
  "Stubby Cone" (forgiving, more drag) vs "Needle Cone Mk2" (low drag, needs
  precise angle work); "Hound" engine (low thrust, light) vs "Mastiff" (high
  thrust, heavy). Variants create real Kerbal-style trade-offs via
  `computePerformance`
- Hovering a part shows a **holographic stat card**: mass, thrust, capacity,
  drag, and which maths strand certifies it
- Higher-level variants unlock via strand mastery (§7 rocket upgrades) — the
  catalogue visibly grows over the summer

**Drag & drop assembly with attachment nodes:**
- Drag a part from the tray into the 3D scene — it follows the cursor as a
  translucent ghost
- **Green node markers** (Kerbal-style) show valid attachment points: nose
  stacks on top, hull sections stack, engines mount below, fins and boosters
  attach radially. Invalid spots glow red and the part won't snap
- **Radial symmetry tool**: a ×2 / ×3 / ×4 toggle for fins and boosters —
  place one and its mirrors appear around the hull automatically. This makes
  the 4G-1 symmetry maths physical and visible
- Detach any part by dragging it back to the tray

**Draft → Certified workflow (where the maths lives):**
- A freshly attached part is a ghosted **DRAFT** — visibly not flight-ready
- Clicking a draft part opens its **engineering tasks** in the stage panel;
  completing them tunes the part (sets its angle / fill / thrust / wiring) and
  **CERTIFIES** it: full materials, subtle emissive pulse, green tag
- **Any build order** — Artie chooses what to work on. The only rule: every
  attached part must be certified before launch; the pre-flight checklist
  flags uncertified parts amber
- **Re-edit anytime**: click a certified part to re-open its tuning tasks,
  swap its variant, or move it — agency first, the maths gates flight-
  readiness, never creativity

**Scene basics:**
- **Full-screen R3F Canvas** with the rocket on a launchpad, orbitable camera
  (OrbitControls), realistic lighting (HDR environment), and a starfield backdrop
- Camera **smoothly animates** (using `useSpring` or `lerp` in `useFrame`) to
  zoom into whichever part is being worked on — nose cone: top-down close-up,
  engine: bottom-up, fins: side view, etc.
- The rocket is built from **individual R3F components** that mount/unmount as
  parts are attached: `<NoseCone3D />`, `<Hull3D />`, `<FuelTank3D />`, etc.
- **Parts are clickable** (raycasting via `onClick` on meshes) to select and
  inspect them. Hovering shows a tooltip with part specs.

### Live Rocket Physics Dashboard
A **real-time performance readout** panel (rendered via drei's `<Html>` or as a
HUD overlay) that updates instantly as design parameters change:

```
┌─────────────────────────────────────────┐
│  🚀 ROCKET PERFORMANCE                 │
│                                         │
│  Total mass:      2,450 kg  ████████░░  │
│  Total thrust:      600 kN  ██████████  │
│  TWR (thrust/weight): 2.5   ✅ GO       │
│  Δv (delta-v):    3,200 m/s ████████░░  │
│  Drag coefficient:  0.32    ██████░░░░  │
│  Stability margin:   1.4    ✅ STABLE   │
│  Max altitude:    ~180 km   ████████░░  │
│  Fuel duration:      45 s   ██████░░░░  │
│                                         │
│  Status: FLIGHT-READY ✅                │
│  Destination: Low Orbit (needs 150 km)  │
└─────────────────────────────────────────┘
```

**This dashboard is computed from `RocketDesign` in real time:**
```ts
function computePerformance(design: RocketDesign): RocketPerformance {
  const dryMass = design.hullHeight * 80 + design.engineCount * 120
                + design.finCount * 35 + design.payloadPods * design.payloadPerPod * 25
                + design.boosterCount * 150;
  const fuelMass = design.tankFill * design.hullHeight * 200;
  const totalMass = dryMass + fuelMass;
  const totalThrust = design.engineCount * design.thrustPerEngine
                    + design.boosterCount * 400; // boosters: big thrust, jettisoned at staging
  const twr = totalThrust / (totalMass * 0.0098); // thrust-to-weight ratio
  const exhaustVelocity = 2500; // m/s (simplified)
  const deltaV = exhaustVelocity * Math.log((dryMass + fuelMass) / dryMass);
  const dragCoeff = 0.5 - (design.noseAngle / 360) * 0.3; // sharper nose = less drag
  const stability = design.finCount >= 3 && design.finSymmetry ? 1.0 + design.finCount * 0.1 : 0.3;
  const burnTime = fuelMass / (design.engineCount * design.thrustPerEngine * 0.4);
  const maxAltitude = deltaV * burnTime * 0.5 * (1 - dragCoeff) / 1000; // simplified km

  return { totalMass, totalThrust, twr, deltaV, dragCoeff, stability, burnTime, maxAltitude,
           flightReady: twr > 1.2 && stability > 0.8 && design.tankFill > 0.2 };
}
```

**When Artie changes a design parameter, he sees the consequences immediately:**
- Sets the nose cone angle too wide → drag goes UP, max altitude goes DOWN
- Adds more fuel → mass goes UP, burn time goes UP, but TWR drops
- Adds an engine → thrust goes UP, TWR improves, but mass also increases
- Not enough fins → stability turns RED, "⚠️ UNSTABLE — add more fins"
- Fuel too low → burn time too short, can't reach destination

This creates a **genuine engineering feedback loop** — the child learns that maths
decisions have physical consequences, and can experiment to find the sweet spot.

### Interactive 3D Design Actions
These happen IN the 3D scene, not in flat HTML:

- **Drag the nose cone tip** up/down → changes the cone angle, protractor rotates
  with it, drag coefficient updates in the dashboard
- **Drag the fuel fill slider** on the translucent tank → liquid rises/falls,
  mass and burn time update, TWR recalculates
- **Click an "add engine" button** → a new engine mesh appears at the base,
  thrust increases, mass increases, performance recalculates
- **Drag fins** from a parts tray onto the rocket body → they snap to evenly-spaced
  positions, stability margin updates
- **Rotate a protractor** attached to the nose cone → the angle readout updates
  and the part reshapes
- **Drag payload crates** from a dock into compartments → the 3D crates stack
  inside the bay, mass updates, centre of gravity shifts

### Launchpad & Gantry
- The rocket sits on a **detailed 3D launchpad** with:
  - Concrete pad with blast deflector
  - Service tower / gantry (retracts at launch)
  - Fuel umbilicals (disconnect at T-0)
  - Launch clamps that release
- The launchpad is set in a scene with:
  - Ground plane with terrain texture
  - Sky dome / starfield (transitions from day to night during launch)
  - Distant hills / ocean horizon

### Launch Sequence (fully 3D animated)
After all parts are built and performance is flight-ready:
1. Camera pulls back to show full rocket + launchpad
2. **Service tower retracts** (gantry arm swings away)
3. **Fuel umbilicals disconnect** (hoses detach)
4. **Countdown** T-3…T-2…T-1… (each number overlaid via drei `<Html>`)
5. **T-0 Ignition** — engine flame particle system ignites, smoke billows from
   deflector (buffer geometry particles), camera shakes slightly
6. **Launch clamps release** — rocket begins to rise
7. **Liftoff** — rocket climbs, camera tracks upward, ground falls away
8. **Max-Q** — atmosphere effects, slight vibration
9. **Staging** (if boosters present) — booster meshes separate and tumble away
10. **Upper atmosphere** — flame colour shifts, sky darkens to black
11. **Engine cutoff + coast** — flame disappears, rocket drifts
12. **Arrival** — destination appears (Earth from orbit, Moon surface, Mars, etc.)
13. Flight height = f(deltaV, drag, stability, burn time) from the ACTUAL design

**The flight doesn't just play a canned animation** — the actual trajectory is
computed from the rocket's performance stats. A rocket with bad TWR struggles off
the pad. One with too much drag arcs over. One with low fuel runs out early.
The child sees EXACTLY how their maths choices affected the flight.

### Post-Flight Replay
After landing/arriving, Artie can watch a **mini flight replay** showing:
- The trajectory arc overlaid on a 2D plot (altitude vs. time)
- Key moments annotated: "TWR dropped below 1 at T+12s — too heavy!"
- "Drag was high because the nose angle was 60° — a sharper cone would help"
- Comparison with "optimal" trajectory

### Hangar (Home Screen)
- Full 3D scene: Artie's current best rocket on the pad, slowly rotating
- **Planet destinations** as 3D spheres orbiting in the background (clickable)
- Telemetry readouts as holographic HUD panels in the scene
- "Enter the VAB" button (a big red button on the control desk in 3D)
- Launch site card: current spaceport name + flag, with a "change site"
  button that opens the SitePicker (§5b)
- Recent flight trajectories shown as ghost arcs in the sky


---

## 5a. The AI Flight Director (Gemini LLM layer)

The app has exactly one AI integration: a **Gemini-powered "Flight Director"**
— the warm Mission Control voice that talks to Commander Artie. This makes
feedback feel personal and alive instead of canned.

**The golden rule: the LLM is a LANGUAGE layer, never a MATHS layer.** All
numbers, answers, tolerances, mastery logic, and physics stay 100%
deterministic in the template engine (§3, §7). Gemini never generates a task,
never checks an answer, and never decides progression — it only wraps
deterministic results in better words. If Gemini is unavailable (no key, no
network, timeout), the app falls back to static text and remains fully
playable.

### Setup

- SDK: `@google/genai` — `pnpm add @google/genai`
- Model: `gemini-3-flash-preview` (fast + cheap; every call here is
  child-facing and latency-sensitive)
- API keys: **already provided in `.env.local` at the repo root** (gitignored;
  `.env.example` documents the shape). Two variables:
  - `VITE_GEMINI_API_KEY` — the primary key
  - `VITE_GEMINI_API_KEY_POOL` — optional comma-separated backup keys; rotate
    to the next key on a rate-limit (429) or quota error, so the game never
    stalls mid-session
  This is a single-user local app, so client-side keys are acceptable. If no
  keys are set, log one console warning and run in fallback mode — never
  crash or block the game.

```ts
// src/ai/gemini.ts
import { GoogleGenAI } from "@google/genai";

const primary = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const pool = ((import.meta.env.VITE_GEMINI_API_KEY_POOL as string | undefined) ?? "")
  .split(",").map((k) => k.trim()).filter(Boolean);
const keys = [primary, ...pool].filter(Boolean) as string[];

let keyIndex = 0;
export const MODEL = "gemini-3.5-flash";

export function getClient(): GoogleGenAI | null {
  return keys.length ? new GoogleGenAI({ apiKey: keys[keyIndex] }) : null;
}
export function rotateKey(): void {
  // Call when a request fails with 429/quota — moves to the next pooled key
  keyIndex = (keyIndex + 1) % Math.max(keys.length, 1);
}

// Every call site MUST: (1) handle getClient() === null, (2) wrap calls in
// try/catch with a ~4s timeout (rotateKey() + one retry on 429),
// (3) fall back to static text from ai/fallbacks.ts.
```

### Where the LLM improves the experience

**1. Adaptive hints (highest value).** A static `hints` array can't see WHAT
Artie got wrong. On a wrong attempt, send Gemini the briefing, the correct
answer + worked steps, and *Artie's actual wrong answer*, and ask it to
diagnose the likely slip ("looks like you counted the rings but forgot each
ring has 10 panels") and produce ONE gentle, scaffolded nudge. This is the
difference between a worksheet and a tutor. Validate before showing: reject
any hint whose text contains the answer string or an operation symbol, and
fall back to the static hint.

**2. Briefing variety.** Templates reuse fixed sentence frames, so the fifth
fuel task reads like the first. Ask Gemini to paraphrase the template's
briefing (structured JSON output) while keeping every number, unit, and the
question intact. Validate mechanically: every numeric token from the original
must appear in the paraphrase, and no `+ − × ÷ =` symbols (§10 rule 4) — if
validation fails, ship the original template text. Cache paraphrases per
session so a task is never re-billed.

**3. After-action report narration.** Turn the mission stats (destination,
tasks correct/total, altitude reached, which design choices helped or hurt —
all computed deterministically by `simulateFlight`) into a short, personal
Flight Director debrief: "Commander, that needle cone you certified cut drag
beautifully — but we ran the tanks dry at T+38s. Next mission, take another
look at that 3/4 fill level." 3–4 sentences max, and it must reference at
least one specific thing Artie did this mission.

**4. "Ask the Chief Engineer".** A small help button on the task panel. Artie
can type a free-form question ("what does thrust mean?", "why do fins make it
stable?") and get a friendly, age-appropriate answer grounded in the current
task's context. The system prompt forbids solving the current task — the
Chief Engineer explains concepts, never gives answers.

**5. Streak & milestone flavour.** One-line personalised celebrations for
patches, streaks, and part upgrades ("Three days straight in the VAB,
Commander — the Mars programme is watching") instead of repeating the same
canned string every time.

### System prompt (shared persona + guardrails)

Keep one shared system prompt in `src/ai/flightDirector.ts`:

- You are the Flight Director at Mission Control, talking to Commander
  {profileName} (the active profile's name — e.g. Artie or Walter), a young
  rocket engineer around 10 years old. Warm, respectful, brief (2–4
  sentences). Never hard-code a name; always address the active commander.
- UK English and UK maths conventions (§7): £, commas as thousands separators.
- NEVER state the answer to any task, and never write bare sums or the
  symbols + − × ÷ = (§10). Talk about panels, bolts, litres, and degrees —
  never "addition" or "division".
- Never negative: banned words include "wrong", "incorrect", "failed" (§8 tone).
- Stay on rockets and maths; gently redirect anything else.

### Engineering guardrails

- **Deterministic core**: task generation, answer checking, mastery, and
  physics never call the LLM. All §9 unit tests must pass with no API key set
  (`getClient()` returning `null`).
- **Validate every output** before showing it (answer-leak check, operation-
  symbol check, length cap). Failed validation → static fallback, silently.
- **Fail soft & fast**: ~4s timeout; the answering flow must never block on
  Gemini — show the static hint immediately if the call is slow, and swap in
  the smarter one only if it arrives before Artie moves on.
- **Cache**: in-memory per session, keyed by `(taskId, wrongAnswer)` for hints
  and `taskId` for paraphrases — never pay twice for the same words.

---

## 5b. Launch Sites & View Modes (patterns from Gaudi)

### Global launch site picker

On first visit (and any time from the Hangar), Artie picks a **real-world
launch site**. The site drives the 3D terrain around the pad (Google
Photorealistic 3D Tiles, §14), the sun/time-of-day flavour, and the horizon he
sees at launch. Sites are purely atmospheric — they never change the maths or
difficulty.

`mission/launchSites.ts`:

```ts
interface LaunchSite {
  id: string;
  name: string;             // "Cape Canaveral"
  country: string;          // flag emoji + country
  lat: number;
  lon: number;
  description: string;      // one kid-friendly fact for the picker card
  terrain: "coastal" | "steppe" | "jungle" | "island";  // offline fallback ground
}

const LAUNCH_SITES: LaunchSite[] = [
  { id: "canaveral",   name: "Cape Canaveral",      country: "🇺🇸 USA",           lat: 28.3922, lon: -80.6077,  terrain: "coastal", description: "Where the Moon missions launched" },
  { id: "starbase",    name: "Starbase, Texas",     country: "🇺🇸 USA",           lat: 25.9972, lon: -97.1560,  terrain: "coastal", description: "Home of the biggest rocket ever built" },
  { id: "baikonur",    name: "Baikonur Cosmodrome", country: "🇰🇿 Kazakhstan",    lat: 45.9646, lon: 63.3052,   terrain: "steppe",  description: "The world's first and busiest spaceport" },
  { id: "kourou",      name: "Guiana Space Centre", country: "🇬🇫 French Guiana", lat: 5.2360,  lon: -52.7686,  terrain: "jungle",  description: "Near the equator — rockets get a free speed boost" },
  { id: "tanegashima", name: "Tanegashima",         country: "🇯🇵 Japan",         lat: 30.4008, lon: 130.9686,  terrain: "island",  description: "Called the most beautiful launch site on Earth" },
  { id: "vandenberg",  name: "Vandenberg",          country: "🇺🇸 USA",           lat: 34.7420, lon: -120.5724, terrain: "coastal", description: "Launches rockets out over the Pacific" },
  { id: "saxavord",    name: "SaxaVord, Shetland",  country: "🇬🇧 UK",            lat: 60.8167, lon: -0.7667,   terrain: "island",  description: "Britain's own spaceport — closest to home!" },
];
```

- **Picker UI** (`features/hangar/SitePicker.tsx`): a card grid (or a slowly
  spinning globe with pins) — each card shows the flag, name, and the
  one-line fact. Selection saves `launchSiteId` to the profile and the
  launchpad scene reloads its terrain.
- **Terrain**: the chosen site's lat/lon feeds the Google Photorealistic 3D
  Tiles setup (§14) via `VITE_GOOGLE_MAPS_API_KEY` — exactly how Gaudi's
  `GeospatialEnvironment.tsx` positions its site by latitude/longitude. If
  tiles fail (offline/quota), fall back to a stylised ground matching the
  site's `terrain` tag.
- **Flavour hooks**: the Flight Director (§5a) can name the site in debriefs
  ("beautiful lift-off over the Shetland coast, Commander"), and mission
  records store the site for the Flight Log.

### View modes — the Mission Camera (Gaudi's ViewSwitcher, adapted)

Gaudi's `ViewSwitcher.tsx` pill has three modes — `cad | fast | quality`.
Important: in Gaudi, "fast" and "quality" are **not WebGL quality tiers** —
they capture the canvas as a PNG and have a **Gemini image model repaint the
screenshot photorealistically**, shown as a pointer-transparent `<img>`
overlay on the canvas. Bring the same system over as the **Mission Camera**:

| Mode | Label | What it does |
|---|---|---|
| `cad` | 🛠 Workshop | The live interactive R3F viewport — the game is ALWAYS played here (default) |
| `fast` | 📸 Photo | Capture canvas → `gemini-3.1-flash-lite-image` repaints it photorealistically in seconds |
| `quality` | 🎞 Poster | Capture canvas → `gemini-3-pro-image-preview` (Nano Banana Pro) for a high-quality "mission poster" |

- **Client-side, no backend**: unlike Gaudi (which POSTs to a Python render
  service), call the image model directly with `@google/genai` using the §5a
  key pool. Prompt template: "Repaint this 3D render of a child's rocket on
  the launch pad at {site name} as a {style} photograph. Keep the rocket's
  shape, parts and colours exactly as shown."
- **Style presets** (Gaudi's `RenderStyle` set, adapted): `photorealistic`,
  `night-launch`, `watercolor`, `concept-art`, `toy-model` — a small style
  row appears when a photo mode is active.
- **Capture** reuses the §14 screenshot mechanism
  (`gl.domElement.toDataURL('image/png')` with a same-frame capture or
  `preserveDrawingBuffer`).
- **Overlay behaviour** (Gaudi pattern): the generated image sits as a
  non-interactive overlay; switching back to Workshop or moving the camera
  dismisses it. Show a "developing photo… 📷" shimmer while generating.
- **Launch Film (video)**: during the launch sequence, a 🎬 record button
  captures the canvas via `canvas.captureStream()` + `MediaRecorder` into a
  downloadable `.webm` of the flight — pure browser API, no AI, no backend.
- **Flight Log scrapbook**: every Photo/Poster and Launch Film is saved to
  the mission record (`photos` field) — over the summer Artie builds a
  scrapbook of every rocket he's flown.
- **Guardrails**: photo modes are cosmetic rewards, never required to play,
  and follow the §5a fallback rules — no key/network means the button simply
  saves the plain screenshot instead.

---

## 6. Curriculum Coverage

The syllabus is in two layers, totalling **146 criteria**:

- **§6a — KS1–KS2 (Years 1–6)**: the 81 DfE Ready-to-Progress criteria, taught
  through the VAB rocket parts (§3a–3h). This is the core summer curriculum.
- **§6b — KS3 (secondary)**: the 65 statements of the KS3 National Curriculum
  programme of study (`docs/SECONDARY_national_curriculum_-_Mathematics.pdf`),
  taught through the six Mission Control stations (§3i–3n). This is the
  Advanced Programme that carries Artie into September.

### 6a. KS1–KS2: Ready-to-Progress criteria (81 items)

Use the **DfE Ready-to-Progress criteria** for Years 1–6. Every criterion maps to
a specific rocket part and engineering task type:

| Strand | Rocket part(s) | Engineering context |
|--------|---------------|-------------------|
| NPV (Number Place Value) | Hull, Fuel gauge | Hull dimensions, panel counts, gauge readings, scaling |
| NF (Number Facts) | Engine, Pre-flight checklist | Bolt counts, injector calcs, system checks |
| AS (Addition & Subtraction) | Fins, Electronics bay | Weight budgets, rivets, power grid balancing, circuits |
| MD (Multiplication & Division) | Engine, Payload | Thrust calculations, payload distribution |
| F (Fractions) | Fuel system, Payload bay | Tank fill fractions, cargo splitting |
| G (Geometry) | Nose cone, Fins | Angles, coordinates, symmetry, shapes |
| AS/MD combined (Y6) | Electronics bay | Additive vs multiplicative, inverse ops, 2 unknowns, ratios |


Full criteria list (81 items):
```
NPV: 1NPV-1, 1NPV-2, 2NPV-1, 2NPV-2, 2NPV-3, 3NPV-1, 3NPV-2, 3NPV-3, 3NPV-4,
     4NPV-1, 4NPV-2, 4NPV-3, 4NPV-4, 5NPV-1, 5NPV-2, 5NPV-3, 5NPV-4,
     6NPV-1, 6NPV-2, 6NPV-3, 6NPV-4
NF:  1NF-1, 1NF-2, 2NF-1, 3NF-1, 3NF-2, 3NF-3, 4NF-1, 4NF-2, 4NF-3, 5NF-1, 5NF-2
AS:  1AS-1, 1AS-2, 2AS-1, 2AS-2, 2AS-3, 2AS-4, 3AS-1, 3AS-2, 3AS-3
MD:  2MD-1, 2MD-2, 3MD-1, 3MD-2, 4MD-1, 4MD-2, 4MD-3, 5MD-1, 5MD-2, 5MD-3,
     5MD-4, 6MD-1, 6AS/MD-1, 6AS/MD-2, 6AS/MD-3, 6AS/MD-4
F:   3F-1, 3F-2, 3F-3, 3F-4, 4F-1, 4F-2, 4F-3, 5F-1, 5F-2, 5F-3,
     6F-1, 6F-2, 6F-3
G:   1G-1, 1G-2, 2G-1, 3G-1, 3G-2, 4G-1, 4G-2, 4G-3, 5G-1, 5G-2, 6G-1
```

Cross-check this list against `docs/Maths_guidance_year_6.pdf` and the DfE
guidance for Years 1–5 before finalising `criteria.ts` — the official codes and
descriptions are the source of truth.

### 6b. KS3: secondary National Curriculum (65 items)

The KS3 programme of study has six domains. Assign each statement a code
(domain prefix + running number, in the order the statements appear in the
PDF) and map each domain to its Mission Control station:

| KS3 domain | Codes | Station (§) | Engineering context |
|---|---|---|---|
| Number | KS3N-1 … KS3N-16 | R&D Lab (§3i) | Standard form distances, powers & roots, percentages, negatives, rounding, error intervals |
| Algebra | KS3A-1 … KS3A-16 | Guidance Computer (§3j) | Flight-program formulae, throttle equations, ascent-profile graphs, staging sequences |
| Ratio, proportion & rates of change | KS3R-1 … KS3R-10 | Propulsion Lab (§3k) | Propellant mixes, scale blueprints, percentage change, proportion, speed & density |
| Geometry & measures | KS3G-1 … KS3G-16 | Trajectory Planner (§3l) | Pythagoras & trig on flight paths, tank volumes, angle facts, constructions, transformations |
| Probability | KS3P-1 … KS3P-4 | Mission Assurance (§3m) | Launch-weather odds, failure analysis, Venn boards, sample spaces |
| Statistics | KS3S-1 … KS3S-3 | Telemetry Centre (§3n) | Flight-data averages & outliers, mass-budget charts, scatter graphs of Artie's own missions |

Full KS3 criteria list (65 items):
```
KS3N: KS3N-1 … KS3N-16   (Number: 16 statements)
KS3A: KS3A-1 … KS3A-16   (Algebra: 16 statements)
KS3R: KS3R-1 … KS3R-10   (Ratio, proportion & rates of change: 10 statements)
KS3G: KS3G-1 … KS3G-16   (Geometry & measures: 16 statements)
KS3P: KS3P-1 … KS3P-4    (Probability: 4 statements)
KS3S: KS3S-1 … KS3S-3    (Statistics: 3 statements)
```

Cross-check the codes and descriptions against
`docs/SECONDARY_national_curriculum_-_Mathematics.pdf` (one code per bullet
point under each "Pupils should be taught to" heading, in order) before
finalising `criteria.ts` — the PDF is the source of truth. Ignore the
"Working mathematically" section as separate criteria: its fluency /
reasoning / problem-solving aims are baked into how every KS3 task is written
(multi-step, modelled, justified), not tracked as items.

**Station unlock rules (derived in `mastery.ts`, configured in
`mission/stations.ts`):**

| Station | Unlocks when Artie has mastered… |
|---|---|
| R&D Lab | 70% of NPV + NF criteria |
| Guidance Computer | 70% of AS + the four 6AS/MD criteria |
| Propulsion Lab | 70% of MD + F criteria |
| Trajectory Planner | 70% of G criteria |
| Mission Assurance | any 3 other stations open (needs broad fluency) |
| Telemetry Centre | any 3 other stations open + ≥5 recorded missions (needs real flight data) |

Locked stations are visible in the Mission Control wing but dark, with a
"POWER OFFLINE — master more KS2 systems" tag showing exactly which strand
feeds each one, so the KS3 programme acts as a pull, never a wall.

Every single criterion — KS2 and KS3 alike — MUST have at least one
engineering task template with a rocket/station context, visual widget, and a
visible effect (3D rocket change or station display change).

---

## 7. Difficulty & Progression

### 3 Difficulty Tiers
- **Tier 1**: Simpler numbers, multiple choice, more visual cues
- **Tier 2**: Larger numbers, fewer choices, some free-form entry
- **Tier 3**: Complex numbers, all free-form, multi-step problems

KS3 criteria use the same three tiers *within* each criterion (e.g. KS3A-7
tier 1 solves `t + 60 = 300`, tier 3 solves equations needing rearrangement).

### Destinations set difficulty
| Destination | Tier | Unlock |
|---|---|---|
| Low Orbit 🛸 | 1 | Always available |
| The Moon 🌙 | 1-2 | 10% KS2 mastery |
| Mars 🔴 | 2-3 | 30% KS2 mastery |
| Deep Space ✨ | 3 | 50% KS2 mastery |
| Jupiter 🪐 | KS3 1-2 | First Mission Control station open (§6b) |
| Saturn 💫 | KS3 2-3 | 25% KS3 mastery + 4 stations open |
| Interstellar 🌌 | KS3 3 | 50% KS3 mastery + all 6 stations open |

**Advanced missions**: a Jupiter/Saturn/Interstellar mission adds a **Mission
Control phase** before the VAB — the planner pulls 3–5 KS3 station tasks
(trajectory plots, propellant mixes, risk sign-offs) as the "mission science
package", then the VAB build runs as normal with KS2 criteria still woven in
as spaced-repetition reviews. KS2 is never abandoned; KS3 is layered on top.

### Mastery engine
- Track attempts per criterion (correct, total, streak, last seen)
- Mastery = 3 correct in a row at tier ≥ 2
- Spaced repetition: mastered items reappear after intervals (1 day → 3 days →
  7 days → 14 days; a wrong answer resets the interval)
- XP earned per correct answer (more for higher tier, less for hints used)
- The mission planner prioritises: (1) due spaced-repetition reviews,
  (2) criteria with recent wrong answers, (3) new criteria in curriculum order
  (Year 1 → Year 6 within each strand, then the strand's KS3 continuation once
  its station is open) — so Artie always starts with wins

### Answering flow (per task)
1. **Attempt 1 wrong** → gentle nudge ("Almost — check the readout") + the
   relevant widget highlights the key info. No penalty.
2. **Attempt 2 wrong** → offer a hint (costs a little XP). Hints scaffold the
   method, never state the answer. When Gemini is available, the hint is
   generated live from Artie's actual wrong answer (§5a); otherwise the
   template's static `hints` array is shown.
3. **Attempt 3 wrong** → show the worked steps ("engineering manual"), apply the
   `rocketEffect.incorrectValue` (part works, just not optimal), and re-queue
   the criterion for later in the mission or the next mission.
4. The part is never blocked — a mission can ALWAYS be completed and launched.

### Answer checking rules
- **Numeric entry**: accept equivalent forms — "56", "56.0", "56 kg" (strip
  units and thousands separators before comparing)
- **Measurement widgets** (protractor, ruler, gauge): accept a tolerance —
  ±3° for angles, ±2% for slider/gauge positions
- **Fractions**: accept equivalent fractions when the task doesn't demand
  simplest form ("2/4" ok for "1/2"); demand exact form only for simplify tasks
- **UK conventions**: £ for money, commas as thousands separators, "." decimal
  point — both in display and accepted input

### Rocket upgrades
Mastering criteria in a strand **upgrades the associated rocket part**:
- Level 1: Basic (everyone starts here)
- Level 2: Improved (master 2 criteria in the strand)
- Level 3: Advanced (master 5 criteria)

Upgrades are cosmetic but visible: shinier materials, more detail, particle
effects, colour changes. The rocket visually improves over the summer.

### Mission patches (badges)
Earned for milestones: first launch, first Moon mission, 5-day streak, master an
entire strand, perfect mission, etc. — plus KS3 milestones: first station
powered up, first Jupiter mission, "Secondary-Ready" (all six stations open),
master a KS3 domain, first Interstellar launch.

---

## 8. UI/UX Guidelines

### Visual identity
- **Deep space palette**: dark navy/indigo backgrounds, cyan/teal accents, warm
  amber for highlights
- **HUD-style panels**: thin borders, subtle glow, semi-transparent backgrounds
- **Font**: Lexend or Atkinson Hyperlegible for readability
- **Neon text glow** on key labels (cyan-on-dark)
- No clutter — big touch targets, lots of breathing room

### Tone
- Artie is "Commander" — he's respected and trusted
- Correct: "Locked in! ✅", "Spot on, Commander!", "Systems nominal"
- Wrong: "Almost — tweak it and try again", "Close! Check the readout"
- Never: "Wrong!", "Incorrect!", "Try harder"
- Worked solutions framed as "Here's the engineering manual"

### Accessibility
- `prefers-reduced-motion`: disable auto-rotation, simplify launch sequence
- All interactive widgets keyboard-accessible
- High contrast text (WCAG AA minimum)
- Sound off by default with toggle

### Sound (optional, off by default)
- Gentle beeps for countdown
- Satisfying click/snap when parts lock in
- Whoosh for launch
- No music (distracting for focus)

---

## 9. Build Phases

Build in this order. After each phase, verify the "Done when" criteria in the
browser at localhost:3003 before moving on. **Ship simple and working before
fancy** — a plain but playable phase beats a beautiful broken one.

Write **Vitest unit tests as you go** for the pure logic (no 3D):
- Every task template: generates a valid `GeneratedTask` for every tier, the
  `answer` is consistent with the numbers in the `briefing`, and the briefing
  contains no operation symbols (+, −, ×, ÷, =) — enforce §10 rule 4 in a test
  that runs against ALL templates
- `computePerformance` / `simulateFlight`: known designs produce expected TWR,
  Δv, and altitude ranges
- `mastery.ts`: mastery/streak/spaced-repetition logic
- `ai/` validators: answer-leak and operation-symbol checks on LLM output;
  every AI feature degrades cleanly to its static fallback when `getClient()`
  returns `null`

### Progress tracking & definition of done (MANDATORY process)

Development is only "done" when it is **provably** done. Follow this process
from the first commit:

**1. `PROGRESS.md` — the living status board.** Create it in Phase 1 at the
repo root, mirroring every checkbox in Phases 1–8 below. Tick items as they
are completed (with a one-line note of evidence), and when a phase's "Done
when" criteria pass, record a dated sign-off, e.g.:

```markdown
## Phase 3: Draft → Certified Workflow   Status: ✅ COMPLETE (2026-07-21)
- [x] Task templates for NOSE CONE — 8 templates, 24 tests passing
- [x] ProtractorWidget in 3D scene
Done-when verified: nose cone certified end-to-end in the browser,
attempt row visible in Dexie. `pnpm verify` green (58 tests).
```

Rules: never tick an item that hasn't been verified working in the browser or
by a test; never start phase N+1 while phase N has unticked items or a
failing "Done when" — unless the item is logged under a "Deferred" heading in
PROGRESS.md with a reason and a phase where it will be picked up.

**2. `pnpm verify` — the single green/red command.** Add to package.json:
`"verify": "tsc -b && vitest run && tsx scripts/coverage-check.ts"`.
`scripts/coverage-check.ts` loads every template and **exits non-zero**,
listing: any of the 146 criteria (81 KS2 + 65 KS3) with no working template,
any template whose briefing contains an operation symbol (§10 rule 4, with
the KS3 notation exception), and any part category or Mission Control
station with no tasks. It prints KS2 and KS3 coverage separately (e.g.
`KS2 81/81 ✅  KS3 40/65 ❌`) — Phases 4–7 gate on the KS2 count, Phase 8
gates on the full 146. Run `pnpm verify` before every phase sign-off and
before every commit.

**3. `/dev/status` — in-app status page (dev-only route).** Renders live:
the 146-criteria coverage map (KS2 strand × year grid PLUS a KS3 domain ×
station grid, green/red), template counts per part and per station, DB seed
status, Gemini key status (active / fallback mode), and the current phase
read from PROGRESS.md. This formalises Phase 4's "dev-only coverage check" —
build the skeleton in Phase 1 so gaps stay visible at a glance for the whole
build.

**4. Git discipline.** Commit at least once per completed checklist item with
a `phaseN:` prefix (e.g. `phase3: protractor widget + certification flow`) so
progress is auditable from `git log` alone.

**5. Final acceptance.** The project is complete ONLY when: `pnpm verify` is
green, `/dev/status` shows 146/146 criteria covered (81 KS2 + 65 KS3), and
every §15 success criterion has been walked through in a real browser session
and signed off (numbered + dated) at the bottom of PROGRESS.md.

### Phase 1: Foundation
- [ ] Vite + React 18 + TS + Tailwind project setup
- [ ] Dexie DB with multi-profile schema (`profileId` on attempts/missions)
- [ ] Commander Roster on load: pick / create / switch profiles (any name —
      Artie, Walter, …), `activeProfileId` persisted to localStorage (§4)
- [ ] Curriculum types + all 146 criteria (81 KS2 RTP + 65 KS3, §6a/§6b)
- [ ] Basic routing (Roster, Hangar, VAB, Launch, FlightLog)
- [ ] Space theme CSS
- [ ] Gemini client wrapper (`src/ai/gemini.ts`) reading `VITE_GEMINI_API_KEY`
      + `VITE_GEMINI_API_KEY_POOL` from the existing `.env.local` (key rotation
      on 429), running in fallback mode when no key is set
- [ ] `PROGRESS.md` status board + `pnpm verify` script + `/dev/status`
      skeleton (see "Progress tracking & definition of done" above)

**Done when**: `./run.sh` starts cleanly, all pages render with the space
theme, criteria are queryable from the DB, and a profile can be created on
the Commander Roster, picked, and is auto-selected on the next load.

### Phase 2: 3D Rocket + Kerbal Assembly
- [ ] Install three + @react-three/fiber (v8) + drei
- [ ] Parametric Rocket3D component with all 8 part types (incl. electronics + boosters)
- [ ] RocketScene with stars, lighting, launch pad, OrbitControls
- [ ] RocketDesign state that drives all part dimensions
- [ ] Parts catalogue data (`partsCatalog.ts`) + PartsTray UI with variants & stat cards
- [ ] Drag & drop assembly: attachment nodes, ghost preview, snap, detach
- [ ] Radial symmetry tool (×2/×3/×4) for fins and boosters
- [ ] Camera zoom-to-part animation

**Done when**: Artie can assemble a full rocket from the parts tray in any
order — parts ghost, snap to valid nodes (red on invalid), fins/boosters mirror
with the symmetry tool — and changing any `RocketDesign` value visibly reshapes
the rocket at 60fps.

### Phase 3: Draft → Certified Workflow (one part)
- [ ] GeneratedTask type with rocketPart, visual, rocketEffect
- [ ] Task templates for NOSE CONE (geometry strand)
- [ ] ProtractorWidget in 3D scene
- [ ] Draft/certified part states (ghosted → full material + green tag)
- [ ] VABPage: click a draft part → task panel opens, answers tune + certify it
- [ ] Correct/wrong feedback with 3D part update
- [ ] Adaptive Gemini hints wired into the answering flow (§5a, static fallback)

**Done when**: a nose cone can be dragged on (draft), clicked, certified
through its engineering tasks end-to-end — answer checked (with tolerances per
§7), rocket updates, attempt saved to Dexie. This establishes the pattern all
other parts copy.

### Phase 4: All Parts
- [ ] Hull templates (NPV) + RulerWidget
- [ ] Fuel templates (NPV+F) + FuelGaugeWidget
- [ ] Engine templates (NF+MD) + thrust gauge
- [ ] Fins templates (G+AS) + GridWidget
- [ ] Payload templates (F+MD) + PayloadSplitWidget
- [ ] Electronics templates (AS + AS/MD) + CircuitWidget + BarModelWidget
- [ ] Booster certification tasks (reuse engine NF+MD templates with booster context)
- [ ] Pre-flight checklist (NF rapid-fire) + ChecklistWidget + uncertified-part warnings

**Done when**: every KS2 criterion in §6a has at least one working template —
the `pnpm verify` coverage check reports `KS2 81/81 ✅` and `/dev/status`
shows the KS2 grid all green — and every part category in the catalogue can
be attached and certified through tasks. (KS3 coverage lands in Phase 8.)

### Phase 5: Mission Flow
- [ ] Launch site picker (SitePicker + launchSites.ts, §5b), persisted to profile
- [ ] Destination selection with unlock logic
- [ ] Mission planner (pick criteria per stage per destination)
- [ ] Full VAB → Pre-flight → Launch flow
- [ ] 3D launch animation (countdown, liftoff, staging, orbit)
- [ ] After-action report with "what maths flew this mission"
- [ ] AI-narrated Flight Director debrief on the report (§5a, static fallback)
- [ ] Mission save/resume (mid-build state persisted to Dexie)

**Done when**: the full loop Hangar → VAB → Checklist → Launch → Report →
Hangar works, flight altitude comes from `simulateFlight` (not a canned value),
and closing the tab mid-mission loses nothing.

### Phase 6: Progression
- [ ] Mastery tracking + XP + streaks
- [ ] Rocket part upgrades (Lv1 → Lv2 → Lv3)
- [ ] Mission patches (badges)
- [ ] Flight Log telemetry console
- [ ] Sandbox free-design mode

**Done when**: mastering criteria visibly upgrades parts, destinations unlock
at the right thresholds, and the Flight Log shows a per-strand coverage map.

### Phase 7: Polish
- [ ] Smooth camera transitions between stages
- [ ] Particle effects (engine flame, part lock-in sparkle)
- [ ] Physically-based atmospheric sky + launch transition (takram packages, see §14)
- [ ] Google 3D Tiles terrain at the chosen launch site (§5b + §14)
- [ ] Mission Camera view modes (Workshop/Photo/Poster) + Launch Film recording (§5b)
- [ ] Briefing paraphrase variety + "Ask the Chief Engineer" button (§5a)
- [ ] Milestone flavour lines for patches/streaks/upgrades (§5a)
- [ ] Sound effects (optional, off by default)
- [ ] `prefers-reduced-motion` fallbacks
- [ ] Keyboard accessibility for widgets
- [ ] Mobile-responsive layout

**Done when**: the §15 success criteria all pass in a real browser run-through.

### Phase 8: KS3 Advanced Programme (Mission Control)
- [ ] KS3 templates: R&D Lab (KS3N, 16) + GraphWidget-free number tasks — §3i
- [ ] KS3 templates: Guidance Computer (KS3A, 16) + GraphWidget + EquationWidget — §3j
- [ ] KS3 templates: Propulsion Lab (KS3R, 10) + RatioMixer reuse + ScaleDiagramWidget — §3k
- [ ] KS3 templates: Trajectory Planner (KS3G, 16) + ConstructionWidget + protractor/grid reuse — §3l
- [ ] KS3 templates: Mission Assurance (KS3P, 4) + VennWidget + RiskDialWidget — §3m
- [ ] KS3 templates: Telemetry Centre (KS3S, 3) + DataChartWidget fed by real mission history — §3n
- [ ] Mission Control wing 3D scene (`MissionControlWing.tsx` + station set-pieces),
      locked/unlocked station states with "POWER OFFLINE" tags (§6b)
- [ ] Station unlock rules derived from KS2 mastery (`mission/stations.ts` + mastery.ts)
- [ ] Advanced destinations (Jupiter/Saturn/Interstellar) + Mission Control
      phase in the mission planner (§7)
- [ ] KS3 mission patches ("Secondary-Ready", first Jupiter mission, etc.)
- [ ] Flight Log coverage map extended with the KS3 domain × station grid

**Done when**: `pnpm verify` reports 146/146 criteria covered, a station can
be unlocked by KS2 mastery and its tasks completed end-to-end in the browser
(attempt rows in Dexie), and a Jupiter mission runs the Mission Control phase
before the VAB build.

> Note on ordering: Phase 8 (KS3) is listed after Phase 7 because Artie needs
> the KS2 game first — but it may be started any time after Phase 6, since the
> Advanced Programme only reuses systems established by Phases 1–6 (templates,
> widgets, mastery, planner). Whatever the order, final acceptance requires
> BOTH Phase 7 and Phase 8 signed off.

---

## 10. Task Writing Anti-Patterns (MUST AVOID)

These are examples of what NOT to do. Study them carefully.

### ❌ BAD: Label + bare sum
```
"Life support: 56 ÷ 7 = ?"
"Guidance: 7 × 8 = ?"
"Engine check: what comes after 27?"
```
These slap a space label on an abstract sum. The child sees through it instantly.
There is no physical situation, no reason to divide, no engineering consequence.

### ❌ BAD: Physical label but abstract problem
```
"The engine needs 6 + 4 = ? rivets."
"Payload A: 1/4 t, Payload B: 2/4 t. Total?"
"Fin budget: 100 kg. Used 67 kg. How much left?"
```
These name a part but the task reads like a textbook word problem. The numbers
don't come from anything the child can see or manipulate. There's no reason WHY
they need the answer.

### ✅ GOOD: Real engineering situation → maths arises naturally
```
"The combustion chamber has 6 bolts on the left mounting plate and 4 on the
right. The safety inspector needs the total bolt count to sign off the engine.
How many bolts hold the chamber together?"

"Cargo Pod A holds 1/4 tonne of food supplies and Pod B holds 2/4 tonne of
water recycling equipment. The payload arm can only lift them together if you
tell it the combined weight. What's the total going into the bay?"

"The aerodynamics team gave you a 100 kg mass budget for all fins. You've
already fitted the lower pair, which came in at 67 kg on the workshop scales.
How much mass is left for the upper fins before you exceed the budget?"
```

**The pattern**: State the physical situation → explain why the number matters
for the rocket → ask the child to work it out. The maths operation is never
named explicitly — the child discovers WHAT operation to use from the context.

### Template generation rule
When generating a task from a template, the code must:
1. Pick random but **physically plausible** rocket values (lengths in metres,
   masses in kg, angles in degrees, counts as whole numbers)
2. Build a `briefing` string that describes the engineering situation
3. Build an `engineeringContext` string that explains WHY this matters for flight
4. NEVER include the operation symbol (+, −, ×, ÷, =) in the briefing
5. ALWAYS include a `rocketEffect` that changes the 3D model when answered

### KS3 notation exception to rule 4
At KS3, mathematical notation is itself part of the syllabus — standard form
(`A × 10ⁿ`), algebraic equations (`4t + 60 = 300`), inequalities (`a < x ≤ b`)
and formulae (`v = d ÷ t`). For KS3 templates ONLY, operation symbols are
allowed **inside a displayed formula/equation/notation that is the object of
study** — shown as a console readout, program listing, or label in the widget
— but never as a bare sum standing in for the engineering situation. The
test: strip the quoted notation from the briefing and it must still read as a
real engineering problem ("The throttle equation reads … Solve for t to set
the throttle position" ✅; "Solve 4t + 60 = 300" ❌). The coverage-check and
template tests enforce rule 4 verbatim for KS2 templates, and for KS3
templates only permit operation symbols within a marked `notation` segment of
the briefing.

---

## 11. Critical Design Rules


1. **Artie has agency (Kerbal rule).** He chooses which parts to use, which
   variants, and what order to build in. The maths gates *certification*
   (flight-readiness), never his creativity. Never force a fixed build order.

2. **Every task is about the rocket part.** If a task says "what is 7 × 8?" it
   MUST be framed as "Each engine needs 7 bolts, and there are 8 engines. Total
   bolts needed?" with the engine visible in 3D and bolts highlighting.

3. **Every answer changes the 3D rocket.** Correct answers lock in the right
   dimensions. Wrong answers show a "draft" state. The child sees the
   consequence of their maths on the rocket they're building.

4. **No abstract maths.** Every number in every task comes from a physical
   property of the rocket: length, mass, angle, count, ratio, capacity. The
   child should be able to look at the 3D rocket and understand what the
   numbers mean.

5. **The rocket is continuous.** It persists across missions and visibly improves
   as Artie masters more maths. When he comes back tomorrow, his rocket is
   better than yesterday.

6. **Gentle, always.** A 10-year-old with fragile confidence. Every interaction
   should build him up. The "wrong" path is "not yet locked in" — the part is
   ghosted/wireframe, not broken or red.

---

## 12. What NOT to Build


- No user authentication — profiles are a trust-based local picker (no
  passwords, no accounts); multiple local profiles simply share the device
- No backend/API server (all data stays local in Dexie IndexedDB) — the only
  network calls are the Gemini API (§5a text + §5b images) and Google Map
  Tiles terrain (§5b/§14); every networked feature must degrade to a local
  fallback so the app is fully playable offline
- No real-time multiplayer
- No text-to-speech or voice input
- No PDF/print worksheets
- No timer pressure (optional speed bonus on checklist only)
- No external dependencies beyond the listed stack (§4) and the 3D/terrain
  packages specified in §14

---

## 13. Reference Material


- **DfE Ready-to-Progress criteria**: The 81 KS2 criteria listed in §6a
- **KS3 National Curriculum for Mathematics**: available at
  `docs/SECONDARY_national_curriculum_-_Mathematics.pdf` — source of truth
  for the 65 KS3 criteria listed in §6b (Number, Algebra, Ratio/proportion,
  Geometry & measures, Probability, Statistics)
- **Maths guidance Year 6**: available at `docs/Maths_guidance_year_6.pdf`
- **Original brief**: `docs/BRIEF.md`
- **API keys**: `.env.local` at the repo root already contains working values
  for `VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY_POOL`, and
  `VITE_GOOGLE_MAPS_API_KEY` (`.env.example` documents the shape; both are
  covered by `.gitignore`)
- The repo currently contains only docs, `run.sh`, and the env files — build
  everything from scratch with the 3D-first, engineering-task-first approach
  described above.

---

## 14. 3D Implementation Techniques (from Gaudi reference)

The sibling project `/Users/tomason/dev/gaudi` is a production 3D architecture
app. Borrow these specific patterns for the rocket lab:

### Scene Architecture (from BuildingViewer.tsx)
- **Canvas setup**: Use `<Canvas shadows gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }} camera={{ position: [8, 5, 10], fov: 40 }}>`
- **Camera auto-fit**: After building/modifying the rocket, compute a bounding box
  and animate the camera to frame it with padding (Gaudi uses `box.getSize()` +
  `camera.position.lerp()` in `useFrame`)
- **Intro fly-in**: On first load, animate camera from far away to the rocket
  with eased interpolation (Gaudi's `introProgress` ref + smoothstep)
- **Ground-aware orbit**: Constrain OrbitControls `maxPolarAngle` so camera can't
  go below the launchpad (Gaudi clips at ground level)
- **WebGL context loss recovery**: Listen for `webglcontextlost` and restore on
  `webglcontextrestored` — important for long sessions on tablets

### Interactive Zone Selection (from BuildingViewer.tsx)
- **Hover glow**: On `onPointerOver`, set the mesh's material `emissive` to a
  highlight colour and `emissiveIntensity` to 0.3. Reset on `onPointerOut`.
- **Click to select**: `onClick` on a rocket part sets it as the active stage,
  zooms the camera to it, and opens the engineering task panel
- **Cursor change**: Set `document.body.style.cursor = 'pointer'` on hover

### Parametric Morph Tweening (from BuildingViewer.tsx)
When the rocket design changes (e.g. hull grows taller), don't just snap:
- Store the previous geometry state
- In `useFrame`, lerp between old and new values over ~0.5s
- This gives a satisfying "the rocket is growing" animation
- Gaudi does this with `morphTargets` but simple value lerping works for
  parametric shapes

### Per-Zone Materials (from zoneMaterial.ts)
Each rocket part should have distinct material properties:
```ts
const PART_MATERIALS: Record<RocketPart, ZoneMaterial> = {
  noseCone:   { color: "#e8ecff", roughness: 0.3, metalness: 0.4 },
  hull:       { color: "#aab7f0", roughness: 0.5, metalness: 0.3 },
  fuelTank:   { color: "#22d3ee", roughness: 0.2, metalness: 0.1, opacity: 0.55, transparent: true },
  engine:     { color: "#5b6690", roughness: 0.4, metalness: 0.6 },
  fins:       { color: "#f472b6", roughness: 0.5, metalness: 0.2 },
  payloadBay: { color: "#a78bfa", roughness: 0.4, metalness: 0.3 },
  electronics:{ color: "#34d399", roughness: 0.35, metalness: 0.5 },
  booster:    { color: "#fbbf24", roughness: 0.45, metalness: 0.4 },
};
```
- **Draft state** (unanswered part): wireframe or ghosted (opacity 0.2)
- **Locked-in state** (correct answer): full material with subtle emissive pulse
- **Level upgrades**: shinier metalness, additional detail meshes

### Control Panel (from ControlPanel.tsx)
Gaudi uses Tweakpane for a floating parameter panel. For the rocket lab, build
a similar **floating HUD panel** (but with Tailwind, not Tweakpane) showing:
- Current part being designed
- Parameter sliders (driven by engineering task answers, not free-form)
- Performance dashboard bars
- Stage progress indicators

### Certification Board (adapted from StatusPanel.tsx)
Gaudi shows a pipeline progress bar. Because assembly is free-order
(Kerbal-style), adapt it into a **certification board** instead of a fixed
pipeline — one tile per attached part, in whatever order Artie built them:
```
📐 Nose ✅   🛢️ Hull ✅   ⛽ Fuel ⬜   🔧 Engine ✅   🪽 Fins ⬜   📦 Payload ⬜   🔌 Electronics ⬜   🧨 Boosters ✅
                     → ✅ Pre-flight (unlocks when all certified) → 🚀 Launch
```
Certified tiles glow green, drafts sit ghosted/amber, and the currently
selected part pulses. Clicking a tile flies the camera to that part.

### Environment & Lighting (from GeospatialEnvironment.tsx)

Gaudi uses `@takram/three-atmosphere` for physically-based atmospheric scattering
(Bruneton precomputed model) and `@takram/three-clouds` for volumetric clouds.
For the rocket lab, use these same packages to create a **stunning, physically
accurate environment** that transitions during launch. This is a required
feature — implement it in Phase 7 (use the drei fallback below only if the
takram packages have an unresolvable technical incompatibility).

```bash
pnpm add @takram/three-atmosphere @takram/three-clouds @takram/three-geospatial @takram/three-geospatial-effects
```

**Real terrain via Google Photorealistic 3D Tiles (like Gaudi):** the takram
geospatial stack pairs with Google's Map Tiles API for real-world terrain
around the launchpad, positioned at the lat/lon of the chosen launch site
(§5b `launchSites.ts`). The key is already
provided as `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` — use it to stream
Photorealistic 3D Tiles (via `3d-tiles-renderer` + the takram geospatial
plugins, as Gaudi's `GeospatialEnvironment.tsx` does) for the ground/horizon
under the atmosphere. If the tiles fail to load (offline, quota), fall back to
the simple textured ground plane — the launch must never be blocked on tiles.

**Launchpad scene (pre-launch):**
```tsx
import { Atmosphere, Sky, Stars, SunLight, SkyLight } from '@takram/three-atmosphere/r3f';
import { Clouds, CloudLayer } from '@takram/three-clouds/r3f';
import { AerialPerspective, LensFlare } from '@takram/three-geospatial-effects/r3f';

<Atmosphere>
  <Sky />
  <Stars /> {/* visible as sun sets */}
  <SunLight intensity={3} castShadow />
  <SkyLight intensity={0.5} />
  <AerialPerspective /> {/* distance haze on horizon */}
  <LensFlare /> {/* sun lens flare */}
  <Clouds>
    <CloudLayer altitude={2000} thickness={500} coverage={0.4} />
  </Clouds>
  {/* ... rocket + launchpad scene */}
</Atmosphere>
```

**During launch — time-of-day transition:**
- Start at sunset (golden hour on the pad)
- As the rocket climbs, advance the sun position toward the horizon
- Sky darkens from blue → orange → deep indigo → black
- Stars fade in as atmosphere thins
- Clouds pass by and fall away below
- At high altitude, the atmosphere haze disappears (AerialPerspective fades out)

**Destination arrival scenes:**
- Low Orbit: Earth curve visible below, thin blue atmosphere line, stars above
- Moon: grey terrain, no atmosphere, stark shadows, Earth in sky
- Mars: rusty terrain, thin pink-orange haze, small sun
- Deep Space: pure starfield, distant galaxies, nebula colours

This gives the launch sequence a visually stunning, physically grounded feel —
the child watches the sky change from blue to black as their rocket leaves the
atmosphere, just like real launches.

**Fallback for simpler setups:**
If the takram packages cause issues, fall back to drei's `<Environment>` + `<Sky>`:
- `<Sky sunPosition={[100, 20, 100]} />` for the launchpad
- `<Stars />` from drei for space scenes
- **Contact shadows** on the launchpad: `<ContactShadows position={[0, -0.01, 0]}
  opacity={0.4} scale={20} blur={2} />`
- **Hemisphere light** for soft ambient fill


### Camera Fly-To (from InteriorLayer.tsx useCameraFly)
When switching between rocket parts, smoothly fly the camera:
```ts
function useCameraFly(target: Vector3, lookAt: Vector3, duration = 0.8) {
  const startPos = useRef(new Vector3());
  const startTarget = useRef(new Vector3());
  const progress = useRef(0);

  useFrame((state, dt) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + dt / duration);
    const t = smoothstep(progress.current); // cubic ease
    state.camera.position.lerpVectors(startPos.current, target, t);
    // similarly lerp the orbit controls target
  });
}
```

### Geometry Caching (from BuildingViewer.tsx)
Gaudi caches generated geometry in IndexedDB for instant restore. For the rocket:
- Cache the current `RocketDesign` in Dexie alongside the mission data
- On page load, instantly restore the last rocket state so it appears immediately
- No loading spinner needed for returning users

### Screenshot / Render (from RenderPanel.tsx)
For the post-flight report, capture a screenshot of the launched rocket:
- Use `gl.domElement.toDataURL('image/png')` to capture the canvas
- Save it with the mission record in Dexie
- Show it in the Flight Log as a mission photo

---

## 15. Success Criteria



When complete, a 10-year-old should be able to:

1. Open the app and pick (or create) his profile on the Commander Roster —
   it works the same whether he's Artie, Walter, or any other name — then
   pick a real launch site (e.g. SaxaVord in Shetland) and see his 3D rocket
   on the pad there
2. Pick "Low Orbit" as a destination
3. Enter the VAB, drag parts from the catalogue onto the rocket in any order
   he likes, and certify each one by solving its engineering tasks
4. See his rocket change shape as he assembles and answers
5. Complete the pre-flight checklist
6. Watch his rocket launch in a 3D animated sequence
7. See an after-action report of what maths he used, narrated personally by
   the Flight Director
8. Get stuck on a task, type a wrong answer, and receive a hint that clearly
   responds to the mistake he actually made — without giving the answer away
9. Snap an AI "mission photo" of his rocket for the Flight Log scrapbook
10. Come back tomorrow, and his rocket is upgraded from what he mastered
11. After mastering enough KS2 strands, watch a Mission Control station power
    up, walk in, and complete a KS3 task there (e.g. plot the ascent line
    h = 40t + 200 on the Guidance Computer, or set the launch-weather
    probability dial in Mission Assurance)
12. Unlock Jupiter, run its Mission Control science package + VAB build, and
    launch an advanced mission — arriving at secondary school in September
    having already *used* KS3 maths to fly rockets
13. Hand the device to his brother, who switches to his own profile on the
    Commander Roster and finds HIS own rocket, XP, mastery and missions —
    completely untouched by anyone else's play

And at no point should he think "I'm doing maths homework." He should think
"I'm building a rocket, and I need to figure out the right angle/measurement/
ratio to make it work."

**Declaring completion**: follow the §9 "Progress tracking & definition of
done" process — completion is only declared when `pnpm verify` is green,
`/dev/status` shows 146/146 criteria covered (81 KS2 + 65 KS3), and each
numbered criterion above has a dated browser-walkthrough sign-off in
`PROGRESS.md`.
