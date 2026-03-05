import { describe, it, expect } from "vitest";
import { APP_NAME, APP_VERSION, BUILD_DATE, GIT_COMMIT } from "../src/lib/version";
import { getEnvironment, isDev, isProduction } from "../src/lib/env";
import { logInfo, logWarn, logError } from "../src/lib/logger";

describe("version", () => {
  it("exports APP_VERSION as 1.0.0", () => {
    expect(APP_VERSION).toBe("1.0.0");
  });

  it("exports BUILD_DATE as a valid date string", () => {
    expect(BUILD_DATE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("exports APP_NAME", () => {
    expect(APP_NAME).toBe("EpsilonLab");
  });

  it("exports GIT_COMMIT as a string", () => {
    expect(typeof GIT_COMMIT).toBe("string");
    expect(GIT_COMMIT.length).toBeGreaterThan(0);
  });
});

describe("env", () => {
  it("getEnvironment returns a valid environment", () => {
    const env = getEnvironment();
    expect(["development", "preview", "production"]).toContain(env);
  });

  it("isDev and isProduction are mutually exclusive in test env", () => {
    // In vitest NODE_ENV is "test" so getEnvironment() → "development"
    expect(isDev()).toBe(true);
    expect(isProduction()).toBe(false);
  });
});

describe("logger", () => {
  it("logInfo does not throw", () => {
    expect(() => logInfo("test info")).not.toThrow();
  });

  it("logWarn does not throw", () => {
    expect(() => logWarn("test warn")).not.toThrow();
  });

  it("logError does not throw", () => {
    expect(() => logError("test error")).not.toThrow();
  });
});
