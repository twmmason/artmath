import { useRef, type ReactElement } from "react";
import { ViewSwitcher } from "./ViewSwitcher";
import { captureCanvas } from "../three/RocketScene";
import { db } from "../db/db";
import { useRocketState } from "../mission/useRocketState";

/**
 * Mission Camera wiring (§5b): canvas capture + ViewSwitcher pill + photo
 * save to the commander's latest mission record (Flight Log scrapbook).
 * Use on any page with a RocketScene:
 *   const { onCanvasReady, cameraEl } = useMissionCamera(site.name);
 */
export function useMissionCamera(siteName: string): {
  onCanvasReady: (c: HTMLCanvasElement) => void;
  cameraEl: ReactElement;
} {
  const profile = useRocketState((s) => s.profile);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const savePhoto = async (dataUrl: string) => {
    if (!profile) return;
    const last = await db.missions.where("profileId").equals(profile.id).last();
    if (last?.id != null) {
      await db.missions.update(last.id, { photos: [...(last.photos ?? []), dataUrl] });
    }
  };

  return {
    onCanvasReady: (c) => {
      canvasRef.current = c;
    },
    cameraEl: (
      <ViewSwitcher
        siteName={siteName}
        getScreenshot={() => captureCanvas(canvasRef.current)}
        onPhoto={(d) => void savePhoto(d)}
      />
    ),
  };
}