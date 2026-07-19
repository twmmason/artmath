/**
 * pnpm verify gate: loads every template and exits non-zero if any of the
 * 146 criteria has no working template, any briefing contains an operation
 * symbol (§10 rule 4, KS3 notation exception via the `notation` field), or
 * any part/station has no tasks.
 */
import { CRITERIA, KS2_CRITERIA, KS3_CRITERIA } from "../src/curriculum/criteria";
import { ALL_TEMPLATES, generateTask } from "../src/engine";
import { briefingViolatesRule4 } from "../src/engine/types";
import { ALL_PARTS } from "../src/three/rocketDesign";
import { ALL_STATIONS } from "../src/engine/types";

const problems: string[] = [];
let ks2ok = 0;
let ks3ok = 0;
const partsCovered = new Set<string>();
const stationsCovered = new Set<string>();

for (const c of CRITERIA) {
  if (!ALL_TEMPLATES[c.code]) {
    problems.push(`${c.code}: NO TEMPLATE`);
    continue;
  }
  let ok = true;
  for (const tier of [1, 2, 3]) {
    for (const seed of [1, 42, 999, 12345]) {
      try {
        const t = generateTask(c.code, tier, seed);
        if (!t.briefing || !t.answer || !t.rocketEffect?.property) {
          problems.push(`${c.code} tier ${tier}: incomplete task`);
          ok = false;
        }
        if (briefingViolatesRule4(t.briefing)) {
          problems.push(`${c.code} tier ${tier}: operation symbol in briefing: "${t.briefing}"`);
          ok = false;
        }
        partsCovered.add(t.rocketPart);
        if (t.station) stationsCovered.add(t.station);
      } catch (e) {
        problems.push(`${c.code} tier ${tier}: threw ${e}`);
        ok = false;
      }
    }
  }
  if (ok) {
    if (c.code.startsWith("KS3")) ks3ok++;
    else ks2ok++;
  }
}

for (const p of ALL_PARTS)
  if (!partsCovered.has(p)) problems.push(`part "${p}" has no tasks`);
for (const s of ALL_STATIONS)
  if (!stationsCovered.has(s)) problems.push(`station "${s}" has no tasks`);

console.log(
  `KS2 ${ks2ok}/${KS2_CRITERIA.length} ${ks2ok === KS2_CRITERIA.length ? "✅" : "❌"}  ` +
    `KS3 ${ks3ok}/${KS3_CRITERIA.length} ${ks3ok === KS3_CRITERIA.length ? "✅" : "❌"}  ` +
    `parts ${partsCovered.size}/${ALL_PARTS.length}  stations ${stationsCovered.size}/${ALL_STATIONS.length}`,
);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.error("  - " + p);
  process.exit(1);
}
console.log("Coverage check passed: 146/146 criteria covered.");
