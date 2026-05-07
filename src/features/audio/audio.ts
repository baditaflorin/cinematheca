export type LoudnessTarget = {
  id: string;
  label: string;
  integratedLufs: number;
  truePeakDb: number;
  loudnessRange: number;
};

export const loudnessTargets: LoudnessTarget[] = [
  {
    id: "ebu-r128-broadcast",
    label: "EBU R128 broadcast",
    integratedLufs: -23,
    truePeakDb: -2,
    loudnessRange: 7
  },
  {
    id: "streaming",
    label: "Streaming preview",
    integratedLufs: -16,
    truePeakDb: -1.5,
    loudnessRange: 11
  },
  {
    id: "festival",
    label: "Festival screener",
    integratedLufs: -18,
    truePeakDb: -2,
    loudnessRange: 10
  }
];

export function buildLoudnormFilter(target: LoudnessTarget): string {
  return `loudnorm=I=${target.integratedLufs}:TP=${target.truePeakDb}:LRA=${target.loudnessRange}:print_format=json`;
}

export function buildAudioRecipe(target: LoudnessTarget): string[] {
  return [
    "Extract production audio with FFmpeg WASM.",
    `Analyze with ${buildLoudnormFilter(target)}.`,
    "Render a normalized AAC stereo track and preserve a WAV reference when the browser has memory headroom.",
    "Write loudness target and analysis placeholder into the festival manifest."
  ];
}
