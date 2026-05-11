import {
  buildSrt,
  buildVtt,
  createSubtitleFiles,
  segmentTranscript,
  subtitleLanguages
} from "./subtitle";
import { translateWithPhrasebook } from "./phrasebook";

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

  it("produces phrasebook-translated drafts for non-English languages", () => {
    // High-frequency dialogue that the phrasebook should resolve fully:
    // "hello", "thank you", "yes" all appear in every supported language.
    const files = createSubtitleFiles({
      transcript: "Hello. Yes. Thank you.",
      durationSeconds: 6,
      languages: subtitleLanguages.filter((language) =>
        ["en", "ro", "fr"].includes(language.code)
      ),
      baseName: "short-film"
    });

    const romanian = files.find((file) => file.fileName === "short-film.ro.srt");
    expect(romanian).toBeDefined();
    expect(romanian!.content.toLowerCase()).toContain("bună");
    expect(romanian!.content.toLowerCase()).toContain("mulțumesc");

    const french = files.find((file) => file.fileName === "short-film.fr.srt");
    expect(french).toBeDefined();
    expect(french!.content.toLowerCase()).toContain("bonjour");
    expect(french!.content.toLowerCase()).toContain("merci");

    // The fake "[Language review]" prefix is gone now — the regression
    // guard against re-introducing it lives in this assertion.
    expect(romanian!.content).not.toContain("[Romanian review]");
  });

  it("labels low-match drafts so the editor knows to translate manually", () => {
    const files = createSubtitleFiles({
      transcript: "Quantum entanglement decoheres the apparatus.",
      durationSeconds: 4,
      languages: subtitleLanguages.filter((l) => l.code === "es"),
      baseName: "physics-talk"
    });

    const spanish = files.find((file) => file.fileName === "physics-talk.es.srt");
    expect(spanish).toBeDefined();
    expect(spanish!.content).toContain("partial");
    expect(spanish!.content).toContain("needs review");
  });
});

describe("phrasebook", () => {
  it("translates known phrases case-insensitively", () => {
    const result = translateWithPhrasebook("Hello, thank you!", "fr");
    expect(result.text.toLowerCase()).toContain("bonjour");
    expect(result.text.toLowerCase()).toContain("merci");
    expect(result.matchedFraction).toBeGreaterThan(0.4);
  });

  it("leaves unmatched tokens unchanged", () => {
    const result = translateWithPhrasebook("Hello cosmonaut", "fr");
    expect(result.text).toContain("cosmonaut");
    expect(result.text.toLowerCase()).toContain("bonjour");
  });

  it("prefers multi-word phrases over single words", () => {
    // The phrasebook has both "thank you" -> merci and "you" alone is not
    // in the book, so the multi-word phrase should win and we should not
    // see two separate tokens butchered into "thank merci".
    const result = translateWithPhrasebook("thank you", "fr");
    expect(result.text).toBe("merci");
  });
});
