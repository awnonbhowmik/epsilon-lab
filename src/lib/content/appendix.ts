/** Appendix content: mechanisms, formulas, utility metrics. */

export type MechanismDescription = {
  name: string;
  noiseScale: string;
  noiseScaleLatex: string;
  pdfFormula: string;
  pdfFormulaLatex: string;
  privacyGuarantee: string;
  sensitivityType: string;
  notes?: string;
};

export const MECHANISMS: MechanismDescription[] = [
  {
    name: "Laplace Mechanism",
    noiseScale: "b = \u0394f / \u03B5",
    noiseScaleLatex: "b = \\Delta f\\,/\\,\\varepsilon",
    pdfFormula: "p(\u03B7) = (1 / 2b) \u00B7 exp(\u2212|\u03B7| / b)",
    pdfFormulaLatex: "p(\\eta) = \\frac{1}{2b}\\exp\\!\\left(-\\frac{|\\eta|}{b}\\right)",
    privacyGuarantee: "\u03B5-differential privacy (pure DP)",
    sensitivityType: "L1 sensitivity",
  },
  {
    name: "Gaussian Mechanism",
    noiseScale: "\u03C3 = (\u0394f \u00B7 \u221A(2 ln(1.25/\u03B4))) / \u03B5",
    noiseScaleLatex: "\\sigma = \\frac{\\Delta f \\cdot \\sqrt{2\\ln(1.25/\\delta)}}{\\varepsilon}",
    pdfFormula:
      "p(\u03B7) = (1 / (\u03C3\u221A(2\u03C0))) \u00B7 exp(\u2212\u03B7\u00B2 / (2\u03C3\u00B2))",
    pdfFormulaLatex: "p(\\eta) = \\frac{1}{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{\\eta^2}{2\\sigma^2}\\right)",
    privacyGuarantee: "(\u03B5, \u03B4)-differential privacy (approximate DP)",
    sensitivityType: "L2 sensitivity",
    notes:
      "This is a common teaching approximation; not the tightest bound. See Balle and Wang (2018) for the analytic Gaussian mechanism.",
  },
];

export type UtilityMetric = {
  name: string;
  formula: string;
  formulaLatex: string;
  description: string;
};

export const UTILITY_METRICS: UtilityMetric[] = [
  {
    name: "Absolute Error",
    formula: "|M(x) \u2212 f(x)|",
    formulaLatex: "|M(x) - f(x)|",
    description:
      "The absolute difference between the noisy answer and the true answer. For the Laplace mechanism, the expected absolute error equals the scale parameter b.",
  },
  {
    name: "Relative Error (%)",
    formula: "(|M(x) \u2212 f(x)| / |f(x)|) \u00D7 100",
    formulaLatex: "\\frac{|M(x) - f(x)|}{|f(x)|} \\times 100",
    description:
      "The absolute error expressed as a percentage of the true answer. Undefined (reported as 0) when f(x) is approximately zero.",
  },
];

export const UTILITY_BEHAVIOR: string[] = [
  "As \u03B5 increases, the noise scale decreases, and both absolute and relative errors decrease on average.",
  "As \u03B5 approaches zero, the noise dominates and utility degrades significantly.",
  "Deterministic seeding allows exact reproduction of error distributions for a given parameter configuration.",
];
