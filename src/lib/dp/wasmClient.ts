import type { SimRequest, SimResponse } from "./types";

let wasmReady: Promise<void> | null = null;
let wasmMod: any = null;

async function initWasm(): Promise<any> {
  if (wasmMod !== null) return wasmMod;
  const mod: any = await import("@/wasm/dp_engine/dp_engine.js");
  if (!wasmReady) {
    wasmReady =
      typeof mod.default === "function" ? mod.default() : Promise.resolve();
    await wasmReady;
  }
  wasmMod = mod;
  return mod;
}

export async function simulate(req: SimRequest): Promise<SimResponse> {
  const mod = await initWasm();

  const float64Array = new Float64Array(req.values);

  const seedStr =
    req.seed !== undefined ? req.seed.toString() : undefined;

  const result = mod.simulate_query(
    float64Array,
    req.queryType,
    req.epsilon,
    req.sensitivity,
    req.runs,
    seedStr ?? null
  );

  let parsed: any;
  if (typeof result === "string") {
    parsed = JSON.parse(result);
  } else if (result && typeof result === "object") {
    parsed = result;
  } else {
    throw new Error("Unexpected WASM return type");
  }

  if (parsed.error) {
    throw new Error(parsed.error);
  }

  return {
    trueValue: parsed.trueValue,
    noisyValues: Array.from(parsed.noisyValues),
    absErrors: Array.from(parsed.absErrors),
    relErrorsPct: Array.from(parsed.relErrorsPct),
    noisySummary: parsed.noisySummary,
    absErrorSummary: parsed.absErrorSummary,
    scale: parsed.scale,
  } as SimResponse;
}
