"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import MathTex from "@/components/Math";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { laplacePdf, gaussianPdf } from "@/lib/dp/utils";
import { APP_NAME, APP_VERSION } from "@/lib/version";

const COMPARISON_ROWS = [
  {
    aspect: "Privacy guarantee",
    laplace: "\u03B5-differential privacy (pure DP)",
    gaussian: "(\u03B5, \u03B4)-differential privacy (approximate DP)",
  },
  {
    aspect: "Sensitivity type",
    laplace: "L1 sensitivity",
    gaussian: "L2 sensitivity",
  },
  {
    aspect: "Noise distribution",
    laplace: "Laplace(0, b) where b = Δf / ε",
    gaussian: "N(0, σ²) where σ = (Δf · √(2 ln(1.25/δ))) / ε",
    laplaceLatex: "\\text{Laplace}(0, b) \\text{ where } b = \\Delta f\\,/\\,\\varepsilon",
    gaussianLatex: "\\mathcal{N}(0, \\sigma^2) \\text{ where } \\sigma = \\frac{\\Delta f \\cdot \\sqrt{2\\ln(1.25/\\delta)}}{\\varepsilon}",
  },
  {
    aspect: "Inputs required",
    laplace: "\u03B5, \u0394f (L1)",
    gaussian: "\u03B5, \u03B4, \u0394f (L2)",
  },
  {
    aspect: "Typical use cases",
    laplace: "Counting queries, simple aggregates, scenarios requiring pure DP guarantees",
    gaussian: "High-dimensional queries, machine learning, when approximate DP is acceptable",
  },
  {
    aspect: "Strengths",
    laplace: "Pure privacy guarantee (no \u03B4 failure probability); simpler analysis; well-suited for scalar queries",
    gaussian: "Lower noise in high dimensions; composes well with subsampling amplification; standard in ML/DP literature",
  },
  {
    aspect: "Weaknesses",
    laplace: "Heavier tails than Gaussian; may add more noise in high-dimensional settings (L1 vs L2)",
    gaussian: "Requires \u03B4 > 0 (small probability of guarantee failure); more complex calibration",
  },
] as const;

export default function ComparePage() {
  const [epsilon, setEpsilon] = useState(1.0);
  const [delta, setDelta] = useState(1e-5);
  const [sensitivity, setSensitivity] = useState(1.0);

  const { b, sigma, pdfData } = useMemo(() => {
    const bVal = sensitivity / epsilon;
    const sigmaVal =
      (sensitivity * Math.sqrt(2 * Math.log(1.25 / delta))) / epsilon;
    const spread = Math.max(bVal, sigmaVal) * 5;
    const numPoints = 200;
    const points = Array.from({ length: numPoints }, (_, i) => {
      const x = -spread + (2 * spread * i) / (numPoints - 1);
      return {
        x: parseFloat(x.toFixed(4)),
        laplace: laplacePdf(x, bVal),
        gaussian: gaussianPdf(x, sigmaVal),
      };
    });
    return { b: bVal, sigma: sigmaVal, pdfData: points };
  }, [epsilon, delta, sensitivity]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Home</Link>
        <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Compare</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
        <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">Appendix</Link>
        <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">References</Link>
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">Methodology</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">Laplace vs. Gaussian Mechanism</h1>

        {/* A) When to use which */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-200">When to Use Each Mechanism</h2>
          <p className="text-sm text-gray-400">
            The <strong className="text-gray-300">Laplace mechanism</strong> provides pure \u03B5-differential privacy and is calibrated using L1 sensitivity. It is the standard choice for scalar queries and scenarios requiring the strongest privacy formulation.
          </p>
          <p className="text-sm text-gray-400">
            The <strong className="text-gray-300">Gaussian mechanism</strong> provides approximate (\u03B5, \u03B4)-differential privacy and is calibrated using L2 sensitivity. It is preferred for high-dimensional queries and in machine learning applications where approximate DP is acceptable.
          </p>
        </section>

        {/* B) Side-by-side table */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Comparison Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="py-2 px-3 font-semibold text-gray-400">Aspect</th>
                  <th className="py-2 px-3 font-semibold text-indigo-400">Laplace</th>
                  <th className="py-2 px-3 font-semibold text-pink-400">Gaussian</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.aspect} className="border-b border-gray-800">
                    <td className="py-2 px-3 text-gray-400 font-medium">{row.aspect}</td>
                    <td className="py-2 px-3">{"laplaceLatex" in row ? <MathTex>{row.laplaceLatex}</MathTex> : row.laplace}</td>
                    <td className="py-2 px-3">{"gaussianLatex" in row ? <MathTex>{row.gaussianLatex}</MathTex> : row.gaussian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* C) Interactive mini-demo */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200">Interactive Comparison</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                \u03B5 (privacy budget)
              </label>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={epsilon}
                onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <span className="text-xs text-gray-400">\u03B5 = {epsilon.toFixed(1)}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                \u03B4 (for Gaussian)
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
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                \u0394f (sensitivity)
              </label>
              <input
                type="number"
                min={0.1}
                max={100}
                step={0.1}
                value={sensitivity}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (v > 0) setSensitivity(v);
                }}
                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Computed parameters */}
          <div className="bg-gray-900 border border-gray-700 rounded p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Laplace scale:</span>{" "}
              <span className="font-mono text-indigo-300">b = {b.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-gray-500">Gaussian \u03C3:</span>{" "}
              <span className="font-mono text-pink-300">\u03C3 = {sigma.toFixed(4)}</span>
            </div>
          </div>

          {/* Overlay PDF chart */}
          <div className="bg-gray-900 border border-gray-700 rounded p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Noise PDF Overlay
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={pdfData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    tickFormatter={(v) => v.toFixed(1)}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    label={{
                      value: "Noise",
                      position: "insideBottom",
                      offset: -2,
                      fill: "#9ca3af",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    tickFormatter={(v) => v.toFixed(3)}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      typeof value === "number" ? value.toFixed(5) : value,
                      name === "laplace" ? "Laplace" : "Gaussian",
                    ]}
                    labelFormatter={(label) =>
                      `Noise: ${Number(label).toFixed(3)}`
                    }
                    contentStyle={{
                      background: "#1f2937",
                      border: "1px solid #374151",
                      color: "#f9fafb",
                    }}
                  />
                  <Legend />
                  <ReferenceLine x={0} stroke="#6366f1" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="laplace"
                    stroke="#818cf8"
                    dot={false}
                    strokeWidth={2}
                    name="Laplace"
                  />
                  <Line
                    type="monotone"
                    dataKey="gaussian"
                    stroke="#f472b6"
                    dot={false}
                    strokeWidth={2}
                    name="Gaussian"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              The Laplace distribution has heavier tails than the Gaussian. At the same privacy budget, the relative noise levels depend on the sensitivity norm and the choice of \u03B4.
            </p>
          </div>
        </section>

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
