import { z } from "zod";

const projectPreferencesSchema = z.object({
  transcript: z.string(),
  languageCodes: z.array(z.string()),
  loudnessTargetId: z.string(),
  deliveryPresetId: z.string()
});

export type ProjectPreferences = z.infer<typeof projectPreferencesSchema>;

const storageKey = "cinematheca.project.v1";

export function loadProjectPreferences(
  fallback: ProjectPreferences
): ProjectPreferences {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return fallback;
    }
    return projectPreferencesSchema.parse(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

export function saveProjectPreferences(preferences: ProjectPreferences): void {
  localStorage.setItem(storageKey, JSON.stringify(preferences));
}
