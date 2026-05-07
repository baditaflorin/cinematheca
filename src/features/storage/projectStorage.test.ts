import {
  loadProjectPreferences,
  saveProjectPreferences,
  type ProjectPreferences
} from "./projectStorage";

const fallback: ProjectPreferences = {
  transcript: "Fallback",
  languageCodes: ["en"],
  loudnessTargetId: "festival",
  deliveryPresetId: "web-av1"
};

describe("project preference storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns fallback preferences when storage is empty", () => {
    expect(loadProjectPreferences(fallback)).toEqual(fallback);
  });

  it("saves and restores preferences", () => {
    const preferences: ProjectPreferences = {
      transcript: "Saved",
      languageCodes: ["en", "ro"],
      loudnessTargetId: "ebu-r128-broadcast",
      deliveryPresetId: "festival-h264"
    };

    saveProjectPreferences(preferences);

    expect(loadProjectPreferences(fallback)).toEqual(preferences);
  });
});
