/**
 * TypeScript types that mirror the Rust structs in crates/dp_engine/src/lib.rs.
 *
 * Keep these in sync with the #[derive(Serialize)] structs there.
 * The camelCase naming matches Rust's #[serde(rename_all = "camelCase")].
 */

/** The three query functions supported by both mechanisms. */
export type QueryType = "sum" | "mean" | "count";

/** Noise mechanism used by the DP engine. */
export type Mechanism = "laplace" | "gaussian";

/** Topic / view mode for the simulator. */
export type Topic = "single_query" | "composition";

/** Parameters sent to the WASM simulate_query function. */
export type SimRequest = {
  /** Dataset values (mapped to Float64Array at the WASM boundary). */
  values: number[];
  queryType: QueryType;
  /** Noise mechanism (default: "laplace"). */
  mechanism?: Mechanism;
  /** Privacy budget ε > 0.  Smaller = more privacy, more noise. */
  epsilon: number;
  /** Global sensitivity Δf > 0.  Max |f(x) − f(x′)| over adjacent datasets. */
  sensitivity: number;
  /** Number of Monte-Carlo iterations (1 – 10 000). */
  runs: number;
  /**
   * Optional RNG seed for deterministic reproducibility.
   * Must be a non-negative integer ≤ 2^64 − 1.
   * Omit (or leave undefined) for secure random sampling.
   */
  seed?: bigint;
  /** Failure probability δ ∈ (0, 1).  Required when mechanism = "gaussian". */
  delta?: number;
};

/**
 * Descriptive statistics over a collection of samples.
 * Mirrors Rust `SimSummary`.
 */
export type SimSummary = {
  mean: number;
  stddev: number;
  min: number;
  max: number;
  median: number;
};

/**
 * Full simulation result returned by the WASM engine.
 * Mirrors Rust `SimResponse` (with #[serde(rename_all = "camelCase")]).
 */
export type SimResponse = {
  /** Non-private (true) query answer f(x). */
  trueValue: number;
  /** One noisy answer M(x) per Monte-Carlo run. */
  noisyValues: number[];
  /** |M(x) − f(x)| per run. */
  absErrors: number[];
  /** (|M(x) − f(x)| / |f(x)|) × 100 per run; 0 when f(x) ≈ 0. */
  relErrorsPct: number[];
  noisySummary: SimSummary;
  absErrorSummary: SimSummary;
  /** Laplace scale b = Δf / ε (always present). */
  scale: number;
  /** Mechanism that produced this result. */
  mechanism: Mechanism;
  /** Gaussian σ — present when mechanism = "gaussian". */
  sigma?: number;
  /** δ used — present when mechanism = "gaussian". */
  delta?: number;
};
