/**
 * Privacy-preserving session analytics.
 *
 * Tracks only non-identifying usage events:
 *   - mechanism used
 *   - query type
 *   - epsilon range bucket
 *   - simulator interactions (simulate, export, preset)
 *
 * Does NOT collect: user data, datasets, emails, IP addresses.
 *
 * In development (or when no external provider is configured) events are
 * logged to the browser console.
 */

export type AnalyticsEvent =
  | "simulate_query"
  | "export_png"
  | "export_pdf"
  | "preset_used";

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  mechanism?: string;
  queryType?: string;
  epsilonBucket?: string;
  timestamp: number;
}

/** Bucket an epsilon value into a coarse, non-identifying range. */
export function bucketEpsilon(epsilon: number): string {
  if (epsilon <= 0.1) return "0-0.1";
  if (epsilon <= 0.5) return "0.1-0.5";
  if (epsilon <= 1) return "0.5-1";
  if (epsilon <= 5) return "1-5";
  return "5+";
}

/**
 * Record a privacy-preserving analytics event.
 *
 * When no external analytics provider is configured the event is written to
 * `console.debug` in development builds so that it can be inspected during
 * testing without any data leaving the browser.
 */
export function trackEvent(
  event: AnalyticsEvent,
  meta?: { mechanism?: string; queryType?: string; epsilon?: number },
): void {
  const payload: AnalyticsPayload = {
    event,
    mechanism: meta?.mechanism,
    queryType: meta?.queryType,
    epsilonBucket: meta?.epsilon !== undefined ? bucketEpsilon(meta.epsilon) : undefined,
    timestamp: Date.now(),
  };

  // Development / fallback: log to console
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }

  // Placeholder: forward to external provider when available
  // e.g. posthog?.capture(event, payload);
}
