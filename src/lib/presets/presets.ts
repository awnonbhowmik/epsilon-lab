import type { ShareState } from "../share/urlState";
import { encodeShareState } from "../share/urlState";

export type Preset = {
  id: string;
  title: string;
  description: string;
  state: ShareState;
  learningGoal: string;
};

export type PresetCategory = {
  label: string;
  presets: Preset[];
};

/* ── Laplace presets ──────────────────────────────────────────────── */

const laplacePresets: Preset[] = [
  {
    id: "laplace-high-privacy",
    title: "Laplace — High Privacy (ε = 0.2)",
    description:
      "Very small ε produces wide noise, strong privacy but poor utility.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.2,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
    learningGoal:
      "Observe how small ε dramatically increases the Laplace scale b and absolute error.",
  },
  {
    id: "laplace-balanced",
    title: "Laplace — Balanced (ε = 1)",
    description: "Moderate ε balances privacy and utility for everyday use.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
    learningGoal:
      "See the typical tradeoff at ε = 1, a common real-world default.",
  },
  {
    id: "laplace-low-privacy",
    title: "Laplace — Low Privacy (ε = 5)",
    description:
      "Large ε means very little noise — accurate but weak privacy.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 5,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
    learningGoal:
      "Understand why large ε effectively removes the privacy guarantee.",
  },
  {
    id: "laplace-sensitivity-matters",
    title: 'Laplace — "Sensitivity Matters"',
    description:
      "Compare Sum vs Mean vs Count to see how Δf drives noise magnitude.",
    state: {
      datasetId: "small_integers",
      queryType: "mean",
      epsilon: 1,
      sensitivity: 0.75,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: true,
      mechanism: "laplace",
      topic: "single_query",
    },
    learningGoal:
      "Learn that sensitivity (Δf) is as important as ε in determining noise.",
  },
  {
    id: "laplace-skewed-data",
    title: "Laplace — Skewed Data Noise Impact",
    description:
      "Right-skewed data with outliers — see how noise compares to the tail.",
    state: {
      datasetId: "skewed",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 100,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
    learningGoal:
      "Explore how data distribution and outlier-driven sensitivity affect utility.",
  },
];

/* ── Gaussian presets ─────────────────────────────────────────────── */

const gaussianPresets: Preset[] = [
  {
    id: "gaussian-baseline",
    title: "Gaussian — Baseline (ε = 1, δ = 1e-5)",
    description:
      "Standard (ε, δ)-DP Gaussian mechanism with typical parameters.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-5,
    },
    learningGoal:
      "Introduce the Gaussian mechanism and the role of δ alongside ε.",
  },
  {
    id: "gaussian-smaller-delta",
    title: "Gaussian — Smaller δ (1e-7) Increases Noise",
    description:
      "Reducing δ tightens the guarantee but requires larger σ.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-7,
    },
    learningGoal:
      "Understand the δ–σ relationship: smaller δ ⇒ more noise (higher σ).",
  },
  {
    id: "gaussian-vs-laplace",
    title: "Gaussian vs Laplace at ε = 1",
    description:
      "Compare both mechanisms at the same ε to see PDF shape differences.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-5,
    },
    learningGoal:
      "Compare Laplace (heavy-tailed) vs Gaussian (lighter tails) noise shapes.",
  },
  {
    id: "gaussian-mean-query",
    title: "Gaussian — Mean Query Demo",
    description:
      "Mean query with Gaussian noise — sensitivity is much smaller than Sum.",
    state: {
      datasetId: "small_floats",
      queryType: "mean",
      epsilon: 1,
      sensitivity: 0.235,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: true,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-5,
    },
    learningGoal:
      "See how mean queries have low sensitivity, producing tight noise.",
  },
  {
    id: "gaussian-count-query",
    title: "Gaussian — Count Query Demo",
    description:
      "Count query with Δf = 1 — the simplest possible sensitivity.",
    state: {
      datasetId: "uniform",
      queryType: "count",
      epsilon: 1,
      sensitivity: 1,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-5,
    },
    learningGoal:
      "Understand that count queries always have Δf = 1, giving minimal noise.",
  },
];

/* ── Composition presets ──────────────────────────────────────────── */

const compositionPresets: Preset[] = [
  {
    id: "comp-k5-eps05",
    title: "Composition — k = 5, ε = 0.5 each",
    description:
      "5 sequential queries each with ε = 0.5 — total budget ε = 2.5.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.5,
      sensitivity: 15,
      runs: 100,
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "composition",
    },
    learningGoal:
      "Learn basic sequential composition: ε_total = k · ε_per_query.",
  },
  {
    id: "comp-k10-eps02",
    title: "Composition — k = 10, ε = 0.2 each",
    description:
      "10 queries at tight per-query budget — total budget ε = 2.0.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.2,
      sensitivity: 15,
      runs: 100,
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "composition",
    },
    learningGoal:
      "See how many small-ε queries can still consume a meaningful budget.",
  },
  {
    id: "comp-gaussian",
    title: "Composition — Gaussian (ε = 0.5, δ = 1e-6)",
    description:
      "Gaussian composition with (ε_i, δ_i) per query.",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.5,
      sensitivity: 15,
      runs: 100,
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "composition",
      delta: 1e-6,
    },
    learningGoal:
      "Understand that Gaussian composition accumulates both ε and δ.",
  },
];

/* ── Exported categories and helpers ──────────────────────────────── */

export const PRESET_CATEGORIES: PresetCategory[] = [
  { label: "Laplace Mechanism", presets: laplacePresets },
  { label: "Gaussian Mechanism", presets: gaussianPresets },
  { label: "Composition", presets: compositionPresets },
];

export const ALL_PRESETS: Preset[] = PRESET_CATEGORIES.flatMap(
  (c) => c.presets,
);

export function getPresetById(id: string): Preset | undefined {
  return ALL_PRESETS.find((p) => p.id === id);
}

/**
 * Build a simulator URL for a given preset state.
 * Returns a relative path like `/simulator?d=...&e=...`.
 */
export function presetToUrl(preset: Preset): string {
  const params = encodeShareState(preset.state);
  return `/simulator?${params.toString()}`;
}
