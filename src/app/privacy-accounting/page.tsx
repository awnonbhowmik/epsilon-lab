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

/**
 * Advanced Composition Visualizer — /privacy-accounting page.
 *
 * Interactive demonstration of basic composition, advanced composition,
 * and RDP intuition with side-by-side charts.
 */
export default function PrivacyAccountingPage() {
  const [epsilon, setEpsilon] = useState(0.5);
  const [delta, setDelta] = useState(1e-5);
  const [maxK, setMaxK] = useState(30);

  const data = useMemo(() => {
    return Array.from({ length: maxK }, (_, i) => {
      const k = i + 1;
      const epsBasic = k * epsilon;
      // Advanced composition: ε' = ε√(2k·ln(1/δ')) + k·ε·(e^ε - 1)
      const deltaPrime = delta; // using same δ for simplicity
      const epsAdvanced =
        epsilon * Math.sqrt(2 * k * Math.log(1 / deltaPrime)) +
        k * epsilon * (Math.exp(epsilon) - 1);
      // RDP-based estimate (simplified)
      const epsRdp = epsilon * Math.sqrt(2 * k * Math.log(1 / deltaPrime));
      return {
        k,
        basic: parseFloat(epsBasic.toFixed(4)),
        advanced: parseFloat(Math.min(epsAdvanced, epsBasic).toFixed(4)),
        rdp: parseFloat(Math.min(epsRdp, epsBasic).toFixed(4)),
      };
    });
  }, [epsilon, delta, maxK]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Home</Link>
        <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
        <Link href="/privacy-accounting" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Privacy Accounting</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-indigo-400">Advanced Composition Visualizer</h1>
        <p className="text-sm text-gray-400">
          Compare basic composition, advanced composition, and simplified RDP bounds interactively.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">ε per query</label>
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
            <label className="block text-sm font-semibold text-gray-300 mb-1">δ per query</label>
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
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">Max queries (k)</label>
            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={maxK}
              onChange={(e) => setMaxK(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <span className="text-xs text-gray-400">k = {maxK}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 border border-gray-700 rounded p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Basic ε_total (k={maxK})</p>
            <p className="font-mono text-indigo-200">{data[data.length - 1]?.basic.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Advanced ε_total (k={maxK})</p>
            <p className="font-mono text-green-300">{data[data.length - 1]?.advanced.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">RDP estimate ε_total (k={maxK})</p>
            <p className="font-mono text-amber-300">{data[data.length - 1]?.rdp.toFixed(4)}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-gray-900 border border-gray-700 rounded p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            k vs. ε_total — Composition Comparison
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="k"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  label={{ value: "k (queries)", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  label={{ value: "ε_total", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="basic"
                  stroke="#818cf8"
                  dot={false}
                  strokeWidth={2}
                  name="Basic composition (k·ε)"
                />
                <Line
                  type="monotone"
                  dataKey="advanced"
                  stroke="#34d399"
                  dot={false}
                  strokeWidth={2}
                  name="Advanced composition"
                />
                <Line
                  type="monotone"
                  dataKey="rdp"
                  stroke="#fbbf24"
                  dot={false}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="RDP estimate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Theory */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
            <h2 className="text-sm font-semibold text-indigo-300">Basic Composition</h2>
            <p className="text-sm text-gray-400">
              The total privacy cost is the sum of individual costs: ε_total = k·ε, δ_total = k·δ.
              Simple but loose for large k.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
            <h2 className="text-sm font-semibold text-indigo-300">Advanced Composition</h2>
            <p className="text-sm text-gray-400">
              Dwork, Rothblum &amp; Vadhan (2010): for k-fold composition of (ε, δ)-DP mechanisms,
              the composed mechanism satisfies (ε&apos;, kδ + δ&apos;)-DP where:
            </p>
            <p className="text-sm font-mono text-indigo-200">
              ε&apos; = ε√(2k·ln(1/δ&apos;)) + k·ε·(e^ε − 1)
            </p>
            <p className="text-sm text-gray-400">
              Grows as √k rather than k — much tighter for large number of queries.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
            <h2 className="text-sm font-semibold text-indigo-300">RDP Intuition</h2>
            <p className="text-sm text-gray-400">
              Rényi Differential Privacy (Mironov, 2017) tracks privacy loss using Rényi divergences.
              Under RDP, composition is exact: Rényi divergences add linearly. The final conversion
              to (ε, δ)-DP gives ε_total ≈ ε·√(2k·ln(1/δ)), which is often the tightest practical bound.
            </p>
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
          <p className="text-xs text-yellow-300/80">
            ⚠ Formulas shown are simplified for educational purposes. Production privacy accounting
            requires careful implementation of moment-based or numerical RDP conversion.
          </p>
        </div>

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
