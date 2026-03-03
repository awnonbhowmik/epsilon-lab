import type { SimSummary } from "./types";

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
