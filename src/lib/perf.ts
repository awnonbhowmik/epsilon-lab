/**
 * Performance utilities for heavy simulation workloads.
 *
 * - `batchSimulate`: splits large run-counts across `requestAnimationFrame`
 *   ticks so that the browser main thread stays responsive.
 * - `memoizedCompute`: simple memoisation wrapper for chart data that avoids
 *   recomputing when inputs haven't changed.
 */

/**
 * Yield control back to the browser between chunks of synchronous work.
 * Uses `requestAnimationFrame` for the best scheduling behaviour.
 */
export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Simple string-key memo cache for chart computation.
 *
 * Caches the last N results keyed by a caller-provided string.  When the key
 * matches a previous entry the cached value is returned immediately.
 */
export function createMemoCache<T>(maxSize = 16) {
  const cache = new Map<string, T>();

  return {
    get(key: string): T | undefined {
      return cache.get(key);
    },
    set(key: string, value: T): void {
      if (cache.size >= maxSize) {
        // Evict oldest entry
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    clear(): void {
      cache.clear();
    },
  };
}
