import { describe, it, expect } from "vitest";
import { encodeShareState, decodeShareState } from "../src/lib/share/urlState";
import type { ShareState } from "../src/lib/share/urlState";

describe("encodeShareState / decodeShareState round-trip", () => {
  it("round-trips a full Laplace state", () => {
    const state: ShareState = {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1.5,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: true,
      mechanism: "laplace",
      topic: "single_query",
    };
    const params = encodeShareState(state);
    const decoded = decodeShareState(params);

    expect(decoded.datasetId).toBe(state.datasetId);
    expect(decoded.queryType).toBe(state.queryType);
    expect(decoded.epsilon).toBe(state.epsilon);
    expect(decoded.sensitivity).toBe(state.sensitivity);
    expect(decoded.runs).toBe(state.runs);
    expect(decoded.seed).toBe(state.seed);
    expect(decoded.mode).toBe(state.mode);
    expect(decoded.advancedSensitivity).toBe(state.advancedSensitivity);
    expect(decoded.mechanism).toBe("laplace");
    expect(decoded.topic).toBe("single_query");
  });

  it("round-trips a full Gaussian state with delta", () => {
    const state: ShareState = {
      datasetId: "skewed",
      queryType: "mean",
      epsilon: 0.5,
      sensitivity: 2.5,
      runs: 100,
      mode: "student",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "composition",
      delta: 1e-5,
    };
    const params = encodeShareState(state);
    const decoded = decodeShareState(params);

    expect(decoded.mechanism).toBe("gaussian");
    expect(decoded.topic).toBe("composition");
    expect(decoded.delta).toBeCloseTo(1e-5, 10);
  });

  it("omits delta from URL when mechanism is laplace", () => {
    const state: ShareState = {
      datasetId: "uniform",
      queryType: "count",
      epsilon: 2,
      sensitivity: 1,
      runs: 50,
      mode: "student",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    };
    const params = encodeShareState(state);
    expect(params.get("dl")).toBeNull();
  });

  it("ignores invalid mechanism values", () => {
    const params = new URLSearchParams("mech=exponential");
    const decoded = decodeShareState(params);
    expect(decoded.mechanism).toBeUndefined();
  });

  it("ignores out-of-range delta values", () => {
    const params = new URLSearchParams("dl=1.5");
    const decoded = decodeShareState(params);
    expect(decoded.delta).toBeUndefined();

    const params2 = new URLSearchParams("dl=0");
    const decoded2 = decodeShareState(params2);
    expect(decoded2.delta).toBeUndefined();
  });

  it("decodes topic=single and topic=comp correctly", () => {
    expect(decodeShareState(new URLSearchParams("topic=single")).topic).toBe("single_query");
    expect(decodeShareState(new URLSearchParams("topic=comp")).topic).toBe("composition");
    expect(decodeShareState(new URLSearchParams("topic=invalid")).topic).toBeUndefined();
  });
});
