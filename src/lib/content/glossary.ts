/** Glossary of notation and terminology used in the application. */

export type GlossaryEntry = {
  symbol: string;
  name: string;
  definition: string;
};

export const NOTATION: GlossaryEntry[] = [
  {
    symbol: "\u03B5",
    name: "Epsilon (privacy budget)",
    definition:
      "A non-negative real number controlling the strength of the privacy guarantee. Smaller values provide stronger privacy but require more noise.",
  },
  {
    symbol: "\u03B4",
    name: "Delta (failure probability)",
    definition:
      "A small probability (typically much less than 1/n) bounding the chance that the pure \u03B5-DP guarantee fails. Used in approximate (\u03B5, \u03B4)-DP.",
  },
  {
    symbol: "\u0394f",
    name: "Sensitivity",
    definition:
      "The maximum change in the query output when a single individual's data is added or removed. L1 sensitivity is used for the Laplace mechanism; L2 sensitivity for the Gaussian mechanism.",
  },
  {
    symbol: "b",
    name: "Laplace scale parameter",
    definition:
      "The scale of the Laplace distribution used for noise addition: b = \u0394f / \u03B5.",
  },
  {
    symbol: "\u03C3",
    name: "Gaussian standard deviation",
    definition:
      "The standard deviation of the Gaussian noise: \u03C3 = \u0394f \u00B7 \u221A(2 ln(1.25/\u03B4)) / \u03B5.",
  },
  {
    symbol: "f(x)",
    name: "Query function",
    definition:
      "A deterministic function mapping a dataset x to a real-valued answer (e.g., sum, mean, count).",
  },
  {
    symbol: "x, x\u2032",
    name: "Adjacent datasets",
    definition:
      "Two datasets differing in at most one individual's record. The precise notion of adjacency (add/remove or substitute) must be specified.",
  },
];

export const DEFINITIONS: { title: string; body: string }[] = [
  {
    title: "\u03B5-Differential Privacy (Pure DP)",
    body: "A randomized mechanism M satisfies \u03B5-differential privacy if for all adjacent datasets x, x\u2032 and for all measurable sets S of outputs: Pr[M(x) \u2208 S] \u2264 e^\u03B5 \u00B7 Pr[M(x\u2032) \u2208 S].",
  },
  {
    title: "(\u03B5, \u03B4)-Differential Privacy (Approximate DP)",
    body: "A randomized mechanism M satisfies (\u03B5, \u03B4)-differential privacy if for all adjacent datasets x, x\u2032 and for all measurable sets S: Pr[M(x) \u2208 S] \u2264 e^\u03B5 \u00B7 Pr[M(x\u2032) \u2208 S] + \u03B4.",
  },
  {
    title: "Sensitivity (L1)",
    body: "For a function f: X \u2192 R^d, the L1 sensitivity is \u0394f = max_{adjacent x, x\u2032} ||f(x) \u2212 f(x\u2032)||_1. Used to calibrate the Laplace mechanism.",
  },
  {
    title: "Sensitivity (L2)",
    body: "For a function f: X \u2192 R^d, the L2 sensitivity is \u0394f = max_{adjacent x, x\u2032} ||f(x) \u2212 f(x\u2032)||_2. Used to calibrate the Gaussian mechanism.",
  },
];
