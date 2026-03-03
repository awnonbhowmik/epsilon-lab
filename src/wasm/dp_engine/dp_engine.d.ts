/* tslint:disable */
/* eslint-disable */

/**
 * Run a differentially private simulation using the Laplace or Gaussian mechanism.
 *
 * # Parameters
 * - `values`      — dataset as a `Float64Array`
 * - `query_type`  — `"sum"`, `"mean"`, or `"count"`
 * - `mechanism`   — `"laplace"` or `"gaussian"`
 * - `epsilon`     — privacy budget ε > 0
 * - `sensitivity` — global sensitivity Δf > 0
 * - `runs`        — Monte-Carlo iterations (1 – 10 000)
 * - `delta`       — failure probability δ ∈ (0, 1); required for gaussian
 * - `seed`        — optional u64 seed string for reproducibility
 *
 * # Returns
 * A JS object matching `SimResponse` on success, or throws a descriptive
 * string exception on invalid input or computation error.
 */
export function simulate_query(values: Float64Array, query_type: string, mechanism: string, epsilon: number, sensitivity: number, runs: number, delta?: number | null, seed?: string | null): any;
