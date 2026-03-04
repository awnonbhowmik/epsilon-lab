/**
 * Feature-flag system for free vs licensed capabilities.
 *
 * Licence tiers:
 *   free        – simulator, presets, charts
 *   instructor  – classroom pack export, lesson plan, preset library management
 *   institution – privacy accountant, advanced composition tools, department access
 *
 * The current licence is derived from a `?license=` query-string parameter.
 * In a future version this can be replaced by real authentication / JWT tokens.
 */

export type LicenseTier = "free" | "instructor" | "institution";

export type Feature =
  | "simulator"
  | "presets"
  | "charts"
  | "classroom_pack_export"
  | "lesson_plan"
  | "preset_library_management"
  | "privacy_accountant"
  | "advanced_composition"
  | "department_access"
  | "instructor_dashboard";

const freeFeatures: Feature[] = ["simulator", "presets", "charts"];

const instructorFeatures: Feature[] = [
  ...freeFeatures,
  "classroom_pack_export",
  "lesson_plan",
  "preset_library_management",
  "instructor_dashboard",
];

const institutionFeatures: Feature[] = [
  ...instructorFeatures,
  "privacy_accountant",
  "advanced_composition",
  "department_access",
];

const tierFeatureMap: Record<LicenseTier, Feature[]> = {
  free: freeFeatures,
  instructor: instructorFeatures,
  institution: institutionFeatures,
};

/** Return the set of features available for a given tier. */
export function featuresForTier(tier: LicenseTier): Feature[] {
  return tierFeatureMap[tier];
}

/** Check whether a specific feature is enabled for the given tier. */
export function isFeatureEnabled(tier: LicenseTier, feature: Feature): boolean {
  return tierFeatureMap[tier].includes(feature);
}

/**
 * Parse the licence tier from a URL search-params string.
 *
 * Accepts `?license=instructor` or `?license=institution`.
 * Falls back to `"free"` for any other value.
 */
export function parseLicenseTier(
  params: URLSearchParams | { get(key: string): string | null },
): LicenseTier {
  const raw = params.get("license");
  if (raw === "instructor" || raw === "institution") return raw;
  return "free";
}
