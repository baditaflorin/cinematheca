import { strToU8, zipSync } from "fflate";
import type { LoudnessTarget } from "../audio/audio";
import { buildAudioRecipe, buildLoudnormFilter } from "../audio/audio";
import type { MasterMetadata } from "../master/master";
import type { ColorGrade, RestorationRecipe } from "../picture/picture";
import { buildColorFilter, buildPictureRecipe } from "../picture/picture";
import type { SubtitleFile } from "../subtitles/subtitle";

export type DeliveryPreset = {
  id: string;
  label: string;
  container: string;
  videoCodec: string;
  audioCodec: string;
  extension: string;
  resolution: string;
};

export type FestivalManifest = {
  schemaVersion: "cinematheca.package.v1";
  generatedAt: string;
  master: Pick<
    MasterMetadata,
    "name" | "type" | "size" | "duration" | "width" | "height" | "lastModified"
  >;
  delivery: DeliveryPreset;
  loudness: LoudnessTarget;
  colorGrade: ColorGrade;
  restoration: RestorationRecipe;
  subtitleFiles: string[];
  commandPlan: string[];
  repositoryUrl: string;
  paypalUrl: string;
};

export const deliveryPresets: DeliveryPreset[] = [
  {
    id: "festival-h264",
    label: "Festival H.264 screener",
    container: "MP4",
    videoCodec: "libx264",
    audioCodec: "aac",
    extension: "mp4",
    resolution: "1920x1080"
  },
  {
    id: "archive-hevc",
    label: "Archive HEVC mezzanine",
    container: "MOV",
    videoCodec: "libx265",
    audioCodec: "pcm_s24le",
    extension: "mov",
    resolution: "source"
  },
  {
    id: "web-av1",
    label: "Web AV1 preview",
    container: "WebM",
    videoCodec: "libaom-av1",
    audioCodec: "libopus",
    extension: "webm",
    resolution: "1280x720"
  },
  {
    id: "dcp-adjacent",
    label: "DCP-adjacent review folder",
    container: "MXF-like folder",
    videoCodec: "jpeg2000-proxy",
    audioCodec: "pcm_s24le",
    extension: "zip",
    resolution: "1998x1080"
  }
];

export function buildCommandPlan(params: {
  master: MasterMetadata;
  preset: DeliveryPreset;
  loudness: LoudnessTarget;
  colorGrade: ColorGrade;
  restoration: RestorationRecipe;
}): string[] {
  const outputName = safeBaseName(params.master.name);
  const scale =
    params.preset.resolution === "source"
      ? ""
      : `,scale=${params.preset.resolution.replace("x", ":")}`;
  const command = [
    "ffmpeg -i master",
    `-vf "${buildColorFilter(params.colorGrade)}${scale}"`,
    `-af "${buildLoudnormFilter(params.loudness)}"`,
    `-c:v ${params.preset.videoCodec}`,
    `-c:a ${params.preset.audioCodec}`,
    `${outputName}.${params.preset.extension}`
  ].join(" ");

  return [
    command,
    ...buildAudioRecipe(params.loudness),
    ...buildPictureRecipe(params.colorGrade, params.restoration)
  ];
}

export function createFestivalManifest(params: {
  master: MasterMetadata;
  preset: DeliveryPreset;
  loudness: LoudnessTarget;
  colorGrade: ColorGrade;
  restoration: RestorationRecipe;
  subtitles: SubtitleFile[];
  repositoryUrl: string;
  paypalUrl: string;
}): FestivalManifest {
  return {
    schemaVersion: "cinematheca.package.v1",
    generatedAt: new Date().toISOString(),
    master: {
      name: params.master.name,
      type: params.master.type,
      size: params.master.size,
      duration: params.master.duration,
      width: params.master.width,
      height: params.master.height,
      lastModified: params.master.lastModified
    },
    delivery: params.preset,
    loudness: params.loudness,
    colorGrade: params.colorGrade,
    restoration: params.restoration,
    subtitleFiles: params.subtitles.map((subtitle) => subtitle.fileName),
    commandPlan: buildCommandPlan(params),
    repositoryUrl: params.repositoryUrl,
    paypalUrl: params.paypalUrl
  };
}

export function createFestivalZip(params: {
  manifest: FestivalManifest;
  subtitles: SubtitleFile[];
}): Blob {
  const files: Record<string, Uint8Array> = {
    "manifest.json": strToU8(JSON.stringify(params.manifest, null, 2)),
    "README.txt": strToU8(buildPackageReadme(params.manifest)),
    "DCP_ADJACENT/ASSETMAP_PLACEHOLDER.xml": strToU8(
      buildAssetMapPlaceholder(params.manifest)
    ),
    "DCP_ADJACENT/VOLINDEX.xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8"?><VolumeIndex><Index>1</Index></VolumeIndex>\n'
    )
  };

  for (const subtitle of params.subtitles) {
    files[`subtitles/${subtitle.fileName}`] = strToU8(subtitle.content);
  }

  const zipped = zipSync(files);
  const buffer = new ArrayBuffer(zipped.byteLength);
  new Uint8Array(buffer).set(zipped);

  return new Blob([buffer], { type: "application/zip" });
}

export function safeBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const safe = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return safe || "cinematheca-master";
}

function buildPackageReadme(manifest: FestivalManifest): string {
  return `Cinematheca Festival Package

Master: ${manifest.master.name}
Delivery preset: ${manifest.delivery.label}
Generated: ${manifest.generatedAt}

Repository: ${manifest.repositoryUrl}
Support: ${manifest.paypalUrl}

This package is DCP-adjacent for review and submission prep. It is not a certified theatrical DCP.
`;
}

function buildAssetMapPlaceholder(manifest: FestivalManifest): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<AssetMap>
  <AnnotationText>${manifest.master.name}</AnnotationText>
  <Creator>Cinematheca ${manifest.schemaVersion}</Creator>
  <IssueDate>${manifest.generatedAt}</IssueDate>
</AssetMap>
`;
}
