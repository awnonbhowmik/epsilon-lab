"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { APP_NAME, APP_VERSION } from "@/lib/version";

const EXAMPLE_SCENARIOS = [
  {
    title: "Low privacy cost per query",
    k: 10,
    epsilon: 0.1,
    delta: 1e-5,
    narrative:
      "With 10 queries each at \u03B5 = 0.1, the basic composition bound gives \u03B5_total = 1.0. This is a reasonable total budget for moderate privacy.",
  },
  {
    title: "Moderate repeated analysis",
    k: 5,
    epsilon: 0.5,
    delta: 1e-5,
    narrative:
      "Five queries at \u03B5 = 0.5 each yield \u03B5_total = 2.5 under basic composition. Advanced composition would give a tighter bound, particularly as k grows.",
  },
  {
    title: "Many queries, high budget",
    k: 20,
    epsilon: 1.0,
    delta: 1e-5,
    narrative:
      "Twenty queries at \u03B5 = 1.0 each produce \u03B5_total = 20.0 under basic composition. This illustrates why advanced composition or privacy accounting is important for workloads with many queries.",
  },
];

export default function CompositionPage() {
  const [k, setK] = useState(10);
  const [epsilon, setEpsilon] = useState(0.5);
  const [delta, setDelta] = useState(1e-5);
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  const basicData = useMemo(() => {
    return Array.from({ length: k }, (_, i) => {
      const queries = i + 1;
      return {
        k: queries,
        epsBasic: parseFloat((queries * epsilon).toFixed(6)),
        deltaBasic: parseFloat((queries * delta).toExponential(2)),
      };
    });
  }, [k, epsilon, delta]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">Compare</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Composition</Link>
        <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">Appendix</Link>
        <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">References</Link>
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">Methodology</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-indigo-400">Composition of Differential Privacy</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
              activeTab === "basic"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Basic Sequential Composition
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
              activeTab === "advanced"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Advanced Composition (Overview)
          </button>
        </div>

        {activeTab === "basic" && (
          <div className="space-y-6">
            {/* Theorem statement */}
            <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
              <h2 className="text-sm font-semibold text-indigo-300">Basic Sequential Composition Theorem</h2>
              <p className="text-sm text-gray-400">
                If mechanisms M_1, ..., M_k satisfy \u03B5_i-DP respectively, their sequential composition satisfies:
              </p>
              <p className="text-sm font-mono text-indigo-200">
                \u03B5_total = \u03A3 \u03B5_i
              </p>
              <p className="text-sm text-gray-400">
                For (\u03B5, \u03B4)-DP mechanisms:
              </p>
              <p className="text-sm font-mono text-indigo-200">
                \u03B5_total = \u03A3 \u03B5_i, \u03B4_total = \u03A3 \u03B4_i
              </p>
              <p className="text-xs text-gray-500">
                Reference: Dwork, C., McSherry, F., Nissim, K., & Smith, A. (2006).
              </p>
            </div>

            {/* Interactive controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Number of queries (k)
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={k}
                  onChange={(e) => setK(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <span className="text-xs text-gray-400">k = {k}</span>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Per-query \u03B5
                </label>
                <input
                  type="number"
                  min={0.01}
                  max={10}
                  step={0.1}
                  value={epsilon}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (v > 0 && v <= 10) setEpsilon(v);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Per-query \u03B4
                </label>
                <input
                  type="number"
                  min={1e-10}
                  max={0.1}
                  step={1e-6}
                  value={delta}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (v > 0 && v < 1) setDelta(v);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Results */}
            <div className="bg-gray-900 border border-gray-700 rounded p-4">
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Total privacy cost:</span>{" "}
                <span className="font-mono text-indigo-200">\u03B5_total = {(k * epsilon).toFixed(4)}</span>,{" "}
                <span className="font-mono text-indigo-200">\u03B4_total = {(k * delta).toExponential(2)}</span>
              </p>
            </div>

            {/* Chart */}
            <div className="bg-gray-900 border border-gray-700 rounded p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                \u03B5_total vs. Number of Queries
              </h3>
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={basicData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="k"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      label={{ value: "k (queries)", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      label={{ value: "\u03B5_total", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value) => [typeof value === "number" ? value.toFixed(4) : value, "\u03B5_total"]}
                      labelFormatter={(label) => `k = ${label}`}
                      contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="epsBasic"
                      stroke="#818cf8"
                      dot={{ r: 3, fill: "#818cf8" }}
                      strokeWidth={2}
                      name="Basic composition"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-1 px-2">k</th>
                    <th className="text-left py-1 px-2">\u03B5_total</th>
                    <th className="text-left py-1 px-2">\u03B4_total</th>
                  </tr>
                </thead>
                <tbody>
                  {basicData.map((r) => (
                    <tr key={r.k} className="border-b border-gray-800">
                      <td className="py-1 px-2">{r.k}</td>
                      <td className="py-1 px-2 font-mono">{r.epsBasic.toFixed(4)}</td>
                      <td className="py-1 px-2 font-mono">{r.deltaBasic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Example Scenarios */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-200">Example Scenarios</h2>
              {EXAMPLE_SCENARIOS.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-700 rounded p-4 space-y-1">
                  <h3 className="text-sm font-semibold text-indigo-300">{s.title}</h3>
                  <p className="text-xs text-gray-500 font-mono">
                    k = {s.k}, \u03B5 = {s.epsilon}, \u03B4 = {s.delta.toExponential(0)} → \u03B5_total = {(s.k * s.epsilon).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400">{s.narrative}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-3">
              <h2 className="text-sm font-semibold text-indigo-300">Advanced Composition (Educational Overview)</h2>
              <p className="text-sm text-gray-400">
                Basic composition adds privacy costs linearly: \u03B5_total = k\u03B5. This is a valid upper bound but can be loose when the number of queries k is large.
              </p>
              <p className="text-sm text-gray-400">
                The <em>advanced composition theorem</em> (Dwork, Rothblum, & Vadhan, 2010) shows that for k-fold adaptive composition of (\u03B5, \u03B4)-DP mechanisms, the total privacy cost grows proportionally to \u221Ak rather than k. Specifically, for any \u03B4\u2032 &gt; 0, the composed mechanism satisfies (\u03B5\u2032, k\u03B4 + \u03B4\u2032)-DP where:
              </p>
              <p className="text-sm font-mono text-indigo-200">
                \u03B5\u2032 = \u03B5\u221A(2k ln(1/\u03B4\u2032)) + k\u03B5(e^\u03B5 - 1)
              </p>
              <p className="text-sm text-gray-400">
                This means that repeated access to a dataset is less costly than the basic bound suggests, which is critical for practical applications such as iterative model training.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-3">
              <h2 className="text-sm font-semibold text-indigo-300">Why Advanced Composition Is Tighter</h2>
              <p className="text-sm text-gray-400">
                The basic bound treats each query as fully independent in terms of worst-case information leakage. Advanced composition leverages the probabilistic structure of the noise to achieve a tighter bound. The key insight is that the worst-case privacy loss across multiple queries concentrates around its expectation, so the total loss scales with \u221Ak instead of k.
              </p>
              <p className="text-sm text-gray-400">
                Even tighter accounting is possible with Renyi Differential Privacy (Mironov, 2017), which tracks the privacy loss using Renyi divergences and yields optimal composition bounds for many practical scenarios.
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded p-4">
              <p className="text-sm text-yellow-300/80">
                Note: {APP_NAME} currently implements only basic sequential composition. Advanced composition and RDP accounting are planned for future versions. The formulas above are provided for educational context and are not implemented in the simulator.
              </p>
            </div>
          </div>
        )}

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
