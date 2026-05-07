import { loudnessTargets } from "../audio/audio";
import { createFallbackMetadata } from "../master/master";
import { defaultColorGrade, defaultRestorationRecipe } from "../picture/picture";
import { createSubtitleFiles, subtitleLanguages } from "../subtitles/subtitle";
import {
  createFestivalManifest,
  createFestivalZip,
  deliveryPresets,
  safeBaseName
} from "./delivery";

describe("delivery packaging", () => {
  it("normalizes master names for generated artifacts", () => {
    expect(safeBaseName("My Film FINAL v4.mov")).toBe("my-film-final-v4");
    expect(safeBaseName("!!!.mov")).toBe("cinematheca-master");
  });

  it("creates a festival manifest and zip", () => {
    const master = createFallbackMetadata(
      new File(["sample"], "Festival Cut.mov", { type: "video/quicktime" })
    );
    const subtitles = createSubtitleFiles({
      transcript: "The theatre opens.",
      durationSeconds: master.duration,
      languages: [subtitleLanguages[0]],
      baseName: safeBaseName(master.name)
    });
    const manifest = createFestivalManifest({
      master,
      preset: deliveryPresets[0],
      loudness: loudnessTargets[0],
      colorGrade: defaultColorGrade,
      restoration: defaultRestorationRecipe,
      subtitles,
      repositoryUrl: "https://github.com/baditaflorin/cinematheca",
      paypalUrl: "https://www.paypal.com/paypalme/florinbadita"
    });
    const zip = createFestivalZip({ manifest, subtitles });

    expect(manifest.commandPlan.join("\n")).toContain("loudnorm");
    expect(manifest.subtitleFiles).toHaveLength(3);
    expect(zip.type).toBe("application/zip");
    expect(zip.size).toBeGreaterThan(500);
  });
});
