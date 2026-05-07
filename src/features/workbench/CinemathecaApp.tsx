import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  Film,
  Github,
  Heart,
  Languages,
  PackageCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Volume2,
  WandSparkles
} from "lucide-react";
import { loudnessTargets } from "../audio/audio";
import {
  createFestivalManifest,
  createFestivalZip,
  deliveryPresets,
  safeBaseName
} from "../delivery/delivery";
import { probeFfmpegCapability, type FfmpegCapability } from "../engines/ffmpegAdapter";
import { probeMlCapability } from "../engines/mlAdapters";
import {
  createFallbackMetadata,
  readVideoMetadata,
  type MasterMetadata
} from "../master/master";
import {
  buildCssPreviewFilter,
  defaultColorGrade,
  defaultRestorationRecipe,
  type ColorGrade,
  type RestorationRecipe
} from "../picture/picture";
import { clearArtifacts, saveArtifact } from "../storage/artifactStore";
import {
  loadProjectPreferences,
  saveProjectPreferences,
  type ProjectPreferences
} from "../storage/projectStorage";
import { createSubtitleFiles, subtitleLanguages } from "../subtitles/subtitle";
import {
  APP_VERSION,
  PAYPAL_URL,
  REPOSITORY_URL,
  fetchBuildInfo,
  fetchLiveCommit
} from "../../shared/buildInfo";
import { getErrorMessage } from "../../shared/errors";
import { formatBytes, formatDuration, formatRelativeDate } from "../../shared/format";

const sampleTranscript = `Open on the midnight station. Nobody speaks above a whisper.
Her letter waits inside the projector booth.
By sunrise, the whole town will know which reel was missing.`;

const fallbackPreferences: ProjectPreferences = {
  transcript: sampleTranscript,
  languageCodes: ["en", "ro", "fr"],
  loudnessTargetId: "ebu-r128-broadcast",
  deliveryPresetId: "festival-h264"
};

type Toast = {
  tone: "ok" | "warn";
  message: string;
};

type PackageState = {
  url: string;
  name: string;
  size: number;
  subtitleCount: number;
  generatedAt: string;
};

export function CinemathecaApp() {
  const [preferences, setPreferences] = useState<ProjectPreferences>(() =>
    loadProjectPreferences(fallbackPreferences)
  );
  const [master, setMaster] = useState<MasterMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [colorGrade, setColorGrade] = useState<ColorGrade>(defaultColorGrade);
  const [restoration, setRestoration] = useState<RestorationRecipe>(
    defaultRestorationRecipe
  );
  const [toast, setToast] = useState<Toast | null>(null);
  const [packageState, setPackageState] = useState<PackageState | null>(null);
  const [ffmpegCapability, setFfmpegCapability] = useState<FfmpegCapability | null>(
    null
  );
  const [isProbingFfmpeg, setIsProbingFfmpeg] = useState(false);

  const buildInfo = useQuery({
    queryKey: ["build-info"],
    queryFn: fetchBuildInfo
  });
  const liveCommit = useQuery({
    queryKey: ["live-commit"],
    queryFn: fetchLiveCommit
  });

  const mlCapability = useMemo(() => probeMlCapability(), []);
  const selectedLanguages = useMemo(
    () =>
      subtitleLanguages.filter((language) =>
        preferences.languageCodes.includes(language.code)
      ),
    [preferences.languageCodes]
  );
  const selectedLoudness =
    loudnessTargets.find((target) => target.id === preferences.loudnessTargetId) ??
    loudnessTargets[0];
  const selectedPreset =
    deliveryPresets.find((preset) => preset.id === preferences.deliveryPresetId) ??
    deliveryPresets[0];
  const effectiveMaster = master ?? createFallbackMetadata();
  const plannedSubtitleCount = selectedLanguages.length * 3;

  useEffect(() => {
    saveProjectPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (packageState) {
        URL.revokeObjectURL(packageState.url);
      }
    };
  }, [packageState, previewUrl]);

  async function handleFile(file: File) {
    setToast(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    try {
      setMaster(await readVideoMetadata(file));
      setToast({ tone: "ok", message: "Master metadata loaded locally." });
    } catch (error) {
      setMaster(createFallbackMetadata(file));
      setToast({
        tone: "warn",
        message: getErrorMessage(error)
      });
    }
  }

  async function generatePackage() {
    setToast(null);
    try {
      const subtitles = createSubtitleFiles({
        transcript: preferences.transcript,
        durationSeconds: effectiveMaster.duration,
        languages:
          selectedLanguages.length > 0 ? selectedLanguages : [subtitleLanguages[0]],
        baseName: safeBaseName(effectiveMaster.name)
      });
      const manifest = createFestivalManifest({
        master: effectiveMaster,
        preset: selectedPreset,
        loudness: selectedLoudness,
        colorGrade,
        restoration,
        subtitles,
        repositoryUrl: REPOSITORY_URL,
        paypalUrl: PAYPAL_URL
      });
      const blob = createFestivalZip({ manifest, subtitles });
      const name = `${safeBaseName(effectiveMaster.name)}-festival-package.zip`;

      if (packageState) {
        URL.revokeObjectURL(packageState.url);
      }

      await saveArtifact({
        id: crypto.randomUUID(),
        name,
        type: "application/zip",
        size: blob.size,
        createdAt: manifest.generatedAt,
        blob
      });

      setPackageState({
        url: URL.createObjectURL(blob),
        name,
        size: blob.size,
        subtitleCount: subtitles.length,
        generatedAt: manifest.generatedAt
      });
      setToast({ tone: "ok", message: "Festival package generated." });
    } catch (error) {
      setToast({
        tone: "warn",
        message: `Package failed: ${getErrorMessage(error)}`
      });
    }
  }

  async function checkFfmpeg() {
    setIsProbingFfmpeg(true);
    setFfmpegCapability(null);
    const result = await probeFfmpegCapability();
    setFfmpegCapability(result);
    setIsProbingFfmpeg(false);
  }

  async function clearLocalArtifacts() {
    await clearArtifacts();
    if (packageState) {
      URL.revokeObjectURL(packageState.url);
    }
    setPackageState(null);
    setToast({ tone: "ok", message: "Local generated artifacts cleared." });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Film size={24} />
          </div>
          <div>
            <p className="eyebrow">Cinematheca</p>
            <h1>Independent post house in the browser</h1>
          </div>
        </div>
        <nav className="top-actions" aria-label="Project links">
          <a
            className="icon-link"
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} />
            <span>Star repo</span>
            <ExternalLink size={14} />
          </a>
          <a
            className="icon-link accent"
            href={PAYPAL_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Heart size={18} />
            <span>PayPal</span>
            <ExternalLink size={14} />
          </a>
        </nav>
      </header>

      <section className="version-strip" aria-label="Build version">
        <span>Version {buildInfo.data?.version ?? APP_VERSION}</span>
        <span>
          Build commit{" "}
          <code>
            {liveCommit.data?.shortSha ?? buildInfo.data?.commit ?? "loading"}
          </code>
        </span>
        <span>
          {liveCommit.data
            ? formatRelativeDate(liveCommit.data.committedAt)
            : "checking GitHub"}
        </span>
      </section>

      {toast ? (
        <div className={`toast ${toast.tone}`} role="status">
          {toast.tone === "ok" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      ) : null}

      <main className="workspace">
        <section className="preview-panel">
          <div
            className="drop-zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files.item(0);
              if (file) {
                void handleFile(file);
              }
            }}
          >
            {previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="master-preview"
                style={{ filter: buildCssPreviewFilter(colorGrade) }}
              />
            ) : (
              <div className="slate" aria-label="No master selected">
                <span>24</span>
                <strong>MASTER</strong>
                <small>local preview</small>
              </div>
            )}
          </div>
          <div className="intake-row">
            <label className="button primary" htmlFor="master-file">
              <Upload size={18} />
              <span>Drop master</span>
            </label>
            <input
              id="master-file"
              data-testid="master-file"
              type="file"
              accept="video/*,audio/*"
              onChange={(event) => {
                const file = event.currentTarget.files?.item(0);
                if (file) {
                  void handleFile(file);
                }
              }}
            />
            <button
              className="button ghost"
              type="button"
              onClick={() => void clearLocalArtifacts()}
            >
              <Trash2 size={18} />
              <span>Clear outputs</span>
            </button>
          </div>
          <dl className="metadata-grid">
            <div>
              <dt>Master</dt>
              <dd>{effectiveMaster.name}</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{formatDuration(effectiveMaster.duration)}</dd>
            </div>
            <div>
              <dt>Raster</dt>
              <dd>
                {effectiveMaster.width}x{effectiveMaster.height}
              </dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{formatBytes(effectiveMaster.size)}</dd>
            </div>
          </dl>
        </section>

        <section className="panel subtitles-panel">
          <PanelTitle icon={<Languages size={20} />} title="Subtitles" />
          <textarea
            value={preferences.transcript}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                transcript: event.target.value
              }))
            }
            aria-label="Transcript text"
            data-testid="transcript"
          />
          <div className="language-grid" aria-label="Subtitle languages">
            {subtitleLanguages.map((language) => {
              const selected = preferences.languageCodes.includes(language.code);
              return (
                <button
                  key={language.code}
                  type="button"
                  className={`chip ${selected ? "selected" : ""}`}
                  onClick={() =>
                    setPreferences((current) => ({
                      ...current,
                      languageCodes: selected
                        ? current.languageCodes.filter((code) => code !== language.code)
                        : [...current.languageCodes, language.code]
                    }))
                  }
                >
                  {language.label}
                </button>
              );
            })}
          </div>
          <p className="panel-note">
            {plannedSubtitleCount} subtitle files planned. NLLB adapter boundary:
            review-required tracks carry source text until a local model is loaded.
          </p>
        </section>

        <section className="panel controls-panel">
          <PanelTitle icon={<Volume2 size={20} />} title="Audio" />
          <select
            value={preferences.loudnessTargetId}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                loudnessTargetId: event.target.value
              }))
            }
            aria-label="Loudness target"
          >
            {loudnessTargets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.label} ({target.integratedLufs} LUFS)
              </option>
            ))}
          </select>

          <PanelTitle icon={<SlidersHorizontal size={20} />} title="Color" />
          <ControlSlider
            label="Exposure"
            value={colorGrade.exposure}
            min={-30}
            max={30}
            step={1}
            onChange={(value) =>
              setColorGrade((current) => ({ ...current, exposure: value }))
            }
          />
          <ControlSlider
            label="Contrast"
            value={colorGrade.contrast}
            min={0.7}
            max={1.4}
            step={0.01}
            onChange={(value) =>
              setColorGrade((current) => ({ ...current, contrast: value }))
            }
          />
          <ControlSlider
            label="Saturation"
            value={colorGrade.saturation}
            min={0.6}
            max={1.5}
            step={0.01}
            onChange={(value) =>
              setColorGrade((current) => ({ ...current, saturation: value }))
            }
          />
          <ControlSlider
            label="Temp"
            value={colorGrade.temperature}
            min={-50}
            max={50}
            step={1}
            onChange={(value) =>
              setColorGrade((current) => ({ ...current, temperature: value }))
            }
          />
        </section>

        <section className="panel restoration-panel">
          <PanelTitle icon={<WandSparkles size={20} />} title="Restore" />
          <div className="segmented">
            {(["off", "2x", "4x"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={restoration.upscale === option ? "active" : ""}
                onClick={() =>
                  setRestoration((current) => ({ ...current, upscale: option }))
                }
              >
                {option}
              </button>
            ))}
          </div>
          <Toggle
            label="Deblur"
            checked={restoration.deblur}
            onChange={(checked) =>
              setRestoration((current) => ({ ...current, deblur: checked }))
            }
          />
          <Toggle
            label="Denoise"
            checked={restoration.denoise}
            onChange={(checked) =>
              setRestoration((current) => ({ ...current, denoise: checked }))
            }
          />
          <Toggle
            label="DeOldify"
            checked={restoration.colorize}
            onChange={(checked) =>
              setRestoration((current) => ({ ...current, colorize: checked }))
            }
          />
          <div className="engine-grid">
            <EngineBadge label="WebGPU" active={mlCapability.webGpu} />
            <EngineBadge label="WASM" active={mlCapability.wasm} />
            <button
              className="engine-probe"
              type="button"
              onClick={() => void checkFfmpeg()}
              disabled={isProbingFfmpeg}
            >
              <Cpu size={16} />
              {isProbingFfmpeg ? "FFmpeg..." : "Probe FFmpeg"}
            </button>
          </div>
          {ffmpegCapability ? (
            <p
              className={`panel-note ${ffmpegCapability.available ? "ok-text" : "warn-text"}`}
            >
              {ffmpegCapability.message}
            </p>
          ) : (
            <p className="panel-note">{mlCapability.message}</p>
          )}
        </section>

        <section className="panel delivery-panel">
          <PanelTitle icon={<PackageCheck size={20} />} title="Deliver" />
          <select
            value={preferences.deliveryPresetId}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                deliveryPresetId: event.target.value
              }))
            }
            aria-label="Delivery preset"
          >
            {deliveryPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
          <dl className="preset-grid">
            <div>
              <dt>Container</dt>
              <dd>{selectedPreset.container}</dd>
            </div>
            <div>
              <dt>Video</dt>
              <dd>{selectedPreset.videoCodec}</dd>
            </div>
            <div>
              <dt>Audio</dt>
              <dd>{selectedPreset.audioCodec}</dd>
            </div>
            <div>
              <dt>Target</dt>
              <dd>{selectedPreset.resolution}</dd>
            </div>
          </dl>
          <button
            className="button primary wide"
            type="button"
            data-testid="generate-package"
            onClick={() => void generatePackage()}
          >
            <Sparkles size={18} />
            <span>Generate package</span>
          </button>
          {packageState ? (
            <a
              className="button download wide"
              href={packageState.url}
              download={packageState.name}
              data-testid="download-package"
            >
              <Download size={18} />
              <span>
                {packageState.name} ({formatBytes(packageState.size)})
              </span>
            </a>
          ) : null}
        </section>
      </main>

      <footer className="footer">
        <span>
          Published on GitHub Pages from{" "}
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            {REPOSITORY_URL}
          </a>
        </span>
        <span>
          Support future local-first cinema tools at{" "}
          <a href={PAYPAL_URL} target="_blank" rel="noreferrer">
            {PAYPAL_URL}
          </a>
        </span>
      </footer>
    </div>
  );
}

function PanelTitle(props: { icon: React.ReactNode; title: string }) {
  return (
    <div className="panel-title">
      {props.icon}
      <h2>{props.title}</h2>
    </div>
  );
}

function ControlSlider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider-row">
      <span>{props.label}</span>
      <input
        type="range"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(event) => props.onChange(Number(event.currentTarget.value))}
      />
      <output>{Number(props.value).toFixed(props.step < 1 ? 2 : 0)}</output>
    </label>
  );
}

function Toggle(props: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>{props.label}</span>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event) => props.onChange(event.currentTarget.checked)}
      />
    </label>
  );
}

function EngineBadge(props: { label: string; active: boolean }) {
  return (
    <span className={`engine-badge ${props.active ? "active" : ""}`}>
      {props.active ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {props.label}
    </span>
  );
}
