import type { SimRequest, SimResponse } from "./types";
import { mapSimResponse } from "./utils";

// Module-level singleton: the WASM module is initialised once per page load.
let wasmReady: Promise<void> | null = null;
let wasmMod: any = null;

async function initWasm(): Promise<any> {
  if (wasmMod !== null) return wasmMod;

  const mod: any = await import("@/wasm/dp_engine/dp_engine.js");

  if (!wasmReady) {
    // wasm-pack bundler target exports a default init() function.
    wasmReady =
      typeof mod.default === "function" ? mod.default() : Promise.resolve();
    await wasmReady;
  }

  wasmMod = mod;
  return mod;
}

/**
 * Run a differentially private Laplace-mechanism simulation.
 *
 * Delegates all computation to the Rust/WASM engine.  The WASM function now
 * returns a structured JS object (via serde_wasm_bindgen) rather than a JSON
 * string, eliminating an unnecessary serialise/parse round-trip.
 *
 * Errors from the Rust side are propagated as thrown JS exceptions whose
 * `.message` is a plain-English description; they surface as rejected Promises.
 */
export async function simulate(req: SimRequest): Promise<SimResponse> {
  const mod = await initWasm();

  // Validate inputs on the TS side before crossing the WASM boundary.
  if (!Array.isArray(req.values) || req.values.length === 0) {
    throw new Error("values must be a non-empty array");
  }
  if (!Number.isFinite(req.epsilon) || req.epsilon <= 0) {
    throw new Error("epsilon must be a finite positive number");
  }
  if (!Number.isFinite(req.sensitivity) || req.sensitivity <= 0) {
    throw new Error("sensitivity must be a finite positive number");
  }
  if (!Number.isInteger(req.runs) || req.runs < 1 || req.runs > 10_000) {
    throw new Error("runs must be an integer between 1 and 10,000");
  }

  const float64Array = new Float64Array(req.values);
  const seedStr =
    req.seed !== undefined ? req.seed.toString() : null;

  // simulate_query throws a JS exception on invalid input (Result::Err in Rust)
  // and returns a plain JS object on success.
  const raw = mod.simulate_query(
    float64Array,
    req.queryType,
    req.epsilon,
    req.sensitivity,
    req.runs,
    seedStr
  );

  return mapSimResponse(raw);
}
