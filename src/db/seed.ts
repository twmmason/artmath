import { db } from "./db";

/**
 * First run: NOTHING is seeded (§4) — the roster shows the empty state with
 * the "New Commander" card and quick-create chips. This just opens the DB.
 */
export async function ensureDbReady(): Promise<void> {
  await db.open();
}
