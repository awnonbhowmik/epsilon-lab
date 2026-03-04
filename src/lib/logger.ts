/**
 * Production logging helper.
 *
 * Development: full console output.
 * Production: minimal structured messages.
 */

import { isProduction } from "./env";

function timestamp(): string {
  return new Date().toISOString();
}

export function logInfo(message: string, data?: unknown): void {
  if (isProduction()) {
    console.log(JSON.stringify({ level: "info", message, ...(data !== undefined && { data }), ts: timestamp() }));
  } else {
    console.log(`[INFO] ${message}`, data ?? "");
  }
}

export function logWarn(message: string, data?: unknown): void {
  if (isProduction()) {
    console.warn(JSON.stringify({ level: "warn", message, ...(data !== undefined && { data }), ts: timestamp() }));
  } else {
    console.warn(`[WARN] ${message}`, data ?? "");
  }
}

export function logError(message: string, data?: unknown): void {
  if (isProduction()) {
    console.error(
      JSON.stringify({ level: "error", message, ...(data !== undefined && { data }), ts: timestamp() }),
    );
  } else {
    console.error(`[ERROR] ${message}`, data ?? "");
  }
}
