import { getClient, rotateKey, IMAGE_MODEL_FAST, IMAGE_MODEL_QUALITY } from "./gemini";

export type RenderStyle =
  | "photorealistic"
  | "night-launch"
  | "watercolor"
  | "concept-art"
  | "toy-model";

export const RENDER_STYLES: RenderStyle[] = [
  "photorealistic",
  "night-launch",
  "watercolor",
  "concept-art",
  "toy-model",
];

/**
 * Mission Camera (§5b): repaint a canvas screenshot with a Gemini image model.
 * Returns a dataURL, or null on any failure (caller then keeps the plain
 * screenshot — photo modes are cosmetic, never required).
 */
export async function generateMissionPhoto(
  screenshotDataUrl: string,
  siteName: string,
  style: RenderStyle,
  quality: "fast" | "quality",
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;
  const model = quality === "fast" ? IMAGE_MODEL_FAST : IMAGE_MODEL_QUALITY;
  const base64 = screenshotDataUrl.split(",")[1];
  if (!base64) return null;
  const prompt = `Repaint this 3D render of a child's rocket on the launch pad at ${siteName} as a ${style} photograph. Keep the rocket's shape, parts and colours exactly as shown.`;
  const run = async (): Promise<string | null> => {
    const c = getClient();
    if (!c) return null;
    const res = await c.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/png", data: base64 } },
            { text: prompt },
          ],
        },
      ],
    });
    const parts = res.candidates?.[0]?.content?.parts ?? [];
    for (const p of parts) {
      const inline = (p as { inlineData?: { mimeType?: string; data?: string } }).inlineData;
      if (inline?.data) {
        return `data:${inline.mimeType ?? "image/png"};base64,${inline.data}`;
      }
    }
    return null;
  };
  try {
    return await run();
  } catch (err) {
    if (String(err).includes("429")) {
      rotateKey();
      try {
        return await run();
      } catch {
        return null;
      }
    }
    return null;
  }
}
