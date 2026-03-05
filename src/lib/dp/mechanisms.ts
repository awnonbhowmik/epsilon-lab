/**
 * Pure TypeScript implementations of additional DP mechanisms.
 * Browser-safe — no WASM required.
 */

// ── Helpers ────────────────────────────────────────────────────────────────

/** Draw a sample from Laplace(0, scale) via inverse-CDF. */
function laplaceSample(scale: number): number {
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

// ── Exponential Mechanism ──────────────────────────────────────────────────

export interface Candidate {
  label: string;
  score: number;
}

/**
 * Exponential mechanism — samples a candidate with probability proportional
 * to exp(ε * score / (2 * sensitivity)).
 */
export function exponentialMechanism(
  candidates: Candidate[],
  epsilon: number,
  sensitivity: number,
): string {
  if (candidates.length === 0) throw new Error("candidates must be non-empty");
  const weights = candidates.map((c) =>
    Math.exp((epsilon * c.score) / (2 * sensitivity)),
  );
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i].label;
  }
  return candidates[candidates.length - 1].label;
}

/**
 * Compute selection probabilities for each candidate under the exponential
 * mechanism.
 */
export function exponentialProbabilities(
  candidates: Candidate[],
  epsilon: number,
  sensitivity: number,
): { label: string; score: number; probability: number }[] {
  const weights = candidates.map((c) =>
    Math.exp((epsilon * c.score) / (2 * sensitivity)),
  );
  const total = weights.reduce((a, b) => a + b, 0);
  return candidates.map((c, i) => ({
    label: c.label,
    score: c.score,
    probability: weights[i] / total,
  }));
}

// ── Randomized Response ────────────────────────────────────────────────────

/**
 * Local DP randomized response for a binary (Yes/No) question.
 * p = e^ε / (1 + e^ε) is the probability of answering truthfully.
 */
export function randomizedResponse(
  trueAnswer: boolean,
  epsilon: number,
): boolean {
  const p = Math.exp(epsilon) / (1 + Math.exp(epsilon));
  const flip = Math.random() < p;
  return flip ? trueAnswer : !trueAnswer;
}

/**
 * Bias-corrected population estimate from a randomized-response survey.
 * Given the reported "yes" fraction and epsilon, returns the estimated true
 * fraction.
 */
export function rrEstimate(
  reportedYesFraction: number,
  epsilon: number,
): number {
  const p = Math.exp(epsilon) / (1 + Math.exp(epsilon));
  // p_est = (freq - (1 - p)) / (2p - 1)
  return (reportedYesFraction - (1 - p)) / (2 * p - 1);
}

// ── Report Noisy Max ───────────────────────────────────────────────────────

export interface CountCandidate {
  label: string;
  count: number;
}

/**
 * Report Noisy Max — adds Laplace(0, 1/ε) noise to each count and returns
 * the label with the highest noisy count.
 */
export function reportNoisyMax(
  counts: CountCandidate[],
  epsilon: number,
): string {
  if (counts.length === 0) throw new Error("counts must be non-empty");
  const scale = 1 / epsilon;
  let bestLabel = counts[0].label;
  let bestNoisy = -Infinity;
  for (const c of counts) {
    const noisy = c.count + laplaceSample(scale);
    if (noisy > bestNoisy) {
      bestNoisy = noisy;
      bestLabel = c.label;
    }
  }
  return bestLabel;
}

// ── Discrete Laplace (Geometric Mechanism) ─────────────────────────────────

/**
 * Draw a sample from the Discrete Laplace distribution with parameter
 * α = exp(-ε / sensitivity) via inverse-CDF.
 */
export function discreteLaplaceSample(
  epsilon: number,
  sensitivity: number,
): number {
  const alpha = Math.exp(-epsilon / sensitivity);
  const p = 1 - alpha; // geometric success probability
  // Use geometric distribution: P(X = k) for k = 0, 1, 2, ...
  // Then assign sign randomly to get two-sided distribution.
  const u = Math.random();
  // Inverse CDF of geometric: floor(log(u) / log(1-p))
  const magnitude = Math.floor(Math.log(u) / Math.log(1 - p));
  const sign = Math.random() < 0.5 ? 1 : -1;
  // Special case: magnitude 0 has no sign ambiguity
  return magnitude === 0 ? 0 : sign * magnitude;
}

/**
 * Apply the discrete Laplace mechanism to an integer-valued query.
 */
export function discreteLaplaceQuery(
  trueValue: number,
  epsilon: number,
  sensitivity: number,
): number {
  return trueValue + discreteLaplaceSample(epsilon, sensitivity);
}

/**
 * Theoretical PMF of the Discrete Laplace at integer offset k.
 */
export function discreteLaplacePMF(
  k: number,
  epsilon: number,
  sensitivity: number,
): number {
  const alpha = Math.exp(-epsilon / sensitivity);
  return ((1 - alpha) / (1 + alpha)) * Math.pow(alpha, Math.abs(k));
}

// ── Histogram Mechanism ────────────────────────────────────────────────────

export interface HistogramBin {
  label: string;
  count: number;
}

export interface NoisyHistogramBin {
  label: string;
  trueCount: number;
  noisyCount: number;
}

/**
 * Histogram mechanism — adds independent Laplace(0, 1/ε) noise to each bin.
 * Uses parallel composition: all bins can share the same ε budget.
 */
export function histogramMechanism(
  bins: HistogramBin[],
  epsilon: number,
  clipNegative = false,
): NoisyHistogramBin[] {
  const scale = 1 / epsilon;
  return bins.map((b) => {
    const noisy = b.count + laplaceSample(scale);
    return {
      label: b.label,
      trueCount: b.count,
      noisyCount: clipNegative ? Math.max(0, noisy) : noisy,
    };
  });
}
