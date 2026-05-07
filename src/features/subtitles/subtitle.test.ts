import {
  buildSrt,
  buildVtt,
  createSubtitleFiles,
  segmentTranscript,
  subtitleLanguages
} from "./subtitle";

describe("subtitle generation", () => {
  it("segments transcript text into timed cues", () => {
    const segments = segmentTranscript("First line. Second line.", 8);

    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({
      index: 1,
      start: 0,
      end: 4,
      text: "First line."
    });
  });

  it("builds SRT and VTT text", () => {
    const segments = segmentTranscript("A quiet premiere.", 4);

    expect(buildSrt(segments)).toContain("00:00:00,000 --> 00:00:04,000");
    expect(buildVtt(segments)).toMatch(/^WEBVTT/);
  });

  it("creates multilingual SRT, VTT, and ASS files", () => {
    const files = createSubtitleFiles({
      transcript: "The reel is ready.",
      durationSeconds: 5,
      languages: subtitleLanguages.filter((language) =>
        ["en", "ro"].includes(language.code)
      ),
      baseName: "short-film"
    });

    expect(files).toHaveLength(6);
    expect(files.map((file) => file.fileName)).toContain("short-film.ro.srt");
    expect(
      files.find((file) => file.fileName === "short-film.ro.srt")?.content
    ).toContain("[Romanian review]");
  });
});
