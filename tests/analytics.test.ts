import { describe, it, expect } from "vitest";
import {
  bucketEpsilon,
  trackEvent,
} from "../src/lib/analytics";

describe("analytics", () => {
  it("buckets epsilon values correctly", () => {
    expect(bucketEpsilon(0.05)).toBe("0-0.1");
    expect(bucketEpsilon(0.1)).toBe("0-0.1");
    expect(bucketEpsilon(0.3)).toBe("0.1-0.5");
    expect(bucketEpsilon(0.5)).toBe("0.1-0.5");
    expect(bucketEpsilon(0.8)).toBe("0.5-1");
    expect(bucketEpsilon(1.0)).toBe("0.5-1");
    expect(bucketEpsilon(3.0)).toBe("1-5");
    expect(bucketEpsilon(5.0)).toBe("1-5");
    expect(bucketEpsilon(7.0)).toBe("5+");
  });

  it("trackEvent does not throw", () => {
    expect(() =>
      trackEvent("simulate_query", { mechanism: "laplace", epsilon: 1.0 }),
    ).not.toThrow();
    expect(() => trackEvent("export_png")).not.toThrow();
    expect(() => trackEvent("export_pdf")).not.toThrow();
    expect(() => trackEvent("preset_used", { queryType: "sum" })).not.toThrow();
  });
});
