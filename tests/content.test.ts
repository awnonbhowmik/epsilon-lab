import { describe, it, expect } from "vitest";
import { CORE_REFERENCES, ADVANCED_REFERENCES } from "../src/lib/content/references";
import { NOTATION, DEFINITIONS } from "../src/lib/content/glossary";
import { MECHANISMS, UTILITY_METRICS, UTILITY_BEHAVIOR } from "../src/lib/content/appendix";
import { METHODOLOGY_SECTIONS, FUTURE_WORK } from "../src/lib/content/methodology";
import { APP_NAME, APP_VERSION, APP_FULL_TITLE, APP_AUTHOR } from "../src/lib/version";

describe("version", () => {
  it("exports required constants", () => {
    expect(APP_NAME).toBe("EpsilonLab");
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(APP_FULL_TITLE).toBeTruthy();
    expect(APP_AUTHOR).toBeTruthy();
  });
});

describe("references", () => {
  it("has at least 3 core references", () => {
    expect(CORE_REFERENCES.length).toBeGreaterThanOrEqual(3);
  });

  it("includes Dwork 2006 foundational paper", () => {
    const dwork2006 = CORE_REFERENCES.find((r) => r.id === "dwork2006");
    expect(dwork2006).toBeDefined();
    expect(dwork2006!.apa).toContain("Dwork");
    expect(dwork2006!.apa).toContain("2006");
  });

  it("includes Dwork & Roth 2014 book", () => {
    const dwork2014 = CORE_REFERENCES.find((r) => r.id === "dwork2014");
    expect(dwork2014).toBeDefined();
    expect(dwork2014!.apa).toContain("Roth");
  });

  it("includes a Gaussian mechanism reference", () => {
    const gaussian = CORE_REFERENCES.find(
      (r) => r.apa.toLowerCase().includes("gaussian") || r.notes?.toLowerCase().includes("gaussian")
    );
    expect(gaussian).toBeDefined();
  });

  it("each reference has a unique id and non-empty apa string", () => {
    const ids = new Set<string>();
    for (const ref of [...CORE_REFERENCES, ...ADVANCED_REFERENCES]) {
      expect(ref.id).toBeTruthy();
      expect(ref.apa).toBeTruthy();
      expect(ids.has(ref.id)).toBe(false);
      ids.add(ref.id);
    }
  });
});

describe("glossary", () => {
  it("has notation entries for key symbols", () => {
    const symbols = NOTATION.map((n) => n.symbol);
    expect(symbols).toContain("\u03B5");
    expect(symbols).toContain("\u03B4");
    expect(symbols).toContain("\u0394f");
    expect(symbols).toContain("b");
    expect(symbols).toContain("\u03C3");
  });

  it("has definitions for pure and approximate DP", () => {
    const titles = DEFINITIONS.map((d) => d.title);
    expect(titles.some((t) => t.includes("Pure DP") || t.includes("\u03B5-Differential"))).toBe(true);
    expect(titles.some((t) => t.includes("Approximate DP") || t.includes("\u03B4"))).toBe(true);
  });
});

describe("appendix", () => {
  it("describes both Laplace and Gaussian mechanisms", () => {
    const names = MECHANISMS.map((m) => m.name);
    expect(names).toContain("Laplace Mechanism");
    expect(names).toContain("Gaussian Mechanism");
  });

  it("Gaussian mechanism includes a teaching approximation note", () => {
    const gaussian = MECHANISMS.find((m) => m.name === "Gaussian Mechanism");
    expect(gaussian?.notes).toContain("teaching approximation");
  });

  it("has utility metrics", () => {
    expect(UTILITY_METRICS.length).toBeGreaterThanOrEqual(2);
    expect(UTILITY_BEHAVIOR.length).toBeGreaterThan(0);
  });
});

describe("methodology", () => {
  it("covers simulation, reproducibility, limitations, and interpretation", () => {
    const headings = METHODOLOGY_SECTIONS.map((s) => s.heading);
    expect(headings).toContain("What Is Simulated");
    expect(headings).toContain("Deterministic Seeding and Reproducibility");
    expect(headings).toContain("Limitations");
    expect(headings).toContain("How to Interpret Results");
    expect(headings).toContain("What This Tool Does Not Claim");
  });

  it("has future work items", () => {
    expect(FUTURE_WORK.length).toBeGreaterThanOrEqual(3);
    expect(FUTURE_WORK.some((f) => f.toLowerCase().includes("rdp"))).toBe(true);
  });
});
