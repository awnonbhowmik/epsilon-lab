"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Footer from "@/components/Footer";
import ParamSlider from "@/components/ParamSlider";
import FormulaBlock from "@/components/FormulaBlock";
import MathTex from "@/components/Math";
import {
  exponentialMechanism,
  exponentialProbabilities,
  type Candidate,
} from "@/lib/dp/mechanisms";

const DEFAULT_CANDIDATES_TEXT =
  "Pizza,9\nSushi,7\nTacos,8\nSalad,4\nBurgers,6";

function parseCandidates(text: string): Candidate[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",");
      const label = parts[0]?.trim() ?? "";
      const score = parseFloat(parts[1] ?? "0");
      return { label, score: isNaN(score) ? 0 : score };
    })
    .filter((c) => c.label.length > 0);
}

export default function ExponentialPage() {
  const [candidatesText, setCandidatesText] = useState(DEFAULT_CANDIDATES_TEXT);
  const [epsilon, setEpsilon] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(1.0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState(false);

  const candidates = useMemo(
    () => parseCandidates(candidatesText),
    [candidatesText],
  );

  const probabilities = useMemo(
    () =>
      candidates.length > 0
        ? exponentialProbabilities(candidates, epsilon, sensitivity)
        : [],
    [candidates, epsilon, sensitivity],
  );

  function run() {
    if (candidates.length === 0) return;
    setSelected(exponentialMechanism(candidates, epsilon, sensitivity));
  }

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
          <h1 className="text-2xl font-bold">Exponential Mechanism</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Select a non-numeric output (e.g. a category) with privacy-preserving
            probability proportional to{" "}
            <MathTex>
              {"\\exp\\!\\left(\\varepsilon \\cdot u(x,r)\\, /\\, 2\\Delta u\\right)"}
            </MathTex>
            .
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-5">
          <h2 className="font-semibold text-indigo-300">Candidates</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              One per line:{" "}
              <code className="text-xs text-indigo-300">Label,score</code>
            </label>
            <textarea
              value={candidatesText}
              onChange={(e) => setCandidatesText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-sm text-gray-200 font-mono resize-y focus:outline-none focus:border-indigo-500"
            />
          </div>
          <ParamSlider
            label="ε (epsilon)"
            value={epsilon}
            min={0.01}
            max={10}
            step={0.01}
            onChange={setEpsilon}
          />
          <ParamSlider
            label="Δu (sensitivity)"
            value={sensitivity}
            min={0.1}
            max={5}
            step={0.1}
            onChange={setSensitivity}
          />
          <button
            onClick={run}
            disabled={candidates.length === 0}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            Run →
          </button>
        </div>

        {/* Result */}
        {selected !== null && (
          <div className="bg-gray-900 border border-indigo-600 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Selected output:</p>
            <p className="text-2xl font-bold text-indigo-300">{selected}</p>
          </div>
        )}

        {/* Bar chart of scores / probabilities */}
        {probabilities.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-indigo-300">
              Selection Probabilities
            </h2>
            <p className="text-xs text-gray-500">
              Bar height = score. Label shows the selection probability under{" "}
              <MathTex>{"\\varepsilon = " + epsilon}</MathTex>.
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={probabilities} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #374151" }}
                  formatter={(value, name) => [
                    name === "score"
                      ? (typeof value === "number" ? value.toFixed(2) : value)
                      : (typeof value === "number" ? (value * 100).toFixed(1) + "%" : value),
                    name === "score" ? "Score" : "Probability",
                  ]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {probabilities.map((p) => (
                    <Cell
                      key={p.label}
                      fill={
                        p.label === selected ? "#6366f1" : "#374151"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Probability table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
                  <th className="text-left py-1">Candidate</th>
                  <th className="text-right py-1">Score</th>
                  <th className="text-right py-1">
                    <MathTex>{"\\Pr[M(x)=r]"}</MathTex>
                  </th>
                </tr>
              </thead>
              <tbody>
                {probabilities.map((p) => (
                  <tr
                    key={p.label}
                    className={`border-b border-gray-800 ${
                      p.label === selected ? "text-indigo-300 font-semibold" : "text-gray-300"
                    }`}
                  >
                    <td className="py-1">{p.label}</td>
                    <td className="text-right py-1">{p.score.toFixed(2)}</td>
                    <td className="text-right py-1">
                      {(p.probability * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Theory panel */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowTheory((v) => !v)}
          >
            <span>Theory — Exponential Mechanism</span>
            <svg
              className={`w-4 h-4 transition-transform ${showTheory ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheory && (
            <div className="px-5 pb-5 space-y-4 text-sm text-gray-300 border-t border-gray-700">
              <div className="space-y-2 pt-4">
                <h3 className="text-indigo-300 font-semibold">Definition (McSherry &amp; Talwar, 2007)</h3>
                <p>
                  Let <MathTex>{"\\mathcal{R}"}</MathTex> be a set of outputs and{" "}
                  <MathTex>{"u : \\mathcal{X} \\times \\mathcal{R} \\to \\mathbb{R}"}</MathTex>{" "}
                  a utility function with sensitivity:
                </p>
                <FormulaBlock
                  latex={"\\Delta u = \\max_{r \\in \\mathcal{R}}\\, \\max_{x \\sim x'} |u(x,r) - u(x',r)|"}
                  label="Utility sensitivity"
                  copyable
                />
                <p>The exponential mechanism outputs:</p>
                <FormulaBlock
                  latex={"\\Pr[M(x) = r] \\propto \\exp\\!\\left(\\frac{\\varepsilon \\cdot u(x,r)}{2 \\Delta u}\\right)"}
                  label="Sampling distribution"
                  copyable
                />
                <p>
                  This mechanism satisfies <MathTex>{"\\varepsilon"}</MathTex>-differential
                  privacy. The factor of 2 in the denominator gives the tighter analysis
                  over the naive <MathTex>{"\\varepsilon / \\Delta u"}</MathTex>.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="text-indigo-300 font-semibold">Privacy Proof Sketch</h3>
                <p>
                  For adjacent datasets <MathTex>{"x, x'"}</MathTex> and any output{" "}
                  <MathTex>{"r"}</MathTex>:
                </p>
                <FormulaBlock
                  latex={"\\frac{\\Pr[M(x)=r]}{\\Pr[M(x')=r]} = \\frac{\\exp\\!(\\varepsilon u(x,r)/2\\Delta u)}{\\exp\\!(\\varepsilon u(x',r)/2\\Delta u)} \\cdot \\frac{Z(x')}{Z(x)} \\leq e^{\\varepsilon/2} \\cdot e^{\\varepsilon/2} = e^\\varepsilon"}
                  label="Privacy ratio"
                  copyable
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
