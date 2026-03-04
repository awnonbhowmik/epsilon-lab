import { describe, it, expect } from "vitest";
import {
  featuresForTier,
  isFeatureEnabled,
  parseLicenseTier,
} from "../src/lib/license/featureFlags";

describe("featureFlags", () => {
  it("free tier includes simulator, presets, charts", () => {
    const features = featuresForTier("free");
    expect(features).toContain("simulator");
    expect(features).toContain("presets");
    expect(features).toContain("charts");
  });

  it("free tier does NOT include instructor features", () => {
    expect(isFeatureEnabled("free", "classroom_pack_export")).toBe(false);
    expect(isFeatureEnabled("free", "lesson_plan")).toBe(false);
    expect(isFeatureEnabled("free", "instructor_dashboard")).toBe(false);
  });

  it("instructor tier includes all free features + instructor features", () => {
    expect(isFeatureEnabled("instructor", "simulator")).toBe(true);
    expect(isFeatureEnabled("instructor", "classroom_pack_export")).toBe(true);
    expect(isFeatureEnabled("instructor", "lesson_plan")).toBe(true);
    expect(isFeatureEnabled("instructor", "instructor_dashboard")).toBe(true);
  });

  it("instructor tier does NOT include institution features", () => {
    expect(isFeatureEnabled("instructor", "privacy_accountant")).toBe(false);
    expect(isFeatureEnabled("instructor", "advanced_composition")).toBe(false);
    expect(isFeatureEnabled("instructor", "department_access")).toBe(false);
  });

  it("institution tier includes all features", () => {
    expect(isFeatureEnabled("institution", "simulator")).toBe(true);
    expect(isFeatureEnabled("institution", "classroom_pack_export")).toBe(true);
    expect(isFeatureEnabled("institution", "privacy_accountant")).toBe(true);
    expect(isFeatureEnabled("institution", "advanced_composition")).toBe(true);
    expect(isFeatureEnabled("institution", "department_access")).toBe(true);
  });

  it("parseLicenseTier returns 'free' by default", () => {
    const params = new URLSearchParams("");
    expect(parseLicenseTier(params)).toBe("free");
  });

  it("parseLicenseTier parses 'instructor'", () => {
    const params = new URLSearchParams("license=instructor");
    expect(parseLicenseTier(params)).toBe("instructor");
  });

  it("parseLicenseTier parses 'institution'", () => {
    const params = new URLSearchParams("license=institution");
    expect(parseLicenseTier(params)).toBe("institution");
  });

  it("parseLicenseTier returns 'free' for unknown values", () => {
    const params = new URLSearchParams("license=unknown");
    expect(parseLicenseTier(params)).toBe("free");
  });
});
