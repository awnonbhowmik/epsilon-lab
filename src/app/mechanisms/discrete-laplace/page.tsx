"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import Footer from "@/components/Footer";
import ParamSlider from "@/components/ParamSlider";
import FormulaBlock from "@/components/FormulaBlock";
import MathTex from "@/components/Math";
import {
  discreteLaplaceQuery,
  discreteLaplacePMF,
} from "@/lib/dp/mechanisms";

const SAMPLE_COUNT = 1000;

export default function DiscreteLaplacePage() {
  const [trueValue, setTrueValue] = useState(10);
  const [sensitivity, setSensitivity] = useState(1);
  const [epsilon, setEpsilon] = useState(1.0);
  const [showTheory, setShowTheory] = useState(false);

  // Generate 1000 noisy samples
  const samples = useMemo(() => {
    return Array.from({ length: SAMPLE_COUNT }, () =>
      discreteLaplaceQuery(trueValue, epsilon, sensitivity),
    );
  }, [trueValue, epsilon, sensitivity]);

  // Build histogram bins
  const histogramData = useMemo(() => {
    const freq: Record<number, number> = {};
    for (const s of samples) {
      freq[s] = (freq[s] ?? 0) + 1;
    }
    const keys = Object.keys(freq)
      .map(Number)
      .sort((a, b) => a - b);
    return keys.map((k) => ({
      value: k,
      count: freq[k],
      pmf: discreteLaplacePMF(k - trueValue, epsilon, sensitivity) * SAMPLE_COUNT,
    }));
  }, [samples, trueValue, epsilon, sensitivity]);

  const alpha = Math.exp(-epsilon / sensitivity);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <a href="/mechanisms" className="text-xs text-gray-500 hover:text-indigo-400">
              ← All Mechanisms
            </a>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-600 text-gray-300">
              ε-DP
            </span>
          </div>
          <h1 className="text-2xl font-bold">Discrete Laplace Mechanism</h1>
          <p className="text-gray-400 mt-1 text-sm">
            The geometric mechanism for integer-valued queries. Adds
            integer-valued noise drawn from a two-sided geometric distribution —
            exact and optimal for counting queries.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-5">
          <h2 className="font-semibold text-indigo-300">Parameters</h2>
          <ParamSlider
            label="True integer value"
            value={trueValue}
            min={-100}
            max={100}
            step={1}
            onChange={setTrueValue}
          />
          <ParamSlider
            label="Sensitivity (Δ)"
            value={sensitivity}
            min={1}
            max={20}
            step={1}
            onChange={setSensitivity}
          />
          <ParamSlider
            label="ε (epsilon)"
            value={epsilon}
            min={0.01}
            max={5}
            step={0.01}
            onChange={setEpsilon}
          />
          <div className="text-xs text-gray-500 space-y-0.5">
            <p>
              Geometric parameter:{" "}
              <MathTex>
                {"\\alpha = e^{-\\varepsilon/\\Delta} = " + alpha.toFixed(4)}
              </MathTex>
            </p>
            <p>
              Noise scale:{" "}
              <MathTex>
                {"b = \\Delta/\\varepsilon = " + (sensitivity / epsilon).toFixed(3)}
              </MathTex>
            </p>
          </div>
        </div>

        {/* Histogram + PMF */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-indigo-300">
            Sample Histogram vs. Theoretical PMF
          </h2>
          <p className="text-xs text-gray-500">
            <MathTex>{"N = " + SAMPLE_COUNT}</MathTex> noisy samples (bars).
            Theoretical PMF scaled to counts (line). True value{" "}
            <MathTex>{"= " + trueValue}</MathTex> shown as reference line.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={histogramData}
              margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="value"
                tick={{ fill: "#9ca3af", fontSize: 10 }}
                label={{ value: "Noisy value", position: "insideBottom", offset: -10, fill: "#6b7280", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid #374151" }}
                formatter={(value, name) => [
                  name === "count" ? value : (typeof value === "number" ? value.toFixed(1) : value),
                  name === "count" ? "Sample count" : "Expected (PMF)",
                ]}
              />
              <Legend />
              <Bar dataKey="count" name="count" fill="#4f46e5" radius={[2,2,0,0]} opacity={0.8} />
              <Line
                type="monotone"
                dataKey="pmf"
                name="pmf"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={2}
              />
              <ReferenceLine
                x={trueValue}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{ value: `true=${trueValue}`, fill: "#ef4444", fontSize: 10 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Theory */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowTheory((v) => !v)}
          >
            <span>Theory — Discrete Laplace / Geometric Mechanism</span>
            <svg className={`w-4 h-4 transition-transform ${showTheory ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheory && (
            <div className="px-5 pb-5 space-y-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Probability Mass Function
                </h3>
                <p>
                  The Discrete Laplace distribution with parameter{" "}
                  <MathTex>{"\\alpha = e^{-\\varepsilon/\\Delta}"}</MathTex>{" "}
                  has PMF:
                </p>
                <FormulaBlock
                  latex={"P(X = k) = \\frac{1-\\alpha}{1+\\alpha} \\cdot \\alpha^{|k|}, \\quad k \\in \\mathbb{Z}"}
                  label="Discrete Laplace PMF"
                  copyable
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">Mechanism</h3>
                <p>
                  For an integer-valued query <MathTex>{"f(x) \\in \\mathbb{Z}"}</MathTex>{" "}
                  with sensitivity <MathTex>{"\\Delta \\in \\mathbb{Z}^+"}</MathTex>:
                </p>
                <FormulaBlock
                  latex={"M(x) = f(x) + \\eta, \\quad \\eta \\sim \\text{DLap}\\!\\left(e^{-\\varepsilon/\\Delta}\\right)"}
                  label="Discrete Laplace mechanism"
                  copyable
                />
                <p>
                  This satisfies <MathTex>{"\\varepsilon"}</MathTex>-DP. Unlike
                  the continuous Laplace mechanism, it produces exact integer
                  outputs with no rounding error.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Comparison with Continuous Laplace
                </h3>
                <p>
                  The continuous Laplace mechanism with scale{" "}
                  <MathTex>{"b = \\Delta/\\varepsilon"}</MathTex> has variance{" "}
                  <MathTex>{"2b^2"}</MathTex>. The discrete Laplace has variance:
                </p>
                <FormulaBlock
                  latex={"\\text{Var}[\\eta] = \\frac{2\\alpha}{(1-\\alpha)^2}"}
                  label="Discrete Laplace variance"
                  copyable
                />
                <p>
                  For integer queries, the discrete variant is preferable since
                  it avoids rounding the continuous noise to integers.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
