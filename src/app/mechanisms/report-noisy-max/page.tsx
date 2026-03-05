"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Footer from "@/components/Footer";
import ParamSlider from "@/components/ParamSlider";
import FormulaBlock from "@/components/FormulaBlock";
import MathTex from "@/components/Math";
import { reportNoisyMax, type CountCandidate } from "@/lib/dp/mechanisms";

const DEFAULT_COUNTS: CountCandidate[] = [
  { label: "Category A", count: 120 },
  { label: "Category B", count: 85 },
  { label: "Category C", count: 200 },
  { label: "Category D", count: 60 },
  { label: "Category E", count: 145 },
];

const TRIAL_COUNT = 100;

export default function ReportNoisyMaxPage() {
  const [counts, setCounts] = useState<CountCandidate[]>(DEFAULT_COUNTS);
  const [epsilon, setEpsilon] = useState(1.0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showTheory, setShowTheory] = useState(false);

  // Compute noisy counts for visualization (single run)
  const noisyData = useMemo(() => {
    const scale = 1 / epsilon;
    return counts.map((c) => ({
      label: c.label,
      trueCount: c.count,
      noisyCount: Math.round(
        c.count +
          (-scale * Math.sign(Math.random() - 0.5) * Math.log(1 - 2 * Math.abs(Math.random() - 0.5))),
      ),
    }));
  }, [counts, epsilon]);

  // 100 trials win frequencies
  const winFrequencies = useMemo(() => {
    const wins: Record<string, number> = {};
    counts.forEach((c) => (wins[c.label] = 0));
    for (let i = 0; i < TRIAL_COUNT; i++) {
      const w = reportNoisyMax(counts, epsilon);
      wins[w] = (wins[w] ?? 0) + 1;
    }
    return counts.map((c) => ({
      label: c.label,
      wins: wins[c.label] ?? 0,
      pct: ((wins[c.label] ?? 0) / TRIAL_COUNT) * 100,
    }));
  }, [counts, epsilon]);

  function updateCount(index: number, value: number) {
    setCounts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, count: value } : c)),
    );
  }

  function updateLabel(index: number, label: string) {
    setCounts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, label } : c)),
    );
  }

  function run() {
    setWinner(reportNoisyMax(counts, epsilon));
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
          <h1 className="text-2xl font-bold">Report Noisy Max</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Add <MathTex>{"\\text{Lap}(0,\\,1/\\varepsilon)"}</MathTex> noise to
            each count, then return the{" "}
            <MathTex>{"\\operatorname{argmax}"}</MathTex>. A pure{" "}
            <MathTex>{"\\varepsilon"}</MathTex>-DP mechanism for finding the most
            popular category.
          </p>
        </div>

        {/* Candidate editor */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-indigo-300">Candidates &amp; Counts</h2>
          <div className="space-y-2">
            {counts.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={c.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={c.count}
                  onChange={(e) => updateCount(i, Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
          <ParamSlider
            label="ε (epsilon)"
            value={epsilon}
            min={0.01}
            max={5}
            step={0.01}
            onChange={setEpsilon}
          />
          <button
            onClick={run}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
          >
            Run →
          </button>
        </div>

        {/* Winner */}
        {winner !== null && (
          <div className="bg-gray-900 border border-indigo-600 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-1">Reported winner (noisy argmax):</p>
            <p className="text-2xl font-bold text-indigo-300">{winner}</p>
          </div>
        )}

        {/* Bar chart: true vs noisy */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-indigo-300">True vs. Noisy Counts</h2>
          <p className="text-xs text-gray-500">
            Noise scale <MathTex>{"b = 1/\\varepsilon = " + (1/epsilon).toFixed(3)}</MathTex>
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={noisyData} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} angle={-15} textAnchor="end" />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
              <Legend />
              <Bar dataKey="trueCount" name="True Count" fill="#4f46e5" radius={[3,3,0,0]}>
                {noisyData.map((d) => (
                  <Cell key={d.label} fill={d.label === winner ? "#6366f1" : "#4f46e5"} />
                ))}
              </Bar>
              <Bar dataKey="noisyCount" name="Noisy Count" fill="#6b7280" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win frequencies */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-indigo-300">
            Win Frequency over <MathTex>{"100"}</MathTex> Trials
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
                <th className="text-left py-1">Candidate</th>
                <th className="text-right py-1">True Count</th>
                <th className="text-right py-1">Wins</th>
                <th className="text-right py-1">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {winFrequencies.map((w, i) => (
                <tr key={w.label} className="border-b border-gray-800 text-gray-300">
                  <td className="py-1">{w.label}</td>
                  <td className="text-right py-1">{counts[i]?.count ?? 0}</td>
                  <td className="text-right py-1">{w.wins}</td>
                  <td className="text-right py-1">{w.pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Theory */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowTheory((v) => !v)}
          >
            <span>Theory — Report Noisy Max</span>
            <svg className={`w-4 h-4 transition-transform ${showTheory ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheory && (
            <div className="px-5 pb-5 space-y-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">Algorithm</h3>
                <p>
                  Given counts <MathTex>{"c_1, \\ldots, c_k"}</MathTex>, add
                  independent Laplace noise to each:
                </p>
                <FormulaBlock
                  latex={"\\tilde{c}_i = c_i + \\eta_i, \\quad \\eta_i \\sim \\text{Lap}\\!\\left(0,\\,\\frac{1}{\\varepsilon}\\right)"}
                  label="Noisy counts"
                  copyable
                />
                <p>
                  Return <MathTex>{"\\operatorname{argmax}_i \\tilde{c}_i"}</MathTex>.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">Privacy Analysis</h3>
                <p>
                  Since each <MathTex>{"c_i"}</MathTex> changes by at most 1 on
                  adjacent datasets, the sensitivity of each noisy query is 1.
                  Adding <MathTex>{"\\text{Lap}(0, 1/\\varepsilon)"}</MathTex> makes
                  each query <MathTex>{"\\varepsilon"}</MathTex>-DP. Publishing
                  only the argmax (not all noisy values) satisfies{" "}
                  <MathTex>{"\\varepsilon"}</MathTex>-DP by post-processing.
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
