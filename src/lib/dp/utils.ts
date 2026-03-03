import type { SimResponse, SimSummary } from "./types";

/**
 * Assert that `v` is a finite number; throw a descriptive error otherwise.
 */
export function assertFiniteNumber(name: string, v: unknown): asserts v is number {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`${name} must be a finite number, got ${String(v)}`);
  }
}

/**
 * Map a raw snake_case WASM result object to a camelCase `SimResponse`.
 *
 * Validates presence, types, and finiteness of every field so that downstream
 * code can rely on the `SimResponse` contract.
 */
export function mapSimResponse(raw: Record<string, unknown>): SimResponse {
  if (raw == null || typeof raw !== "object") {
    throw new Error("WASM returned a non-object result");
  }

  // --- scalar fields ---------------------------------------------------
  const trueValue = raw.true_value ?? raw.trueValue;
  assertFiniteNumber("trueValue", trueValue);

  const scale = raw.scale;
  assertFiniteNumber("scale", scale);

  // --- array fields ----------------------------------------------------
  function mapNumberArray(snakeKey: string, camelKey: string): number[] {
    const arr: unknown = raw[snakeKey] ?? raw[camelKey];
    if (!Array.isArray(arr)) {
      throw new Error(`${camelKey} must be an array`);
    }
    arr.forEach((v, i) => assertFiniteNumber(`${camelKey}[${i}]`, v));
    return arr as number[];
  }

  const noisyValues = mapNumberArray("noisy_values", "noisyValues");
  const absErrors = mapNumberArray("abs_errors", "absErrors");
  const relErrorsPct = mapNumberArray("rel_errors_pct", "relErrorsPct");

  // --- summary fields --------------------------------------------------
  function mapSummary(snakeKey: string, camelKey: string): SimSummary {
    const s: Record<string, unknown> = raw[snakeKey] as Record<string, unknown> ?? raw[camelKey] as Record<string, unknown>;
    if (s == null || typeof s !== "object") {
      throw new Error(`${camelKey} must be an object`);
    }
    for (const k of ["mean", "stddev", "min", "max", "median"] as const) {
      assertFiniteNumber(`${camelKey}.${k}`, s[k]);
    }
    return s as SimSummary;
  }

  const noisySummary = mapSummary("noisy_summary", "noisySummary");
  const absErrorSummary = mapSummary("abs_error_summary", "absErrorSummary");

  return {
    trueValue,
    noisyValues,
    absErrors,
    relErrorsPct,
    noisySummary,
    absErrorSummary,
    scale,
  };
}

export function formatNumber(n: number, decimals = 4): string {
  if (!isFinite(n)) return "N/A";
  return n.toFixed(decimals);
}

export function computeSummary(values: number[]): SimSummary {
  if (values.length === 0) {
    return { mean: 0, stddev: 0, min: 0, max: 0, median: 0 };
  }
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stddev = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sorted = [...values].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  return { mean, stddev, min, max, median };
}

export function defaultSensitivity(queryType: string, values: number[]): number {
  switch (queryType) {
    case "sum":
      return Math.max(...values.map(Math.abs), 1);
    case "mean":
      return Math.max(...values.map(Math.abs), 1) / values.length;
    case "count":
      return 1;
    default:
      return 1;
  }
}

export function laplacePdf(x: number, scale: number): number {
  return (1 / (2 * scale)) * Math.exp(-Math.abs(x) / scale);
}
