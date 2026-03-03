import type { DatasetId } from "@/lib/datasets";
import type { QueryType } from "@/lib/dp/types";

/**
 * Simulator state that can be shared via URL query parameters.
 */
export type ShareState = {
  datasetId: DatasetId;
  queryType: QueryType;
  epsilon: number;
  sensitivity: number;
  runs: number;
  seed?: string;
  mode: "student" | "academic";
  advancedSensitivity: boolean;
};

/* ── Short parameter names (keeps URLs readable) ────────────── */
const PARAM = {
  datasetId: "d",
  queryType: "q",
  epsilon: "e",
  sensitivity: "s",
  runs: "r",
  seed: "seed",
  mode: "m",
  advancedSensitivity: "adv",
} as const;

const VALID_DATASETS = new Set<string>([
  "small_integers",
  "small_floats",
  "skewed",
  "uniform",
]);
const VALID_QUERIES = new Set<string>(["sum", "mean", "count"]);
const VALID_MODES = new Set<string>(["student", "academic"]);

/**
 * Encode simulator state into URL search parameters.
 */
export function encodeShareState(state: ShareState): URLSearchParams {
  const p = new URLSearchParams();
  p.set(PARAM.datasetId, state.datasetId);
  p.set(PARAM.queryType, state.queryType);
  p.set(PARAM.epsilon, String(state.epsilon));
  p.set(PARAM.sensitivity, String(state.sensitivity));
  p.set(PARAM.runs, String(state.runs));
  if (state.seed) p.set(PARAM.seed, state.seed);
  p.set(PARAM.mode, state.mode);
  p.set(PARAM.advancedSensitivity, state.advancedSensitivity ? "1" : "0");
  return p;
}

/**
 * Decode URL search parameters into a partial ShareState.
 * Invalid values are silently ignored.
 */
export function decodeShareState(
  params: URLSearchParams,
): Partial<ShareState> {
  const result: Partial<ShareState> = {};

  const d = params.get(PARAM.datasetId);
  if (d && VALID_DATASETS.has(d)) result.datasetId = d as DatasetId;

  const q = params.get(PARAM.queryType);
  if (q && VALID_QUERIES.has(q)) result.queryType = q as QueryType;

  const e = params.get(PARAM.epsilon);
  if (e !== null) {
    const n = Number(e);
    if (Number.isFinite(n) && n > 0 && n <= 10) result.epsilon = n;
  }

  const s = params.get(PARAM.sensitivity);
  if (s !== null) {
    const n = Number(s);
    if (Number.isFinite(n) && n > 0) result.sensitivity = n;
  }

  const r = params.get(PARAM.runs);
  if (r !== null) {
    const n = Number(r);
    if (Number.isInteger(n) && n >= 1 && n <= 10000) result.runs = n;
  }

  const seed = params.get(PARAM.seed);
  if (seed !== null && seed.length > 0) result.seed = seed;

  const m = params.get(PARAM.mode);
  if (m && VALID_MODES.has(m)) result.mode = m as "student" | "academic";

  const adv = params.get(PARAM.advancedSensitivity);
  if (adv === "1") result.advancedSensitivity = true;
  else if (adv === "0") result.advancedSensitivity = false;

  return result;
}
