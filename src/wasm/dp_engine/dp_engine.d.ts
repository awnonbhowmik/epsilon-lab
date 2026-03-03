/* tslint:disable */
/* eslint-disable */

/**
 * Run a differentially private simulation using the Laplace mechanism.
 *
 * # Parameters
 * - `values`      — dataset as a `Float64Array`
 * - `query_type`  — `"sum"`, `"mean"`, or `"count"`
 * - `epsilon`     — privacy budget ε > 0
 * - `sensitivity` — global sensitivity Δf > 0
 * - `runs`        — Monte-Carlo iterations (1 – 10 000)
 * - `seed`        — optional u64 seed string for reproducibility
 *
 * # Returns
 * A JS object matching `SimResponse` on success, or throws a descriptive
 * string exception on invalid input or computation error.
 */
export function simulate_query(values: Float64Array, query_type: string, epsilon: number, sensitivity: number, runs: number, seed?: string | null): any;
