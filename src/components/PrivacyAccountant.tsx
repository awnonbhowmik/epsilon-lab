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
  Legend,
} from "recharts";

type MechanismType = "laplace" | "gaussian";

/**
 * Privacy Accountant component — basic RDP-based budget tracking.
 *
 * Tracks cumulative privacy loss when multiple queries are executed using a
 * simplified Rényi Differential Privacy model.
 *
 * NOTE: This is educational, not production-grade accounting.
 */
export default function PrivacyAccountant() {
  const [mechanism, setMechanism] = useState<MechanismType>("laplace");
  const [epsilon, setEpsilon] = useState(0.5);
  const [delta, setDelta] = useState(1e-5);
  const [numQueries, setNumQueries] = useState(10);
  const [budget, setBudget] = useState(5.0);

  const data = useMemo(() => {
    return Array.from({ length: numQueries }, (_, i) => {
      const k = i + 1;
      // Basic composition: ε_total = k * ε
      const epsBasic = k * epsilon;
      // Simplified RDP-based estimate: ε_total ≈ ε * √(2k * ln(1/δ))
      const epsRdp =
        delta > 0
          ? epsilon * Math.sqrt(2 * k * Math.log(1 / delta))
          : epsBasic;
      // δ_total under basic composition
      const deltaTotal = k * delta;
      return {
        k,
        epsBasic: parseFloat(epsBasic.toFixed(6)),
        epsRdp: parseFloat(Math.min(epsRdp, epsBasic).toFixed(6)),
        deltaTotal: parseFloat(deltaTotal.toExponential(2)),
      };
    });
  }, [epsilon, delta, numQueries]);

  const totalEpsBasic = numQueries * epsilon;
  const totalEpsRdp =
    delta > 0
      ? Math.min(
          epsilon * Math.sqrt(2 * numQueries * Math.log(1 / delta)),
          totalEpsBasic,
        )
      : totalEpsBasic;
  const totalDelta = numQueries * delta;
  const consumed = (totalEpsRdp / budget) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-700/40 rounded p-3">
        <p className="text-xs text-yellow-300/80">
          ⚠ Educational privacy accountant — assumptions are simplified. Do not
          use for production privacy guarantees.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Mechanism</label>
          <select
            value={mechanism}
            onChange={(e) => setMechanism(e.target.value as MechanismType)}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="laplace">Laplace</option>
            <option value="gaussian">Gaussian</option>
          </select>
        </div>
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
          <label className="block text-sm font-semibold text-gray-300 mb-1">Number of queries</label>
          <input
            type="range"
            min={1}
            max={50}
            step={1}
            value={numQueries}
            onChange={(e) => setNumQueries(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <span className="text-xs text-gray-400">k = {numQueries}</span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">Privacy budget (ε target)</label>
          <input
            type="number"
            min={0.1}
            max={100}
            step={0.5}
            value={budget}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (v > 0) setBudget(v);
            }}
            className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Results summary */}
      <div className="bg-gray-900 border border-gray-700 rounded p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Total ε (basic)</p>
          <p className="font-mono text-indigo-200">{totalEpsBasic.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total ε (RDP est.)</p>
          <p className="font-mono text-indigo-200">{totalEpsRdp.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Total δ</p>
          <p className="font-mono text-indigo-200">{totalDelta.toExponential(2)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Budget consumed</p>
          <p className={`font-mono ${consumed > 100 ? "text-red-400" : "text-green-400"}`}>
            {consumed.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-700 rounded p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
          Privacy Budget vs. Number of Queries
        </h3>
        <div className="w-full h-64">
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
                dataKey="epsBasic"
                stroke="#818cf8"
                dot={false}
                strokeWidth={2}
                name="Basic composition"
              />
              <Line
                type="monotone"
                dataKey="epsRdp"
                stroke="#34d399"
                dot={false}
                strokeWidth={2}
                name="RDP estimate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assumptions */}
      <div className="bg-gray-900 border border-gray-700 rounded p-4 text-xs text-gray-400 space-y-1">
        <p className="font-semibold text-gray-300">Assumptions:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>All queries use the same mechanism ({mechanism}) with identical ε and δ.</li>
          <li>Basic composition: ε_total = k·ε, δ_total = k·δ.</li>
          <li>RDP estimate: ε_total ≈ ε·√(2k·ln(1/δ)) — simplified educational bound.</li>
          <li>Real RDP accounting converts Rényi divergences and is tighter for large k.</li>
        </ul>
      </div>
    </div>
  );
}
