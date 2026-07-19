import { GoogleGenAI } from "@google/genai";

const primary = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const pool = ((import.meta.env.VITE_GEMINI_API_KEY_POOL as string | undefined) ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const keys = [primary, ...pool].filter(
  (k): k is string => Boolean(k) && k !== "your-gemini-api-key",
);

let keyIndex = 0;
let warned = false;

export const MODEL = "gemini-3-flash-preview";
export const IMAGE_MODEL_FAST = "gemini-3.1-flash-lite-image";
export const IMAGE_MODEL_QUALITY = "gemini-3-pro-image-preview";

export function hasKey(): boolean {
  return keys.length > 0;
}

const inTest = typeof process !== "undefined" && !!(process as { env?: Record<string, string> }).env?.VITEST;

export function getClient(): GoogleGenAI | null {
  if (inTest) return null; // tests always run in offline fallback mode

  if (!keys.length) {
    if (!warned) {
      warned = true;
      console.warn(
        "[Rocket Lab] No Gemini API key set — AI Flight Director running in fallback mode.",
      );
    }
    return null;
  }
  return new GoogleGenAI({ apiKey: keys[keyIndex] });
}

export function rotateKey(): void {
  keyIndex = (keyIndex + 1) % Math.max(keys.length, 1);
}

/** Wrap a Gemini text call with timeout + one 429 retry. Returns null on any failure. */
export async function generateText(
  prompt: string,
  systemInstruction: string,
  timeoutMs = 4000,
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  const attempt = async (): Promise<string | null> => {
    const c = getClient();
    if (!c) return null;
    const res = await c.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { systemInstruction },
    });
    return res.text ?? null;
  };
  const withTimeout = <T>(p: Promise<T>): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), timeoutMs),
      ),
    ]);
  try {
    return await withTimeout(attempt());
  } catch (err) {
    const msg = String(err);
    if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
      rotateKey();
      try {
        return await withTimeout(attempt());
      } catch {
        return null;
      }
    }
    return null;
  }
}
