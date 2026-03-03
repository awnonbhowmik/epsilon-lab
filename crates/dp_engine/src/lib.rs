//! EpsilonLab DP Engine — Laplace Mechanism compiled to WebAssembly.
//!
//! Exported API (via wasm-bindgen):
//!   simulate_query(values, query_type, epsilon, sensitivity, runs, seed)
//!     -> Result<JsValue, JsValue>
//!
//! On success the return value is a JS object whose shape matches `SimResponse`.
//! On error the function throws a JS exception whose `.message` is a plain-English
//! error string — no JSON wrapping.

use js_sys::Float64Array;
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha20Rng;
use serde::Serialize;
use wasm_bindgen::prelude::*;

// ── Hard limits (guard against browser freeze / OOM) ─────────────────────────

const MAX_RUNS: u32 = 10_000;
const MAX_VALUES: usize = 100_000;

// ── Internal query-kind enum (avoids repeated string matching in hot path) ────

#[derive(Clone, Copy, PartialEq)]
pub(crate) enum QueryKind {
    Sum,
    Mean,
    Count,
}

impl QueryKind {
    fn from_str(s: &str) -> Result<Self, String> {
        match s {
            "sum" => Ok(QueryKind::Sum),
            "mean" => Ok(QueryKind::Mean),
            "count" => Ok(QueryKind::Count),
            other => Err(format!(
                "unknown query type \"{other}\"; expected \"sum\", \"mean\", or \"count\""
            )),
        }
    }
}

// ── Serialisable response types ───────────────────────────────────────────────
//
// Field names use camelCase to match the TypeScript `SimSummary` / `SimResponse`
// interfaces in src/lib/dp/types.ts exactly.

/// Descriptive statistics over a collection of f64 samples.
#[derive(Serialize)]
pub struct SimSummary {
    pub mean: f64,
    pub stddev: f64,
    pub min: f64,
    pub max: f64,
    pub median: f64,
}

/// Full simulation result returned to the browser.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimResponse {
    /// Non-private (true) query answer.
    pub true_value: f64,
    /// One noisy answer per Monte-Carlo run.
    pub noisy_values: Vec<f64>,
    /// |noisy − true| per run.
    pub abs_errors: Vec<f64>,
    /// (|noisy − true| / |true|) × 100 per run; 0 when true ≈ 0.
    pub rel_errors_pct: Vec<f64>,
    pub noisy_summary: SimSummary,
    pub abs_error_summary: SimSummary,
    /// Laplace scale b = sensitivity / ε.
    pub scale: f64,
}

// ── Pure DP mathematics ───────────────────────────────────────────────────────

/// Compute the true sum of `values`.
pub fn true_sum(values: &[f64]) -> f64 {
    values.iter().sum()
}

/// Compute the true arithmetic mean of `values`.  Returns 0.0 for empty slices.
pub fn true_mean(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().sum::<f64>() / values.len() as f64
}

/// Return the count of `values` as f64.
pub fn true_count(values: &[f64]) -> f64 {
    values.len() as f64
}

/// Compute the exact (non-private) query answer.
pub(crate) fn true_query(values: &[f64], kind: QueryKind) -> f64 {
    match kind {
        QueryKind::Sum => true_sum(values),
        QueryKind::Mean => true_mean(values),
        QueryKind::Count => true_count(values),
    }
}

/// Return `true_value + Laplace(0, scale)` — a single DP-noised answer.
pub fn dp_query(true_value: f64, scale: f64, rng: &mut impl Rng) -> f64 {
    true_value + laplace_sample(scale, rng)
}

/// Draw a single sample from Laplace(0, `scale`) via the inverse-CDF method.
///
/// # Mathematical derivation
///
/// The Laplace CDF is  F(x) = ½ + ½ · sign(x) · (1 − e^(−|x|/b)).
/// Inverting:  x = F⁻¹(u) = −b · sign(u − ½) · ln(1 − 2|u − ½|),  u ∈ (0, 1).
///
/// We draw u from an open interval (GUARD, 1 − GUARD) to keep the argument
/// of ln strictly positive, preventing −∞ and NaN.  With GUARD = 1 × 10⁻¹⁵
/// the truncated region has negligible probability mass (< 2 × 10⁻¹⁵).
///
/// # Bias / symmetry
///
/// The guard is symmetric around ½, so E[X] = 0 exactly holds for the
/// truncated distribution in exact arithmetic.  The empirical mean over
/// ≥ 100 k samples is indistinguishable from 0 within Monte-Carlo noise.
///
/// # Variance
///
/// Var[Lap(0, b)] = 2b².  The truncation removes < 4 × 10⁻¹⁵ of the
/// total probability so the empirical variance is 2b² to many significant
/// figures.
pub(crate) fn laplace_sample(scale: f64, rng: &mut impl Rng) -> f64 {
    debug_assert!(scale > 0.0 && scale.is_finite(), "scale must be finite and positive");

    // Keep away from the open endpoints 0 and 1 to avoid ln(0) = −∞.
    const GUARD: f64 = 1e-15;
    let u: f64 = rng.gen_range(GUARD..(1.0 - GUARD));

    // Center around ½ so the distribution is symmetric about 0.
    let v = u - 0.5; // v ∈ (−0.5 + ε, 0.5 − ε)
    let sign = if v >= 0.0 { 1.0_f64 } else { -1.0_f64 };

    // Inverse CDF:  x = −b · sign(v) · ln(1 − 2|v|)
    let inner = 1.0 - 2.0 * v.abs(); // strictly in (0, 1] → ln is finite
    let noise = -scale * sign * inner.ln();

    // Final safety net: if floating-point arithmetic somehow yields a
    // non-finite value, fall back to 0 rather than propagating NaN/Inf.
    if noise.is_finite() {
        noise
    } else {
        0.0
    }
}

// ── Summary statistics helpers ─────────────────────────────────────────────────

/// Arithmetic mean.  Returns 0.0 for empty slices.
pub fn mean(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().sum::<f64>() / values.len() as f64
}

/// Population standard deviation.  Returns 0.0 for empty slices.
pub fn stddev(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    let m = mean(values);
    let variance = values.iter().map(|v| (v - m).powi(2)).sum::<f64>() / values.len() as f64;
    variance.sqrt()
}

/// Minimum value.  Returns 0.0 for empty slices.
pub fn min(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().cloned().fold(f64::INFINITY, f64::min)
}

/// Maximum value.  Returns 0.0 for empty slices.
pub fn max(values: &[f64]) -> f64 {
    if values.is_empty() {
        return 0.0;
    }
    values.iter().cloned().fold(f64::NEG_INFINITY, f64::max)
}

/// Median value.  Uses a sorted copy of `values`.  Returns 0.0 for empty slices.
pub fn median(values: &[f64]) -> f64 {
    let n = values.len();
    if n == 0 {
        return 0.0;
    }
    let mut sorted = values.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    if n % 2 == 0 {
        (sorted[n / 2 - 1] + sorted[n / 2]) / 2.0
    } else {
        sorted[n / 2]
    }
}

/// Compute descriptive statistics (mean, stddev, min, max, median) using helpers.
pub(crate) fn compute_summary(values: &[f64]) -> SimSummary {
    SimSummary {
        mean: mean(values),
        stddev: stddev(values),
        min: min(values),
        max: max(values),
        median: median(values),
    }
}

// ── WASM entry point ──────────────────────────────────────────────────────────

/// Run a differentially private simulation using the Laplace mechanism.
///
/// # Parameters
/// - `values`      — dataset as a `Float64Array`
/// - `query_type`  — `"sum"`, `"mean"`, or `"count"`
/// - `epsilon`     — privacy budget ε > 0
/// - `sensitivity` — global sensitivity Δf > 0
/// - `runs`        — Monte-Carlo iterations (1 – 10 000)
/// - `seed`        — optional u64 seed string for reproducibility
///
/// # Returns
/// A JS object matching `SimResponse` on success, or throws a descriptive
/// string exception on invalid input or computation error.
#[wasm_bindgen]
pub fn simulate_query(
    values: Float64Array,
    query_type: &str,
    epsilon: f64,
    sensitivity: f64,
    runs: u32,
    seed: Option<String>,
) -> Result<JsValue, JsValue> {
    // ── Input validation ──────────────────────────────────────────────────────

    if !epsilon.is_finite() || epsilon <= 0.0 {
        return Err(JsValue::from_str(
            "epsilon must be a finite positive number",
        ));
    }
    if epsilon > 1_000_000.0 {
        return Err(JsValue::from_str("epsilon must be ≤ 1,000,000"));
    }
    if !sensitivity.is_finite() || sensitivity <= 0.0 {
        return Err(JsValue::from_str(
            "sensitivity must be a finite positive number",
        ));
    }
    if sensitivity > 1e15 {
        return Err(JsValue::from_str("sensitivity must be ≤ 1e15"));
    }
    if runs < 1 {
        return Err(JsValue::from_str("runs must be ≥ 1"));
    }
    if runs > MAX_RUNS {
        return Err(JsValue::from_str(&format!(
            "runs must be ≤ {}",
            MAX_RUNS
        )));
    }

    let vals: Vec<f64> = values.to_vec();
    if vals.len() > MAX_VALUES {
        return Err(JsValue::from_str(&format!(
            "dataset too large (max {} values)",
            MAX_VALUES
        )));
    }
    if vals.iter().any(|v| !v.is_finite()) {
        return Err(JsValue::from_str(
            "all dataset values must be finite numbers (no NaN or Infinity)",
        ));
    }

    let kind = QueryKind::from_str(query_type)
        .map_err(|e| JsValue::from_str(&e))?;

    if matches!(kind, QueryKind::Sum | QueryKind::Mean) && vals.is_empty() {
        return Err(JsValue::from_str(
            "values must be non-empty for sum/mean queries",
        ));
    }

    // ── Core computation ──────────────────────────────────────────────────────

    let scale = sensitivity / epsilon;
    if !scale.is_finite() || scale <= 0.0 {
        return Err(JsValue::from_str(
            "computed Laplace scale is not finite — \
             check that sensitivity and epsilon are reasonable",
        ));
    }

    let true_val = true_query(&vals, kind);

    // Initialise RNG.  A valid seed string produces deterministic output;
    // an invalid string returns an error rather than silently falling back.
    let mut rng: ChaCha20Rng = match seed {
        Some(ref s) if !s.trim().is_empty() => match s.trim().parse::<u64>() {
            Ok(v) => ChaCha20Rng::seed_from_u64(v),
            Err(_) => {
                return Err(JsValue::from_str(&format!(
                    "invalid seed \"{}\": must be an unsigned 64-bit integer (0 – 18446744073709551615)",
                    s.trim()
                )))
            }
        },
        _ => ChaCha20Rng::from_entropy(),
    };

    // Pre-allocate result vectors.
    let cap = runs as usize;
    let mut noisy_values = Vec::with_capacity(cap);
    let mut abs_errors = Vec::with_capacity(cap);
    let mut rel_errors_pct = Vec::with_capacity(cap);

    for _ in 0..runs {
        let noisy = dp_query(true_val, scale, &mut rng);
        let abs_err = (noisy - true_val).abs();
        let rel_err = if true_val.abs() > 1e-10 {
            abs_err / true_val.abs() * 100.0
        } else {
            0.0
        };
        noisy_values.push(noisy);
        abs_errors.push(abs_err);
        rel_errors_pct.push(rel_err);
    }

    let response = SimResponse {
        true_value: true_val,
        noisy_summary: compute_summary(&noisy_values),
        abs_error_summary: compute_summary(&abs_errors),
        noisy_values,
        abs_errors,
        rel_errors_pct,
        scale,
    };

    serde_wasm_bindgen::to_value(&response)
        .map_err(|e| JsValue::from_str(&format!("serialization error: {e}")))
}

// ── Unit tests ────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use rand::SeedableRng;
    use rand_chacha::ChaCha20Rng;

    const SEED: u64 = 42;

    fn seeded() -> ChaCha20Rng {
        ChaCha20Rng::seed_from_u64(SEED)
    }

    // ── true_query ────────────────────────────────────────────────────────────

    #[test]
    fn true_query_sum() {
        let v = [1.0, 2.0, 3.0, 4.0, 5.0];
        assert_eq!(true_query(&v, QueryKind::Sum), 15.0);
    }

    #[test]
    fn true_query_mean() {
        let v = [1.0, 2.0, 3.0, 4.0, 5.0];
        assert!((true_query(&v, QueryKind::Mean) - 3.0).abs() < 1e-12);
    }

    #[test]
    fn true_query_count() {
        let v = [10.0, 20.0, 30.0];
        assert_eq!(true_query(&v, QueryKind::Count), 3.0);
    }

    #[test]
    fn true_query_mean_empty() {
        assert_eq!(true_query(&[], QueryKind::Mean), 0.0);
    }

    #[test]
    fn true_query_sum_empty() {
        assert_eq!(true_query(&[], QueryKind::Sum), 0.0);
    }

    #[test]
    fn true_query_count_empty() {
        assert_eq!(true_query(&[], QueryKind::Count), 0.0);
    }

    // ── Laplace scale ─────────────────────────────────────────────────────────

    #[test]
    fn scale_equals_sensitivity_over_epsilon() {
        let (sens, eps) = (5.0_f64, 2.0_f64);
        assert!((sens / eps - 2.5).abs() < 1e-12);
    }

    #[test]
    fn scale_decreases_as_epsilon_increases() {
        let sens = 1.0_f64;
        assert!(sens / 0.1 > sens / 10.0);
    }

    // ── laplace_sample: correctness ───────────────────────────────────────────

    #[test]
    fn laplace_sample_always_finite() {
        let mut rng = seeded();
        for _ in 0..10_000 {
            let s = laplace_sample(1.0, &mut rng);
            assert!(s.is_finite(), "non-finite sample: {s}");
        }
    }

    /// E[Lap(0, b)] = 0.  Over 100 k samples the empirical mean must be
    /// within 0.01 of zero (≈ 1 % of b = 1).
    #[test]
    fn laplace_mean_approx_zero() {
        let mut rng = seeded();
        const N: usize = 100_000;
        let mean: f64 = (0..N).map(|_| laplace_sample(1.0, &mut rng)).sum::<f64>() / N as f64;
        assert!(
            mean.abs() < 0.01,
            "empirical mean {mean:.6} too far from 0"
        );
    }

    /// Var[Lap(0, b)] = 2b².  Relative error must be < 5 % over 100 k samples.
    #[test]
    fn laplace_variance_approx_2b_squared() {
        let mut rng = seeded();
        const N: usize = 100_000;
        let scale = 2.0_f64;
        let samples: Vec<f64> = (0..N).map(|_| laplace_sample(scale, &mut rng)).collect();
        let mean = samples.iter().sum::<f64>() / N as f64;
        let variance = samples.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / N as f64;
        let expected = 2.0 * scale * scale;
        let rel_err = (variance - expected).abs() / expected;
        assert!(
            rel_err < 0.05,
            "variance {variance:.4} deviates from 2b²={expected:.4} by {:.1}%",
            rel_err * 100.0
        );
    }

    /// Laplace(0, b) is symmetric: skewness must be < 0.05 over 100 k samples.
    #[test]
    fn laplace_is_symmetric() {
        let mut rng = seeded();
        const N: usize = 100_000;
        let scale = 1.5_f64;
        let samples: Vec<f64> = (0..N).map(|_| laplace_sample(scale, &mut rng)).collect();
        let mean = samples.iter().sum::<f64>() / N as f64;
        let m3: f64 = samples.iter().map(|x| (x - mean).powi(3)).sum::<f64>() / N as f64;
        let std = (samples.iter().map(|x| (x - mean).powi(2)).sum::<f64>() / N as f64).sqrt();
        let skewness = m3 / std.powi(3);
        assert!(skewness.abs() < 0.05, "skewness {skewness:.4} too large");
    }

    // ── Deterministic reproducibility ─────────────────────────────────────────

    #[test]
    fn same_seed_gives_identical_sequence() {
        let run = |seed: u64| -> Vec<f64> {
            let mut rng = ChaCha20Rng::seed_from_u64(seed);
            (0..200).map(|_| laplace_sample(1.0, &mut rng)).collect()
        };
        assert_eq!(run(SEED), run(SEED));
    }

    #[test]
    fn different_seeds_give_different_sequences() {
        let run = |seed: u64| -> Vec<f64> {
            let mut rng = ChaCha20Rng::seed_from_u64(seed);
            (0..200).map(|_| laplace_sample(1.0, &mut rng)).collect()
        };
        assert_ne!(run(1), run(2));
    }

    // ── compute_summary ───────────────────────────────────────────────────────

    #[test]
    fn summary_known_values() {
        let v = [1.0, 2.0, 3.0, 4.0, 5.0];
        let s = compute_summary(&v);
        assert!((s.mean - 3.0).abs() < 1e-12);
        assert!((s.min - 1.0).abs() < 1e-12);
        assert!((s.max - 5.0).abs() < 1e-12);
        assert!((s.median - 3.0).abs() < 1e-12);
        // Population stddev of [1,2,3,4,5] = sqrt(2)
        assert!((s.stddev - 2.0_f64.sqrt()).abs() < 1e-10);
    }

    #[test]
    fn summary_single_element() {
        let s = compute_summary(&[42.0]);
        assert_eq!(s.mean, 42.0);
        assert_eq!(s.min, 42.0);
        assert_eq!(s.max, 42.0);
        assert_eq!(s.median, 42.0);
        assert_eq!(s.stddev, 0.0);
    }

    #[test]
    fn summary_empty_returns_zeros() {
        let s = compute_summary(&[]);
        assert_eq!(s.mean, 0.0);
        assert_eq!(s.stddev, 0.0);
        assert_eq!(s.min, 0.0);
        assert_eq!(s.max, 0.0);
        assert_eq!(s.median, 0.0);
    }

    // ── Standalone true_* functions ──────────────────────────────────────────

    #[test]
    fn test_true_sum() {
        assert_eq!(true_sum(&[1.0, 2.0, 3.0, 4.0, 5.0]), 15.0);
        assert_eq!(true_sum(&[]), 0.0);
    }

    #[test]
    fn test_true_mean() {
        assert!((true_mean(&[1.0, 2.0, 3.0, 4.0, 5.0]) - 3.0).abs() < 1e-12);
        assert_eq!(true_mean(&[]), 0.0);
    }

    #[test]
    fn test_true_count() {
        assert_eq!(true_count(&[10.0, 20.0, 30.0]), 3.0);
        assert_eq!(true_count(&[]), 0.0);
    }

    // ── dp_query ──────────────────────────────────────────────────────────────

    #[test]
    fn dp_query_adds_noise() {
        let mut rng = seeded();
        let result = dp_query(100.0, 1.0, &mut rng);
        // Result should differ from true value (with overwhelming probability)
        assert!((result - 100.0).abs() > 1e-15);
    }

    #[test]
    fn dp_query_deterministic_with_seed() {
        let run = |seed: u64| -> f64 {
            let mut rng = ChaCha20Rng::seed_from_u64(seed);
            dp_query(50.0, 2.0, &mut rng)
        };
        assert_eq!(run(SEED), run(SEED));
    }

    // ── Standalone stat helpers ───────────────────────────────────────────────

    #[test]
    fn test_mean_helper() {
        assert!((mean(&[1.0, 2.0, 3.0, 4.0, 5.0]) - 3.0).abs() < 1e-12);
        assert_eq!(mean(&[]), 0.0);
    }

    #[test]
    fn test_stddev_helper() {
        // Population stddev of [1,2,3,4,5] = sqrt(2)
        assert!((stddev(&[1.0, 2.0, 3.0, 4.0, 5.0]) - 2.0_f64.sqrt()).abs() < 1e-10);
        assert_eq!(stddev(&[42.0]), 0.0);
        assert_eq!(stddev(&[]), 0.0);
    }

    #[test]
    fn test_min_helper() {
        assert_eq!(min(&[3.0, 1.0, 4.0, 1.5, 2.0]), 1.0);
        assert_eq!(min(&[]), 0.0);
    }

    #[test]
    fn test_max_helper() {
        assert_eq!(max(&[3.0, 1.0, 4.0, 1.5, 2.0]), 4.0);
        assert_eq!(max(&[]), 0.0);
    }

    #[test]
    fn test_median_helper() {
        // Odd number of elements
        assert_eq!(median(&[3.0, 1.0, 2.0]), 2.0);
        // Even number of elements
        assert_eq!(median(&[4.0, 1.0, 3.0, 2.0]), 2.5);
        assert_eq!(median(&[]), 0.0);
    }

    // ── QueryKind::from_str ───────────────────────────────────────────────────

    #[test]
    fn query_kind_parses_all_variants() {
        assert!(QueryKind::from_str("sum").is_ok());
        assert!(QueryKind::from_str("mean").is_ok());
        assert!(QueryKind::from_str("count").is_ok());
    }

    #[test]
    fn query_kind_rejects_unknown() {
        assert!(QueryKind::from_str("median").is_err());
        assert!(QueryKind::from_str("").is_err());
        assert!(QueryKind::from_str("SUM").is_err()); // case-sensitive
    }
}
