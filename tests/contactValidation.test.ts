import { describe, it, expect } from "vitest";
import {
  checkHoneypot,
  checkRateLimit,
  checkTypingDelay,
  validateFields,
  checkLinkSpam,
} from "../src/lib/contactValidation";

/* ---------- checkHoneypot ---------- */
describe("checkHoneypot", () => {
  it("passes when honeypot is empty", () => {
    expect(checkHoneypot("")).toEqual({ ok: true });
  });

  it("rejects when honeypot is filled", () => {
    const r = checkHoneypot("bot-value");
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/honeypot/i);
  });
});

/* ---------- checkRateLimit ---------- */
describe("checkRateLimit", () => {
  it("passes on first submission (lastSubmitTime is null)", () => {
    expect(checkRateLimit(null, Date.now())).toEqual({ ok: true });
  });

  it("rejects when submitting too quickly", () => {
    const now = Date.now();
    const r = checkRateLimit(now - 5_000, now); // 5 s ago, gap = 15 s
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/wait/i);
  });

  it("passes when enough time has elapsed", () => {
    const now = Date.now();
    expect(checkRateLimit(now - 20_000, now)).toEqual({ ok: true });
  });
});

/* ---------- checkTypingDelay ---------- */
describe("checkTypingDelay", () => {
  it("rejects instant submission", () => {
    const now = Date.now();
    const r = checkTypingDelay(now, now);
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/too quickly/i);
  });

  it("passes after sufficient delay", () => {
    const now = Date.now();
    expect(checkTypingDelay(now - 5_000, now)).toEqual({ ok: true });
  });
});

/* ---------- validateFields ---------- */
describe("validateFields", () => {
  const valid = {
    name: "Alice",
    email: "alice@example.com",
    institution: "",
    message: "Hello, I have a question about your platform.",
  };

  it("passes with valid data", () => {
    expect(validateFields(valid)).toEqual({ ok: true });
  });

  it("rejects name shorter than 2 chars", () => {
    const r = validateFields({ ...valid, name: "A" });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/name/i);
  });

  it("rejects name that is only whitespace", () => {
    const r = validateFields({ ...valid, name: "  " });
    expect(r.ok).toBe(false);
  });

  it("rejects email without @", () => {
    const r = validateFields({ ...valid, email: "alice" });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/email/i);
  });

  it("rejects message shorter than 10 chars", () => {
    const r = validateFields({ ...valid, message: "Hi" });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/short/i);
  });
});

/* ---------- checkLinkSpam ---------- */
describe("checkLinkSpam", () => {
  it("passes with no URLs", () => {
    expect(checkLinkSpam("Just a regular message")).toEqual({ ok: true });
  });

  it("passes with 2 URLs (at threshold)", () => {
    expect(checkLinkSpam("Visit http://a.com and http://b.com")).toEqual({
      ok: true,
    });
  });

  it("rejects with more than 2 URLs", () => {
    const r = checkLinkSpam(
      "http://a.com http://b.com http://c.com",
    );
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/links/i);
  });
});
