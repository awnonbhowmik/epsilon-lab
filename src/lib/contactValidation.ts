/** Lightweight client-side spam protection helpers for the contact form. */

export interface ContactFormData {
  name: string;
  email: string;
  institution: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  /** User-facing message (only set when ok === false). */
  reason?: string;
}

/** Honeypot field was filled → likely a bot. */
export function checkHoneypot(value: string): ValidationResult {
  if (value) {
    return { ok: false, reason: "Spam detected via honeypot" };
  }
  return { ok: true };
}

/**
 * Rate-limit: reject if fewer than `minGapMs` milliseconds elapsed since the
 * last successful submission.
 */
export function checkRateLimit(
  lastSubmitTime: number | null,
  now: number,
  minGapMs = 15_000,
): ValidationResult {
  if (lastSubmitTime && now - lastSubmitTime < minGapMs) {
    return { ok: false, reason: "Please wait before sending another message." };
  }
  return { ok: true };
}

/**
 * Minimum typing delay: reject forms submitted faster than `minDelayMs`
 * milliseconds after the page loaded.
 */
export function checkTypingDelay(
  formStartTime: number,
  now: number,
  minDelayMs = 3_000,
): ValidationResult {
  if (now - formStartTime < minDelayMs) {
    return { ok: false, reason: "Bot detected: form submitted too quickly" };
  }
  return { ok: true };
}

/** Validate all required fields. */
export function validateFields(data: ContactFormData): ValidationResult {
  if (data.name.trim().length < 2) {
    return { ok: false, reason: "Please enter your name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, reason: "Please enter a valid email." };
  }

  if (data.message.trim().length < 10) {
    return { ok: false, reason: "Message is too short." };
  }

  return { ok: true };
}

/** Reject messages containing more than `maxUrls` URLs. */
export function checkLinkSpam(
  message: string,
  maxUrls = 2,
): ValidationResult {
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > maxUrls) {
    return { ok: false, reason: "Spam detected: too many links" };
  }
  return { ok: true };
}
