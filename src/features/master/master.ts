import { AppError } from "../../shared/errors";

export type MasterMetadata = {
  id: string;
  name: string;
  type: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  lastModified: number;
};

export function createFallbackMetadata(file?: File): MasterMetadata {
  return {
    id: crypto.randomUUID(),
    name: file?.name ?? "master-not-attached.mov",
    type: file?.type || "video/unknown",
    size: file?.size ?? 0,
    duration: 300,
    width: 1920,
    height: 1080,
    lastModified: file?.lastModified ?? Date.now()
  };
}

export async function readVideoMetadata(file: File): Promise<MasterMetadata> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(
          new AppError(
            "metadata_failed",
            "The browser could not read this master file."
          )
        );
    });

    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "video/unknown",
      size: file.size,
      duration: Number.isFinite(video.duration) ? video.duration : 300,
      width: video.videoWidth || 1920,
      height: video.videoHeight || 1080,
      lastModified: file.lastModified
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
