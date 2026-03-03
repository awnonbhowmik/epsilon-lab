"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Returns a debounced copy of `value`.
 *
 * The returned value only updates after the caller stops changing `value`
 * for at least `delay` milliseconds.  This is useful to avoid triggering
 * expensive recomputation (e.g. the utility-vs-epsilon curve) on every
 * keystroke or slider tick.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delay]);

  return debounced;
}
