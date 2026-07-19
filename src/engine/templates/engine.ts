import type { TemplateMap } from "../types";
import { makeTask, formatThousands } from "./helpers";
import { pick, randInt, shuffle } from "../rng";

/**
 * ENGINE — Number Facts + Multiplication/Division strands.
 * Covers: 1NF-1, 1NF-2, 2NF-1, 3NF-1, 3NF-2, 3NF-3, 4NF-1, 4NF-2, 4NF-3,
 *         5NF-1, 5NF-2, 2MD-1, 3MD-1, 3MD-2, 4MD-1, 4MD-2, 4MD-3, 5MD-3, 6MD-1
 */
export const engineTemplates: TemplateMap = {
  "1NF-1": (tier, rng) => {
    const total = 10;
    const fitted = randInt(rng, 2, 8);
    const answer = total - fitted;
    return makeTask({
      criterionCode: "1NF-1",
      rocketPart: "engine",
      tier,
      briefing: `The engine mounting ring needs ${total} bolts to hold it safely. The fitter has already tightened ${fitted} of them. How many more bolts are needed to finish the ring?`,
      engineeringContext:
        "Every bolt shares the engine's push — a missing bolt means a shaky engine.",
      answer,
      choices: tier === 1 ? shuffle(rng, [answer, answer + 1, fitted]) : undefined,
      workedSteps: [
        `The ring needs ${total} bolts in total.`,
        `${fitted} are already tightened.`,
        `Counting on from ${fitted} up to ${total} takes ${answer} more bolts.`,
      ],
      hints: [
        `Start at ${fitted} and count up to ${total} on your fingers.`,
        `What goes with ${fitted} to make ${total}?`,
      ],
      visual: { widget: "circuit", config: { mode: "bolts", total, done: fitted } },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 260,
        unit: "kN",
      },
    });
  },

  "1NF-2": (tier, rng) => {
    const step = pick(rng, [2, 5, 10] as const);
    const start = step * randInt(rng, 2, 5);
    const answer = start + step;
    return makeTask({
      criterionCode: "1NF-2",
      rocketPart: "engine",
      tier,
      briefing: `The turbopump speeds up in steady steps of ${step} spins per second: the dial has shown ${start - step * 2}, ${start - step}, then ${start}. What will the dial show at the next step?`,
      engineeringContext:
        "The pump must speed up in even steps or the fuel flow surges.",
      answer,
      workedSteps: [
        `The dial climbs by ${step} each step.`,
        `After ${start} the next reading is ${answer}.`,
      ],
      hints: [
        `The pattern goes up by the same amount each time — how much?`,
        `Count on ${step} more from ${start}.`,
      ],
      visual: {
        widget: "numberLine",
        config: { min: 0, max: answer + step * 2, target: answer, step },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 270,
        unit: "kN",
      },
    });
  },

  "2NF-1": (tier, rng) => {
    const total = 20;
    const done = randInt(rng, 5, 17);
    const answer = total - done;
    return makeTask({
      criterionCode: "2NF-1",
      rocketPart: "engine",
      tier,
      briefing: `The engine bell has ${total} cooling channels that must all be drilled before the burn test. The workshop has finished ${done} channels. How many channels are left to drill?`,
      engineeringContext:
        "Cooling channels stop the bell melting — every one must be complete.",
      answer,
      workedSteps: [
        `The bell needs ${total} channels and ${done} are drilled.`,
        `Counting from ${done} up to ${total} gives ${answer} channels left.`,
      ],
      hints: [
        `How far is it from ${done} to 20?`,
        "Use your bonds to 20 — they work for channels too.",
      ],
      visual: { widget: "circuit", config: { mode: "channels", total, done } },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 265,
        unit: "kN",
      },
    });
  },

  "3NF-1": (tier, rng) => {
    const left = randInt(rng, 2, 6);
    const right = randInt(rng, 2, 10 - left);
    return makeTask({
      criterionCode: "3NF-1",
      rocketPart: "engine",
      tier,
      briefing: `The combustion chamber is held by ${left} bolts on the left mounting plate and ${right} bolts on the right plate. The safety inspector needs the total bolt count to sign off the engine. How many bolts hold the chamber altogether?`,
      engineeringContext:
        "The inspector's sign-off sheet must match the real bolt count exactly.",
      answer: left + right,
      workedSteps: [
        `Left plate: ${left} bolts. Right plate: ${right} bolts.`,
        `Put both groups together: ${left + right} bolts in total.`,
      ],
      hints: [
        "Count the left bolts, then keep counting through the right ones.",
        `Start at ${left} and count on ${right} more.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "bolts", total: left + right, done: left },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 270,
        unit: "kN",
      },
    });
  },

  "3NF-2": (tier, rng) => {
    const table = pick(rng, [2, 4, 5, 8, 10] as const);
    const count = randInt(rng, 3, 9);
    return makeTask({
      criterionCode: "3NF-2",
      rocketPart: "engine",
      tier,
      briefing: `Each igniter cartridge fires ${table} sparks, and this engine's start sequence uses ${count} cartridges. Mission Control needs the total spark count to check the sequence. How many sparks fire in total?`,
      engineeringContext:
        "The start sequence needs the exact spark count or ignition is aborted.",
      answer: table * count,
      workedSteps: [
        `One cartridge fires ${table} sparks.`,
        `${count} cartridges fire ${count} groups of ${table}.`,
        `That makes ${table * count} sparks in total.`,
      ],
      hints: [
        `Count in ${table}s, once for each cartridge.`,
        `Use the ${table} times table — ${count} steps along it.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: table, groups: count },
      },
      rocketEffect: {
        property: "engineCount",
        correctValue: 3,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "3NF-3": (tier, rng) => {
    const base = randInt(rng, 2, 9);
    const other = randInt(rng, 2, 9);
    const answer = base * 10 + other * 10;
    return makeTask({
      criterionCode: "3NF-3",
      rocketPart: "engine",
      tier,
      briefing: `Fuel pipes come in bundles of 10. The port side of the engine bay takes ${base} bundles and the starboard side takes ${other} bundles. The stores clerk needs the total pipe count. How many pipes is that altogether?`,
      engineeringContext:
        "Stores issue pipes by the bundle — engineers convert bundles to pipes.",
      answer,
      workedSteps: [
        `${base} bundles and ${other} bundles make ${base + other} bundles.`,
        `Each bundle holds 10 pipes.`,
        `${base + other} tens make ${answer} pipes.`,
      ],
      hints: [
        `First join the bundles: how many tens is that?`,
        `You know ${base} and ${other} together — now make them tens.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: 10, groups: base + other },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 275,
        unit: "kN",
      },
    });
  },

  "4NF-1": (tier, rng) => {
    const injectors = randInt(rng, 6, 12);
    const engines = randInt(rng, 2, 4);
    return makeTask({
      criterionCode: "4NF-1",
      rocketPart: "engine",
      tier,
      briefing: `Each engine has ${injectors} fuel injectors arranged in a ring, and we're fitting ${engines} engines to this rocket. The workshop needs the injector order. How many injectors should they send up?`,
      engineeringContext:
        "Ordering the exact number saves mass and money — spares stay in the workshop.",
      answer: injectors * engines,
      workedSteps: [
        `One engine needs ${injectors} injectors.`,
        `${engines} engines need ${engines} groups of ${injectors}.`,
        `The order is ${injectors * engines} injectors.`,
      ],
      hints: [
        `Think of ${engines} rings, each with ${injectors} injectors.`,
        `Use the ${injectors} times table.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: injectors, groups: engines },
      },
      rocketEffect: {
        property: "engineCount",
        correctValue: engines,
        incorrectValue: Math.max(1, engines - 1),
        unit: "",
      },
    });
  },

  "4NF-2": (tier, rng) => {
    const per = pick(rng, [6, 7, 8, 9] as const);
    const groups = randInt(rng, 4, 8);
    const spare = randInt(rng, 1, per - 1);
    const total = per * groups + spare;
    return makeTask({
      criterionCode: "4NF-2",
      rocketPart: "engine",
      tier,
      briefing: `A crate of ${total} turbine blades has arrived, and each engine disc holds exactly ${per} blades. The fitter fills as many discs as possible. How many blades are LEFT OVER in the crate?`,
      engineeringContext:
        "Left-over blades go back to stores — the paperwork must show the exact remainder.",
      answer: spare,
      workedSteps: [
        `Each disc takes ${per} blades.`,
        `${groups} full discs use ${per * groups} blades.`,
        `${total} take away ${per * groups} leaves ${spare} blades over.`,
      ],
      hints: [
        `How many full groups of ${per} fit inside ${total}?`,
        "The answer is what's left after the last full disc.",
      ],
      visual: {
        widget: "payloadSplit",
        config: { total, groups, groupSize: per },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 280,
        unit: "kN",
      },
    });
  },

  "4NF-3": (tier, rng) => {
    const fact = randInt(rng, 3, 9);
    const other = randInt(rng, 3, 9);
    const answer = fact * other * 100;
    return makeTask({
      criterionCode: "4NF-3",
      rocketPart: "engine",
      tier,
      briefing: `Each test firing burns ${fact * 100} grams of igniter compound. The test campaign plans ${other} firings. The safety store must set aside the full amount. How many grams is that in total?`,
      engineeringContext:
        "Igniter compound is signed out in advance — the store needs the exact total.",
      answer,
      workedSteps: [
        `Use the known fact: ${fact} groups of ${other} make ${fact * other}.`,
        `${fact * 100} is one hundred times ${fact}.`,
        `So the total is ${fact * other} hundreds: ${formatThousands(answer)} grams.`,
      ],
      hints: [
        `Start from the small fact with ${fact} and ${other}.`,
        "Then make it one hundred times bigger.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: fact * 100, groups: other },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 285,
        unit: "kN",
      },
    });
  },

  "5NF-1": (tier, rng) => {
    const primes = [7, 11, 13, 17, 19, 23, 29, 31, 37];
    const composites = [15, 21, 25, 27, 33, 35, 39, 49];
    const isPrime = pick(rng, [true, false]);
    const n = isPrime ? pick(rng, primes) : pick(rng, composites);
    return makeTask({
      criterionCode: "5NF-1",
      rocketPart: "engine",
      tier,
      briefing: `The thrust control computer wants to split its ${n} kN output across equal-power channels, with more than one channel and more than 1 kN each. Can ${n} be split into equal whole-number groups like that? Is ${n} prime or composite?`,
      engineeringContext:
        "Prime outputs can't be shared into equal channels — the computer needs to know.",
      answer: isPrime ? "prime" : "composite",
      choices: ["prime", "composite"],
      workedSteps: [
        `Try dividing ${n} by small numbers: 2, 3, 5, 7…`,
        isPrime
          ? `Nothing divides ${n} exactly except 1 and ${n}.`
          : `${n} splits into equal groups, so it has a factor other than 1 and itself.`,
        `So ${n} is ${isPrime ? "prime" : "composite"}.`,
      ],
      hints: [
        `Can you arrange ${n} into equal rows with none left over?`,
        "A prime number only makes one row or one column.",
      ],
      visual: { widget: "circuit", config: { mode: "channels", total: n, done: 0 } },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 288,
        unit: "kN",
      },
    });
  },

  "5NF-2": (tier, rng) => {
    const a = randInt(rng, 3, 9);
    const b = randInt(rng, 3, 9);
    const answer = (a * b) / 10;
    return makeTask({
      criterionCode: "5NF-2",
      rocketPart: "engine",
      tier,
      briefing: `A micro-valve lets through ${a / 10} grams of fuel per pulse (a tenth of the standard ${a} gram valve). The chamber fires ${b} pulses. How many grams of fuel enter the chamber?`,
      engineeringContext:
        "Micro-valves meter tiny amounts of fuel for fine engine control.",
      answer,
      workedSteps: [
        `Use the known fact: ${a} groups of ${b} make ${a * b}.`,
        `The valve delivers a tenth of the standard, so the answer is a tenth of ${a * b}.`,
        `That is ${answer} grams.`,
      ],
      hints: [
        `Start with the fact using ${a} and ${b}.`,
        "Then make the answer ten times smaller.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: a, groups: b },
      },
      rocketEffect: {
        property: "fuelRatio",
        correctValue: 2.5,
        incorrectValue: 2.3,
        unit: "",
      },
    });
  },

  "2MD-1": (tier, rng) => {
    const per = pick(rng, [2, 5, 10] as const);
    const groups = randInt(rng, 3, 6);
    return makeTask({
      criterionCode: "2MD-1",
      rocketPart: "engine",
      tier,
      briefing: `The engine bay holds ${groups} engines, and each engine needs ${per} spark plugs. The technician lays out the plugs in ${groups} rows of ${per} on the bench. How many plugs are on the bench?`,
      engineeringContext:
        "Laying parts out in equal rows makes it easy to spot a missing plug.",
      answer: per * groups,
      workedSteps: [
        `There are ${groups} rows with ${per} plugs in each.`,
        `Count in ${per}s: ${Array.from({ length: groups }, (_, i) => (i + 1) * per).join(", ")}.`,
        `${per * groups} plugs altogether.`,
      ],
      hints: [
        `Each row has the same number — count row by row.`,
        `Count up in ${per}s, ${groups} times.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: per, groups },
      },
      rocketEffect: {
        property: "engineCount",
        correctValue: Math.min(4, groups),
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "3MD-1": (tier, rng) => {
    const thrust = pick(rng, [50, 100, 150, 200] as const);
    const engines = randInt(rng, 2, 4);
    return makeTask({
      criterionCode: "3MD-1",
      rocketPart: "engine",
      tier,
      briefing: `Each engine produces ${thrust} kN of thrust, and this rocket lights ${engines} engines at liftoff. Mission Control needs the total liftoff thrust for the flight computer. What is it, in kN?`,
      engineeringContext:
        "Total thrust decides whether the rocket can lift its own weight.",
      answer: thrust * engines,
      workedSteps: [
        `One engine gives ${thrust} kN.`,
        `${engines} engines give ${engines} groups of ${thrust} kN.`,
        `Total thrust: ${thrust * engines} kN.`,
      ],
      hints: [
        `Add ${thrust} to itself, once per engine.`,
        `Or use a times fact with ${engines}.`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "thrust", perEngine: thrust, engines },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: thrust,
        incorrectValue: thrust - 20,
        unit: "kN",
      },
    });
  },

  "3MD-2": (tier, rng) => {
    const a = randInt(rng, 3, 8);
    const b = randInt(rng, 3, 8);
    return makeTask({
      criterionCode: "3MD-2",
      rocketPart: "engine",
      tier,
      briefing: `The fitter arranged ${a} rows of ${b} heat tiles on one engine skirt. Her apprentice arranged ${b} rows of ${a} tiles on the matching skirt. The chief asks whether both skirts carry the same number of tiles. Answer yes or no.`,
      engineeringContext:
        "Both skirts must weigh the same or the rocket leans on the pad.",
      answer: "yes",
      choices: ["yes", "no"],
      workedSteps: [
        `${a} rows of ${b} makes ${a * b} tiles.`,
        `${b} rows of ${a} makes ${b * a} tiles.`,
        "Swapping the row and column count keeps the total the same.",
      ],
      hints: [
        "Picture turning the grid of tiles on its side.",
        "Does turning it change how many tiles there are?",
      ],
      visual: {
        widget: "grid",
        config: { mode: "array", rows: a, cols: b },
      },
      rocketEffect: {
        property: "engineCount",
        correctValue: 3,
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "4MD-1": (tier, rng) => {
    const base = randInt(rng, 12, 96);
    const factor = pick(rng, [10, 100] as const);
    return makeTask({
      criterionCode: "4MD-1",
      rocketPart: "engine",
      tier,
      briefing: `The test stand ran the engine at ${base} kN for the trial. The full flight engine is ${factor} times more powerful. What thrust will the flight engine deliver, in kN?`,
      engineeringContext:
        "Small test engines prove the design before scaling up to flight power.",
      answer: base * factor,
      workedSteps: [
        `Scaling by ${factor} shifts each digit ${factor === 10 ? "one place" : "two places"} to the left.`,
        `${base} scaled ${factor} times is ${formatThousands(base * factor)} kN.`,
      ],
      hints: [
        `Making ${base} ten times bigger adds a zero — what about ${factor} times?`,
        "The digits keep their order; their places change.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "thrust", perEngine: base, engines: 1 },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: Math.min(500, base * 5),
        incorrectValue: 250,
        unit: "kN",
      },
    });
  },

  "4MD-2": (tier, rng) => {
    const per = randInt(rng, 3, 9);
    const groups = randInt(rng, 3, 9);
    const total = per * groups;
    return makeTask({
      criterionCode: "4MD-2",
      rocketPart: "engine",
      tier,
      briefing: `The parts bin holds ${total} identical fuel nozzles, and each engine manifold takes exactly ${per} nozzles. The build plan asks how many complete manifolds can be filled from the bin. How many is it?`,
      engineeringContext:
        "Grouping parts into manifolds shows how many engines this batch can supply.",
      answer: groups,
      workedSteps: [
        `Each manifold uses ${per} nozzles.`,
        `Share ${total} nozzles into groups of ${per}.`,
        `That fills ${groups} complete manifolds.`,
      ],
      hints: [
        `How many groups of ${per} live inside ${total}?`,
        `Use the ${per} times table backwards.`,
      ],
      visual: {
        widget: "payloadSplit",
        config: { total, groups, groupSize: per },
      },
      rocketEffect: {
        property: "engineCount",
        correctValue: Math.min(4, groups),
        incorrectValue: 2,
        unit: "",
      },
    });
  },

  "4MD-3": (tier, rng) => {
    const tens = randInt(rng, 1, 3) * 10;
    const ones = randInt(rng, 2, 8);
    const mult = randInt(rng, 3, 7);
    const n = tens + ones;
    return makeTask({
      criterionCode: "4MD-3",
      rocketPart: "engine",
      tier,
      briefing: `Each of the ${mult} engines needs ${n} heat-shield rivets around its base. The stores clerk works it out in two parts: first the ${tens}-rivet rings, then the ${ones} extras. What is the total rivet count for all ${mult} engines?`,
      engineeringContext:
        "Splitting a tricky count into easy parts is how engineers avoid mistakes.",
      answer: n * mult,
      workedSteps: [
        `${mult} groups of ${tens} make ${mult * tens}.`,
        `${mult} groups of ${ones} make ${mult * ones}.`,
        `Together: ${mult * tens} and ${mult * ones} join to give ${n * mult} rivets.`,
      ],
      hints: [
        `Break ${n} into ${tens} and ${ones} first.`,
        "Work each part out separately, then join them.",
      ],
      visual: {
        widget: "circuit",
        config: { mode: "groups", groupSize: n, groups: mult },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: 300,
        incorrectValue: 285,
        unit: "kN",
      },
    });
  },

  "5MD-3": (tier, rng) => {
    const burn = randInt(rng, 120, tier >= 3 ? 2500 : 900);
    const rate = randInt(rng, 3, 12);
    return makeTask({
      criterionCode: "5MD-3",
      rocketPart: "engine",
      tier,
      briefing: `The main engine burn lasts ${formatThousands(burn)} seconds and uses ${rate} kg of fuel every second. The fuelling team must load exactly enough for the full burn. How many kilograms should they load?`,
      engineeringContext:
        "Too little fuel ends the burn early; too much makes the rocket too heavy.",
      answer: burn * rate,
      workedSteps: [
        `Every second uses ${rate} kg.`,
        `${formatThousands(burn)} seconds use ${formatThousands(burn)} groups of ${rate} kg.`,
        `Total load: ${formatThousands(burn * rate)} kg.`,
      ],
      hints: [
        "Set the calculation out as a column multiplication.",
        `Multiply ${formatThousands(burn)} by ${rate}, one digit at a time.`,
      ],
      visual: {
        widget: "fuelGauge",
        config: { capacity: burn * rate, level: burn * rate, mode: "quantity" },
      },
      rocketEffect: {
        property: "tankFill",
        correctValue: 0.9,
        incorrectValue: 0.6,
        unit: "",
      },
    });
  },

  "6MD-1": (tier, rng) => {
    const engines = pick(rng, [4, 6, 8] as const);
    const per = randInt(rng, 3, 9) * 100;
    const total = engines * per;
    return makeTask({
      criterionCode: "6MD-1",
      rocketPart: "engine",
      tier,
      briefing: `The rocket's total liftoff thrust is ${formatThousands(total)} kN, spread equally across its ${engines} engines. The engine certification plates each need the per-engine figure. What thrust does each individual engine produce?`,
      engineeringContext:
        "Each engine's plate must show its true share of the total thrust.",
      answer: per,
      workedSteps: [
        `Share ${formatThousands(total)} kN equally among ${engines} engines.`,
        `Use short division: ${formatThousands(total)} split ${engines} ways.`,
        `Each engine produces ${per} kN.`,
      ],
      hints: [
        `The total is shared equally — think division.`,
        `What number, taken ${engines} times, gives ${formatThousands(total)}?`,
      ],
      visual: {
        widget: "circuit",
        config: { mode: "thrust", perEngine: per, engines },
      },
      rocketEffect: {
        property: "thrustPerEngine",
        correctValue: Math.min(500, per),
        incorrectValue: 250,
        unit: "kN",
      },
    });
  },
};