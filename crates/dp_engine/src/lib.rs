use wasm_bindgen::prelude::*;
use serde::Serialize;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use rand::Rng;

#[derive(Serialize)]
struct SimSummary {
    mean: f64,
    stddev: f64,
    min: f64,
    max: f64,
    median: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SimResponse {
    true_value: f64,
    noisy_values: Vec<f64>,
    abs_errors: Vec<f64>,
    rel_errors_pct: Vec<f64>,
    noisy_summary: SimSummary,
    abs_error_summary: SimSummary,
    scale: f64,
}

fn true_query(values: &[f64], query_type: &str) -> f64 {
    match query_type {
        "sum" => values.iter().sum(),
        "mean" => {
            if values.is_empty() { return 0.0; }
            values.iter().sum::<f64>() / values.len() as f64
        }
        "count" => values.len() as f64,
        _ => 0.0,
    }
}

fn laplace_sample(scale: f64, rng: &mut impl Rng) -> f64 {
    let u: f64 = rng.gen_range(-0.4999999..0.4999999);
    let sign = if u >= 0.0 { 1.0_f64 } else { -1.0_f64 };
    -scale * sign * (1.0 - 2.0 * u.abs()).ln()
}

fn compute_summary(values: &[f64]) -> SimSummary {
    let n = values.len() as f64;
    let mean = values.iter().sum::<f64>() / n;
    let variance = values.iter().map(|v| (v - mean).powi(2)).sum::<f64>() / n;
    let stddev = variance.sqrt();
    let min = values.iter().cloned().fold(f64::INFINITY, f64::min);
    let max = values.iter().cloned().fold(f64::NEG_INFINITY, f64::max);
    let mut sorted = values.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let median = if sorted.len() % 2 == 0 {
        (sorted[sorted.len() / 2 - 1] + sorted[sorted.len() / 2]) / 2.0
    } else {
        sorted[sorted.len() / 2]
    };
    SimSummary { mean, stddev, min, max, median }
}

#[wasm_bindgen]
pub fn simulate_query(
    values: js_sys::Float64Array,
    query_type: &str,
    epsilon: f64,
    sensitivity: f64,
    runs: u32,
    seed: Option<String>,
) -> JsValue {
    let vals: Vec<f64> = values.to_vec();

    if epsilon <= 0.0 {
        return JsValue::from_str(&format!("{{\"error\":\"epsilon must be > 0, got {}\"}}", epsilon));
    }
    if sensitivity <= 0.0 {
        return JsValue::from_str(&format!("{{\"error\":\"sensitivity must be > 0, got {}\"}}", sensitivity));
    }
    if runs < 1 {
        return JsValue::from_str("{\"error\":\"runs must be >= 1\"}");
    }
    if (query_type == "sum" || query_type == "mean") && vals.is_empty() {
        return JsValue::from_str("{\"error\":\"values must be non-empty for sum/mean\"}");
    }

    let scale = sensitivity / epsilon;
    let true_val = true_query(&vals, query_type);

    let mut rng: ChaCha8Rng = match seed {
        Some(s) => {
            let seed_val: u64 = s.parse().unwrap_or(42);
            ChaCha8Rng::seed_from_u64(seed_val)
        }
        None => ChaCha8Rng::from_entropy(),
    };

    let mut noisy_values: Vec<f64> = Vec::with_capacity(runs as usize);
    let mut abs_errors: Vec<f64> = Vec::with_capacity(runs as usize);
    let mut rel_errors_pct: Vec<f64> = Vec::with_capacity(runs as usize);

    for _ in 0..runs {
        let noise = laplace_sample(scale, &mut rng);
        let noisy = true_val + noise;
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

    let noisy_summary = compute_summary(&noisy_values);
    let abs_error_summary = compute_summary(&abs_errors);

    let response = SimResponse {
        true_value: true_val,
        noisy_values,
        abs_errors,
        rel_errors_pct,
        noisy_summary,
        abs_error_summary,
        scale,
    };

    match serde_json::to_string(&response) {
        Ok(json) => JsValue::from_str(&json),
        Err(e) => JsValue::from_str(&format!("{{\"error\":\"serialization error: {}\"}}", e)),
    }
}
