import { describe, it, expect } from "vitest";
import {
  ALL_PRESETS,
  PRESET_CATEGORIES,
  getPresetById,
  presetToUrl,
} from "../src/lib/presets/presets";
import type { Preset } from "../src/lib/presets/presets";
import { decodeShareState } from "../src/lib/share/urlState";

describe("presets library", () => {
  it("exports at least 10 presets", () => {
    expect(ALL_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it("has three categories (Laplace, Gaussian, Composition)", () => {
    expect(PRESET_CATEGORIES).toHaveLength(3);
    const labels = PRESET_CATEGORIES.map((c) => c.label);
    expect(labels).toContain("Laplace Mechanism");
    expect(labels).toContain("Gaussian Mechanism");
    expect(labels).toContain("Composition");
  });

  it("all presets have unique ids", () => {
    const ids = ALL_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all presets have non-empty required fields", () => {
    for (const preset of ALL_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.learningGoal).toBeTruthy();
      expect(preset.state).toBeDefined();
      expect(preset.state.epsilon).toBeGreaterThan(0);
      expect(preset.state.mechanism).toBeTruthy();
    }
  });

  it("getPresetById returns correct preset", () => {
    const p = getPresetById("laplace-balanced");
    expect(p).toBeDefined();
    expect(p!.title).toContain("Balanced");
  });

  it("getPresetById returns undefined for unknown id", () => {
    expect(getPresetById("nonexistent")).toBeUndefined();
  });

  it("presetToUrl produces a valid URL with decodable state", () => {
    const preset = ALL_PRESETS[0];
    const url = presetToUrl(preset);
    expect(url).toMatch(/^\/simulator\?/);

    // Extract query string and decode
    const qs = url.split("?")[1];
    const params = new URLSearchParams(qs);
    const decoded = decodeShareState(params);
    expect(decoded.epsilon).toBe(preset.state.epsilon);
    expect(decoded.mechanism).toBe(preset.state.mechanism);
    expect(decoded.datasetId).toBe(preset.state.datasetId);
  });

  it("Gaussian presets include delta in their state", () => {
    const gaussianPresets = ALL_PRESETS.filter(
      (p) => p.state.mechanism === "gaussian",
    );
    expect(gaussianPresets.length).toBeGreaterThanOrEqual(1);
    for (const p of gaussianPresets) {
      if (p.state.topic === "single_query") {
        expect(p.state.delta).toBeDefined();
        expect(p.state.delta).toBeGreaterThan(0);
        expect(p.state.delta!).toBeLessThan(1);
      }
    }
  });
});
