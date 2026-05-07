export type FfmpegCapability = {
  available: boolean;
  message: string;
};

export async function probeFfmpegCapability(): Promise<FfmpegCapability> {
  try {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util")
    ]);

    const ffmpeg = new FFmpeg();
    const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "application/wasm")
    });

    return {
      available: ffmpeg.loaded,
      message: ffmpeg.loaded
        ? "FFmpeg WASM loaded locally."
        : "FFmpeg WASM did not report loaded."
    };
  } catch (error) {
    return {
      available: false,
      message:
        error instanceof Error
          ? error.message
          : "FFmpeg WASM is unavailable in this browser."
    };
  }
}
