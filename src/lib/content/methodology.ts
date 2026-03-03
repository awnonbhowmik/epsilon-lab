/** Methodology, assumptions, and limitations content. */

export type MethodologySection = {
  heading: string;
  paragraphs: string[];
};

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    heading: "What Is Simulated",
    paragraphs: [
      "EpsilonLab performs Monte Carlo simulation of differentially private query answering. For each run, the tool computes the true query answer f(x) on the chosen dataset, samples noise from the configured mechanism (Laplace or Gaussian), and returns the noisy answer M(x) = f(x) + noise. Statistics (mean absolute error, relative error, distribution) are computed over the specified number of runs.",
      "The simulation is executed entirely client-side via a WebAssembly (WASM) engine compiled from Rust. No data leaves the user's browser.",
    ],
  },
  {
    heading: "Deterministic Seeding and Reproducibility",
    paragraphs: [
      "When a seed value is provided, the WASM engine initializes its pseudorandom number generator (PRNG) deterministically. This ensures that identical parameters and seed produce identical noisy outputs across runs and sessions.",
      "When no seed is provided, the engine uses a cryptographically secure random seed, and results will differ between runs.",
    ],
  },
  {
    heading: "Numerical Precision",
    paragraphs: [
      "All computations use IEEE 754 double-precision floating-point arithmetic (64-bit). This introduces small rounding errors that are negligible for teaching purposes but may not satisfy requirements for production privacy deployments where exact arithmetic or higher precision is needed.",
    ],
  },
  {
    heading: "What This Tool Does Not Claim",
    paragraphs: [
      "EpsilonLab is designed for building intuition about differential privacy concepts. It is not a compliance tool and should not be used to certify that a real-world data release satisfies differential privacy.",
      "The tool does not constitute a formal proof of differential privacy for any system. Users seeking to deploy DP in practice should consult the primary literature, use vetted libraries (e.g., OpenDP, Google's DP library), and engage domain experts.",
    ],
  },
  {
    heading: "Limitations",
    paragraphs: [
      "Composition: Only basic sequential composition (linear summation of privacy parameters) is implemented. Advanced composition theorems provide tighter bounds but are not yet available in the simulator.",
      "Gaussian mechanism: The sigma formula used is sigma = (Delta_f * sqrt(2 * ln(1.25 / delta))) / epsilon. This is a common teaching approximation from Dwork and Roth (2014, Theorem A.1). It is not the tightest known bound; see Balle and Wang (2018) for the analytic Gaussian mechanism.",
      "Dataset adjacency: The tool models sensitivity as a user-supplied parameter. It does not verify that the stated sensitivity is correct for a given dataset and query, nor does it model add/remove vs. substitute adjacency relations.",
      "No privacy accountant: The tool does not implement Renyi Differential Privacy (RDP) or moments accountant methods for tighter multi-query privacy tracking.",
    ],
  },
  {
    heading: "How to Interpret Results",
    paragraphs: [
      "The noise PDF chart shows the theoretical probability density of the noise distribution. Wider distributions indicate more noise (stronger privacy, lower utility).",
      "The noisy results histogram shows the empirical distribution of M(x) across simulation runs. It should concentrate around f(x) as epsilon increases.",
      "The utility vs. epsilon chart illustrates how expected error decreases as the privacy budget grows. This demonstrates the fundamental privacy-utility tradeoff.",
      "Error metrics (absolute and relative) quantify accuracy loss. Lower epsilon values produce larger errors, reflecting the cost of stronger privacy.",
    ],
  },
];

export const FUTURE_WORK: string[] = [
  "Renyi Differential Privacy (RDP) accounting for tighter multi-query composition",
  "Analytic Gaussian mechanism (Balle and Wang, 2018) for optimal noise calibration",
  "Subsampling amplification (privacy amplification by subsampling)",
  "Local differential privacy (LDP) modules for distributed data collection scenarios",
];
