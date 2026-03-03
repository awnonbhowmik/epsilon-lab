import { describe, it, expect } from "vitest";
import { mapSimResponse } from "../src/lib/dp/utils";

describe("mapSimResponse", () => {
  const baseSummary = { mean: 1, stddev: 0.5, min: 0, max: 2, median: 1 };

  function makeRaw(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      trueValue: 10,
      scale: 2.5,
      noisyValues: [10.1, 9.9],
      absErrors: [0.1, 0.1],
      relErrorsPct: [1, 1],
      noisySummary: { ...baseSummary },
      absErrorSummary: { ...baseSummary },
      mechanism: "laplace",
      ...overrides,
    };
  }

  it("maps a valid Laplace response", () => {
    const result = mapSimResponse(makeRaw());
    expect(result.mechanism).toBe("laplace");
    expect(result.trueValue).toBe(10);
    expect(result.scale).toBe(2.5);
    expect(result.sigma).toBeUndefined();
    expect(result.delta).toBeUndefined();
    expect(result.noisyValues).toEqual([10.1, 9.9]);
  });

  it("maps a valid Gaussian response with sigma and delta", () => {
    const result = mapSimResponse(makeRaw({
      mechanism: "gaussian",
      sigma: 4.84,
      delta: 1e-5,
    }));
    expect(result.mechanism).toBe("gaussian");
    expect(result.sigma).toBe(4.84);
    expect(result.delta).toBe(1e-5);
  });

  it("throws on null input", () => {
    expect(() => mapSimResponse(null as any)).toThrow("non-object");
  });

  it("throws on missing trueValue", () => {
    const raw = makeRaw();
    delete raw.trueValue;
    expect(() => mapSimResponse(raw)).toThrow("trueValue");
  });

  it("throws on non-finite scale", () => {
    expect(() => mapSimResponse(makeRaw({ scale: NaN }))).toThrow("scale");
    expect(() => mapSimResponse(makeRaw({ scale: Infinity }))).toThrow("scale");
  });

  it("defaults mechanism to laplace when not present", () => {
    const raw = makeRaw();
    delete raw.mechanism;
    const result = mapSimResponse(raw);
    expect(result.mechanism).toBe("laplace");
  });
});
