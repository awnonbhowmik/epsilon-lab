/** Deployment environment detection. */

export type Environment = "development" | "preview" | "production";

export function getEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENV;
  if (explicit === "preview") return "preview";
  if (explicit === "production") return "production";
  if (explicit === "development") return "development";
  if (process.env.NODE_ENV === "production") return "production";
  return "development";
}

export function isDev(): boolean {
  return getEnvironment() === "development";
}

export function isProduction(): boolean {
  return getEnvironment() === "production";
}
