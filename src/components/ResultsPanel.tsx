"use client";

import type { Mechanism, SimResponse } from "@/lib/dp/types";
import { formatNumber } from "@/lib/dp/utils";

interface Props {
  result: SimResponse | null;
  isAcademic: boolean;
  mechanism: Mechanism;
}

/** A single highlighted metric card. */
function MetricCard({
  label,
  value,
  formula,
  accent = false,
}: {
  label: string;
  value: string;
  formula?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 border ${
        accent
          ? "bg-indigo-950/40 border-indigo-700/50"
          : "bg-gray-800/60 border-gray-700/50"
      }`}
    >
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      {formula && (
        <div className="text-xs font-mono text-indigo-400 mb-1">{formula}</div>
      )}
      <div
        className={`text-xl font-mono font-semibold tabular-nums ${
          accent ? "text-indigo-200" : "text-gray-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/** A row of small stat cells (min/median/max/mean/stddev). */
function StatGrid({
  title,
  formula,
  summary,
}: {
  title: string;
  formula?: string;
  summary: SimResponse["noisySummary"];
}) {
  const cells = [
    { label: "Min", v: summary.min },
    { label: "Median", v: summary.median },
    { label: "Max", v: summary.max },
    { label: "Mean", v: summary.mean },
    { label: "Std Dev", v: summary.stddev },
  ];
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {title}
        </h3>
        {formula && (
          <span className="text-xs font-mono text-indigo-400">{formula}</span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {cells.map(({ label, v }) => (
          <div
            key={label}
            className="bg-gray-800/50 border border-gray-700/40 rounded p-2"
          >
            <div className="text-xs text-gray-500 mb-0.5">{label}</div>
            <div className="text-xs font-mono text-gray-200">
              {formatNumber(v, 3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPanel({ result, isAcademic, mechanism }: Props) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-600">
        <svg
          className="w-8 h-8 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="text-sm">
          Run a simulation to see results
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Primary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="True Value"
          value={formatNumber(result.trueValue)}
          formula={isAcademic ? "f(x)" : undefined}
          accent
        />
        <MetricCard
          label="Mean Noisy Value"
          value={formatNumber(result.noisySummary.mean)}
          formula={isAcademic ? "E[M(x)]" : undefined}
        />
        {mechanism === "gaussian" && result.sigma != null ? (
          <MetricCard
            label="Gaussian σ"
            value={formatNumber(result.sigma)}
            formula={isAcademic ? "σ = Δf·√(2ln(1.25/δ))/ε" : undefined}
          />
        ) : (
          <MetricCard
            label="Laplace Scale b"
            value={formatNumber(result.scale)}
            formula={isAcademic ? "b = Δf/ε" : undefined}
          />
        )}
        <MetricCard
          label="Mean |Error|"
          value={formatNumber(result.absErrorSummary.mean)}
          formula={isAcademic ? (mechanism === "laplace" ? "E[|η|] ≈ b" : "E[|η|] ≈ σ·√(2/π)") : undefined}
        />
      </div>

      {/* Distribution summaries */}
      <StatGrid
        title="Noisy output distribution"
        formula={isAcademic ? "f(x) + Lap(b)" : undefined}
        summary={result.noisySummary}
      />
      <StatGrid
        title="Absolute error distribution"
        formula={isAcademic ? "|M(x) − f(x)|" : undefined}
        summary={result.absErrorSummary}
      />

      {/* Academic formula box */}
      {isAcademic && mechanism === "laplace" && (
        <div className="rounded-lg border border-indigo-700/40 bg-indigo-950/30 p-4 text-xs font-mono space-y-1">
          <p className="text-indigo-300 font-semibold text-sm mb-2">
            Laplace Mechanism Summary
          </p>
          <p className="text-gray-300">M(x) = f(x) + Lap(Δf/ε)</p>
          <p className="text-gray-400">
            b = Δf/ε = {formatNumber(result.scale, 6)}
          </p>
          <p className="text-gray-400">
            E[|η|] = b ={" "}
            {formatNumber(result.scale, 6)}
          </p>
          <p className="text-gray-400">
            Var[η] = 2b² ={" "}
            {formatNumber(2 * result.scale * result.scale, 6)}
          </p>
          <p className="text-gray-400">
            Std[η] = b√2 ={" "}
            {formatNumber(result.scale * Math.sqrt(2), 6)}
          </p>
        </div>
      )}
      {isAcademic && mechanism === "gaussian" && result.sigma != null && (
        <div className="rounded-lg border border-indigo-700/40 bg-indigo-950/30 p-4 text-xs font-mono space-y-1">
          <p className="text-indigo-300 font-semibold text-sm mb-2">
            Gaussian Mechanism Summary
          </p>
          <p className="text-gray-300">M(x) = f(x) + N(0, σ²)</p>
          <p className="text-gray-400">
            σ = Δf·√(2ln(1.25/δ))/ε = {formatNumber(result.sigma, 6)}
          </p>
          {result.delta != null && (
            <p className="text-gray-400">
              δ = {result.delta.toExponential(2)}
            </p>
          )}
          <p className="text-gray-400">
            E[|η|] = σ·√(2/π) ={" "}
            {formatNumber(result.sigma * Math.sqrt(2 / Math.PI), 6)}
          </p>
          <p className="text-gray-400">
            Var[η] = σ² ={" "}
            {formatNumber(result.sigma * result.sigma, 6)}
          </p>
        </div>
      )}
    </div>
  );
}
