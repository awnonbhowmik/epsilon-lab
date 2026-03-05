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
  ResponsiveContainer,
} from "recharts";
import Footer from "@/components/Footer";
import ParamSlider from "@/components/ParamSlider";
import FormulaBlock from "@/components/FormulaBlock";
import MathTex from "@/components/Math";
import { histogramMechanism, type HistogramBin } from "@/lib/dp/mechanisms";

const DEFAULT_BINS: HistogramBin[] = [
  { label: "18–24", count: 340 },
  { label: "25–34", count: 520 },
  { label: "35–44", count: 410 },
  { label: "45–54", count: 280 },
  { label: "55–64", count: 195 },
  { label: "65+", count: 110 },
];

export default function HistogramPage() {
  const [bins, setBins] = useState<HistogramBin[]>(DEFAULT_BINS);
  const [epsilon, setEpsilon] = useState(1.0);
  const [clipNegative, setClipNegative] = useState(false);
  const [showTheory, setShowTheory] = useState(false);

  const noisyBins = useMemo(
    () => histogramMechanism(bins, epsilon, clipNegative),
    [bins, epsilon, clipNegative],
  );

  const chartData = useMemo(
    () =>
      noisyBins.map((b) => ({
        label: b.label,
        "True Count": b.trueCount,
        "Noisy Count": Math.round(b.noisyCount),
      })),
    [noisyBins],
  );

  function updateCount(index: number, value: number) {
    setBins((prev) =>
      prev.map((b, i) => (i === index ? { ...b, count: value } : b)),
    );
  }

  function updateLabel(index: number, label: string) {
    setBins((prev) =>
      prev.map((b, i) => (i === index ? { ...b, label } : b)),
    );
  }

  function addBin() {
    setBins((prev) => [...prev, { label: `Bin ${prev.length + 1}`, count: 100 }]);
  }

  function removeBin(index: number) {
    setBins((prev) => prev.filter((_, i) => i !== index));
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
          <h1 className="text-2xl font-bold">Histogram Mechanism</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Add independent{" "}
            <MathTex>{"\\text{Lap}(0,\\,1/\\varepsilon)"}</MathTex> noise to
            each histogram bin. By <em>parallel composition</em>, the total
            privacy cost is just <MathTex>{"\\varepsilon"}</MathTex> regardless
            of how many bins you have.
          </p>
        </div>

        {/* Bin editor */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-indigo-300">Histogram Bins</h2>
          <div className="space-y-2">
            {bins.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={b.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={b.count}
                  onChange={(e) => updateCount(i, Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 text-center focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => removeBin(i)}
                  className="text-gray-600 hover:text-red-400 transition-colors px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addBin}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            + Add bin
          </button>

          <ParamSlider
            label="ε (epsilon)"
            value={epsilon}
            min={0.01}
            max={5}
            step={0.01}
            onChange={setEpsilon}
          />

          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={clipNegative}
              onChange={(e) => setClipNegative(e.target.checked)}
              className="accent-indigo-500"
            />
            Clip negative noisy counts to 0
          </label>

          <p className="text-xs text-gray-500">
            Total privacy cost (parallel composition):{" "}
            <MathTex>{"\\varepsilon_{\\text{total}} = \\varepsilon = " + epsilon}</MathTex>
          </p>
        </div>

        {/* Chart */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-indigo-300">
            True vs. Noisy Histogram
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
              <Legend />
              <Bar dataKey="True Count" fill="#4f46e5" radius={[3,3,0,0]} />
              <Bar dataKey="Noisy Count" fill="#6b7280" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Per-bin table */}
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-gray-500 text-xs uppercase border-b border-gray-700">
                <th className="text-left py-1">Bin</th>
                <th className="text-right py-1">True</th>
                <th className="text-right py-1">Noisy</th>
                <th className="text-right py-1">Error</th>
              </tr>
            </thead>
            <tbody>
              {noisyBins.map((b) => {
                const error = b.noisyCount - b.trueCount;
                return (
                  <tr key={b.label} className="border-b border-gray-800 text-gray-300">
                    <td className="py-1">{b.label}</td>
                    <td className="text-right py-1">{b.trueCount}</td>
                    <td className="text-right py-1">{b.noisyCount.toFixed(1)}</td>
                    <td className="text-right py-1">
                      {error > 0 ? "+" : ""}
                      {error.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Theory */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowTheory((v) => !v)}
          >
            <span>Theory — Parallel &amp; Sequential Composition</span>
            <svg className={`w-4 h-4 transition-transform ${showTheory ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheory && (
            <div className="px-5 pb-5 space-y-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Sequential Composition
                </h3>
                <p>
                  If mechanisms <MathTex>{"M_1, \\ldots, M_k"}</MathTex> each
                  satisfy <MathTex>{"\\varepsilon_i"}</MathTex>-DP on the same
                  dataset, their sequential composition satisfies:
                </p>
                <FormulaBlock
                  latex={"\\varepsilon_{\\text{total}} = \\sum_{i=1}^{k} \\varepsilon_i"}
                  label="Sequential composition"
                  copyable
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Parallel Composition
                </h3>
                <p>
                  If mechanisms <MathTex>{"M_1, \\ldots, M_k"}</MathTex> each
                  satisfy <MathTex>{"\\varepsilon"}</MathTex>-DP but are applied
                  to <em>disjoint subsets</em> of the dataset, then the
                  combined mechanism satisfies only:
                </p>
                <FormulaBlock
                  latex={"\\varepsilon_{\\text{total}} = \\varepsilon"}
                  label="Parallel composition"
                  copyable
                />
                <p>
                  Histogram queries are disjoint (each record belongs to exactly
                  one bin), so parallel composition applies. The total privacy
                  cost is <MathTex>{"\\varepsilon"}</MathTex>, not{" "}
                  <MathTex>{"k \\cdot \\varepsilon"}</MathTex>.
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
