import { isPhrasebookSupported, translateWithPhrasebook } from "./phrasebook";

export type SubtitleLanguage = {
  code: string;
  label: string;
  nllbCode: string;
};

export type SubtitleSegment = {
  index: number;
  start: number;
  end: number;
  text: string;
};

export type SubtitleFile = {
  fileName: string;
  language: SubtitleLanguage;
  format: "srt" | "vtt" | "ass";
  content: string;
};

export const subtitleLanguages: SubtitleLanguage[] = [
  { code: "en", label: "English", nllbCode: "eng_Latn" },
  { code: "ro", label: "Romanian", nllbCode: "ron_Latn" },
  { code: "fr", label: "French", nllbCode: "fra_Latn" },
  { code: "es", label: "Spanish", nllbCode: "spa_Latn" },
  { code: "de", label: "German", nllbCode: "deu_Latn" },
  { code: "it", label: "Italian", nllbCode: "ita_Latn" }
];

export function segmentTranscript(
  transcript: string,
  durationSeconds: number,
  maxSegmentSeconds = 4.8
): SubtitleSegment[] {
  const cleaned = transcript
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => line.match(/[^.!?]+[.!?]?/g) ?? [line])
    .map((line) => line.trim())
    .filter(Boolean);

  if (cleaned.length === 0) {
    return [];
  }

  const usableDuration = Math.max(durationSeconds, cleaned.length * 2);
  const segmentDuration = Math.min(maxSegmentSeconds, usableDuration / cleaned.length);

  return cleaned.map((text, index) => {
    const start = index * segmentDuration;
    const end =
      index === cleaned.length - 1
        ? Math.min(usableDuration, start + segmentDuration)
        : start + segmentDuration;

    return {
      index: index + 1,
      start,
      end,
      text
    };
  });
}

export function subtitleTime(seconds: number, separator: "," | "."): string {
  const clamped = Math.max(0, seconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const wholeSeconds = Math.floor(clamped % 60);
  const milliseconds = Math.round((clamped - Math.floor(clamped)) * 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(wholeSeconds).padStart(2, "0")}${separator}${String(milliseconds).padStart(3, "0")}`;
}

export function buildSrt(segments: SubtitleSegment[]): string {
  return `${segments
    .map(
      (segment) =>
        `${segment.index}\n${subtitleTime(segment.start, ",")} --> ${subtitleTime(segment.end, ",")}\n${segment.text}`
    )
    .join("\n\n")}\n`;
}

export function buildVtt(segments: SubtitleSegment[]): string {
  return `WEBVTT\n\n${segments
    .map(
      (segment) =>
        `${subtitleTime(segment.start, ".")} --> ${subtitleTime(segment.end, ".")}\n${segment.text}`
    )
    .join("\n\n")}\n`;
}

export function buildAss(segments: SubtitleSegment[]): string {
  const events = segments
    .map(
      (segment) =>
        `Dialogue: 0,${assTime(segment.start)},${assTime(segment.end)},Default,,0,0,0,,${segment.text.replace(/\n/g, "\\N")}`
    )
    .join("\n");

  return `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,54,&H00F4EFE7,&H000000FF,&H001A1713,&H80000000,0,0,0,0,100,100,0,0,1,2,1,2,80,80,58,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events}
`;
}

export function createSubtitleFiles(params: {
  transcript: string;
  durationSeconds: number;
  languages: SubtitleLanguage[];
  baseName: string;
}): SubtitleFile[] {
  const sourceSegments = segmentTranscript(params.transcript, params.durationSeconds);

  return params.languages.flatMap((language) => {
    // Non-English subtitles used to be the English text with a fake
    // "[French review]" prefix - i.e. not translated at all. Run the
    // segments through an offline phrasebook for high-frequency vocabulary
    // and label drafts honestly when the match rate is low so the editor
    // knows they still need a real translation pass.
    const localizedSegments =
      language.code === "en"
        ? sourceSegments
        : sourceSegments.map((segment) => {
            const code = language.code;
            const phrasebookCode = isPhrasebookSupported(code) ? code : null;
            if (!phrasebookCode) {
              return {
                ...segment,
                text: `[Draft ${language.label.toUpperCase()} · needs translation] ${segment.text}`
              };
            }
            const { text: translated, matchedFraction } = translateWithPhrasebook(
              segment.text,
              phrasebookCode
            );
            const banner =
              matchedFraction >= 0.6
                ? `[Draft ${language.label}]`
                : `[Draft ${language.label} · partial · needs review]`;
            return {
              ...segment,
              text: `${banner} ${translated}`
            };
          });

    return [
      {
        fileName: `${params.baseName}.${language.code}.srt`,
        language,
        format: "srt" as const,
        content: buildSrt(localizedSegments)
      },
      {
        fileName: `${params.baseName}.${language.code}.vtt`,
        language,
        format: "vtt" as const,
        content: buildVtt(localizedSegments)
      },
      {
        fileName: `${params.baseName}.${language.code}.ass`,
        language,
        format: "ass" as const,
        content: buildAss(localizedSegments)
      }
    ];
  });
}

function assTime(seconds: number): string {
  const value = subtitleTime(seconds, ".").replace(".", ":");
  return value.replace(/:(\d{3})$/, (_, ms: string) => `.${ms.slice(0, 2)}`);
}
