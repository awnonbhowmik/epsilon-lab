"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Mechanism } from "@/lib/dp/types";

interface Props {
  mechanism: Mechanism;
  isAcademic: boolean;
}

export default function CompositionPanel({ mechanism, isAcademic }: Props) {
  const [numQueries, setNumQueries] = useState(5);
  const [perQueryEpsilon, setPerQueryEpsilon] = useState(0.5);
  const [perQueryDelta, setPerQueryDelta] = useState(1e-5);

  const tableData = useMemo(() => {
    const rows = [];
    for (let k = 1; k <= numQueries; k++) {
      const epsTotal = k * perQueryEpsilon;
      const deltaTotal = mechanism === "gaussian" ? k * perQueryDelta : undefined;
      rows.push({ k, epsTotal, deltaTotal });
    }
    return rows;
  }, [numQueries, perQueryEpsilon, perQueryDelta, mechanism]);

  const chartData = useMemo(() => {
    return tableData.map((r) => ({
      k: r.k,
      epsTotal: parseFloat(r.epsTotal.toFixed(4)),
    }));
  }, [tableData]);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 space-y-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
        Sequential Composition
      </h2>

      {/* Explanation */}
      {!isAcademic && (
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            When you ask <strong>multiple</strong> queries on the same dataset, the
            privacy cost adds up. If each query uses ε of your privacy budget,
            then <em>k</em> queries use <em>k × ε</em> total.
          </p>
          <p>
            This is called <strong>sequential composition</strong> — the simplest way
            to account for repeated access to the same data.
          </p>
        </div>
      )}
      {isAcademic && (
        <div className="text-sm text-gray-300 font-mono space-y-2 bg-gray-950 border border-gray-700 rounded p-3">
          <p className="text-indigo-300 font-semibold">Basic Sequential Composition Theorem</p>
          <p>
            If mechanisms M₁, …, Mₖ satisfy εᵢ-DP respectively (and δᵢ-DP for
            the Gaussian case), their sequential composition satisfies:
          </p>
          <p className="text-indigo-200">
            ε_total = Σᵢ εᵢ{mechanism === "gaussian" && ", δ_total = Σᵢ δᵢ"}
          </p>
          <p className="text-xs text-gray-500">
            Note: Advanced composition (Dwork et al., 2010) provides tighter bounds
            but is not yet implemented in this teaching tool.
          </p>
        </div>
      )}

      {/* Controls */}
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
            value={numQueries}
            onChange={(e) => setNumQueries(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="text-xs text-gray-400">k = {numQueries}</span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Per-query ε
          </label>
          <input
            type="number"
            min={0.01}
            max={10}
            step={0.1}
            value={perQueryEpsilon}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (v > 0 && v <= 10) setPerQueryEpsilon(v);
            }}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {mechanism === "gaussian" && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Per-query δ
            </label>
            <input
              type="number"
              min={1e-10}
              max={0.1}
              step={1e-6}
              value={perQueryDelta}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (v > 0 && v < 1) setPerQueryDelta(v);
              }}
              className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            ε_total vs. k
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                  formatter={(value) => [typeof value === "number" ? value.toFixed(4) : value, "ε_total"]}
                  labelFormatter={(label) => `k = ${label}`}
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
                />
                <Line
                  type="monotone"
                  dataKey="epsTotal"
                  stroke="#818cf8"
                  dot={{ r: 3, fill: "#818cf8" }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Composition Table
          </h3>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-xs text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-1 px-2">k</th>
                  <th className="text-left py-1 px-2">ε_total</th>
                  {mechanism === "gaussian" && <th className="text-left py-1 px-2">δ_total</th>}
                </tr>
              </thead>
              <tbody>
                {tableData.map((r) => (
                  <tr key={r.k} className="border-b border-gray-800">
                    <td className="py-1 px-2">{r.k}</td>
                    <td className="py-1 px-2 font-mono">{r.epsTotal.toFixed(4)}</td>
                    {mechanism === "gaussian" && (
                      <td className="py-1 px-2 font-mono">{r.deltaTotal?.toExponential(2)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
