import type { GeneratedTask, Rng, TemplateMap } from "./types";
import { makeRng, seedFromString } from "./rng";
import { noseconeTemplates } from "./templates/nosecone";
import { hullTemplates } from "./templates/hull";
import { fuelTemplates } from "./templates/fuel";
import { engineTemplates } from "./templates/engine";
import { finsTemplates } from "./templates/fins";
import { payloadTemplates } from "./templates/payload";
import { electronicsTemplates } from "./templates/electronics";
import { rdlabTemplates } from "./templates/ks3/rdlab";
import { guidanceTemplates } from "./templates/ks3/guidance";
import { propulsionLabTemplates } from "./templates/ks3/propulsionLab";
import { trajectoryTemplates } from "./templates/ks3/trajectory";
import { assuranceTemplates } from "./templates/ks3/assurance";
import { telemetryTemplates } from "./templates/ks3/telemetry";

export { generateChecklist } from "./templates/checklist";
export { checkAnswer } from "./types";
export type { GeneratedTask } from "./types";

/** Every criterion code → its task template. */
export const ALL_TEMPLATES: TemplateMap = {
  ...noseconeTemplates,
  ...hullTemplates,
  ...fuelTemplates,
  ...engineTemplates,
  ...finsTemplates,
  ...payloadTemplates,
  ...electronicsTemplates,
  ...rdlabTemplates,
  ...guidanceTemplates,
  ...propulsionLabTemplates,
  ...trajectoryTemplates,
  ...assuranceTemplates,
  ...telemetryTemplates,
};

/** Generate a task for a criterion at a tier. Deterministic when a seed is given. */
export function generateTask(
  criterionCode: string,
  tier: number,
  seed?: number | string,
): GeneratedTask {
  const template = ALL_TEMPLATES[criterionCode];
  if (!template) {
    throw new Error(`No task template for criterion ${criterionCode}`);
  }
  const rng: Rng =
    seed === undefined
      ? makeRng(Math.floor(Math.random() * 2 ** 31))
      : makeRng(typeof seed === "string" ? seedFromString(seed) : seed);
  const t = Math.min(3, Math.max(1, Math.round(tier)));
  return template(t, rng);
}