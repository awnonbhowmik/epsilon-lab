import type { DatasetId } from "@/lib/datasets";
import type { Mechanism, QueryType, Topic } from "@/lib/dp/types";

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
  mechanism: Mechanism;
  topic: Topic;
  delta?: number;
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
  mechanism: "mech",
  topic: "topic",
  delta: "dl",
} as const;

/** Valid ranges — keep in sync with ControlPanel slider/input limits. */
const MAX_EPSILON = 10;
const MAX_RUNS = 10_000;

const VALID_DATASETS = new Set<string>([
  "small_integers",
  "small_floats",
  "skewed",
  "uniform",
]);
const VALID_QUERIES = new Set<string>(["sum", "mean", "count"]);
const VALID_MODES = new Set<string>(["student", "academic"]);
const VALID_MECHANISMS = new Set<string>(["laplace", "gaussian"]);
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
  p.set(PARAM.mechanism, state.mechanism);
  p.set(PARAM.topic, state.topic === "single_query" ? "single" : "comp");
  if (state.delta != null) p.set(PARAM.delta, String(state.delta));
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
    if (Number.isFinite(n) && n > 0 && n <= MAX_EPSILON) result.epsilon = n;
  }

  const s = params.get(PARAM.sensitivity);
  if (s !== null) {
    const n = Number(s);
    if (Number.isFinite(n) && n > 0) result.sensitivity = n;
  }

  const r = params.get(PARAM.runs);
  if (r !== null) {
    const n = Number(r);
    if (Number.isInteger(n) && n >= 1 && n <= MAX_RUNS) result.runs = n;
  }

  const seed = params.get(PARAM.seed);
  if (seed !== null && seed.length > 0) result.seed = seed;

  const m = params.get(PARAM.mode);
  if (m && VALID_MODES.has(m)) result.mode = m as "student" | "academic";

  const adv = params.get(PARAM.advancedSensitivity);
  if (adv === "1") result.advancedSensitivity = true;
  else if (adv === "0") result.advancedSensitivity = false;

  const mech = params.get(PARAM.mechanism);
  if (mech && VALID_MECHANISMS.has(mech)) result.mechanism = mech as Mechanism;

  const topic = params.get(PARAM.topic);
  if (topic === "single") result.topic = "single_query";
  else if (topic === "comp") result.topic = "composition";

  const dl = params.get(PARAM.delta);
  if (dl !== null) {
    const n = Number(dl);
    if (Number.isFinite(n) && n > 0 && n < 1) result.delta = n;
  }

  return result;
}
