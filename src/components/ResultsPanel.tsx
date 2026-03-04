"use client";

import type { Mechanism, SimResponse } from "@/lib/dp/types";
import { formatNumber } from "@/lib/dp/utils";
import MathTex from "./Math";

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
        <div className="text-xs text-indigo-400 mb-1"><MathTex>{formula}</MathTex></div>
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
          <span className="text-xs text-indigo-400"><MathTex>{formula}</MathTex></span>
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
          formula={isAcademic ? "\\mathbb{E}[M(x)]" : undefined}
        />
        {mechanism === "gaussian" && result.sigma != null ? (
          <MetricCard
            label="Gaussian σ"
            value={formatNumber(result.sigma)}
            formula={isAcademic ? "\\sigma = \\Delta f \\cdot \\sqrt{2\\ln(1.25/\\delta)}\\,/\\,\\varepsilon" : undefined}
          />
        ) : (
          <MetricCard
            label="Laplace Scale b"
            value={formatNumber(result.scale)}
            formula={isAcademic ? "b = \\Delta f\\,/\\,\\varepsilon" : undefined}
          />
        )}
        <MetricCard
          label="Mean |Error|"
          value={formatNumber(result.absErrorSummary.mean)}
          formula={isAcademic ? (mechanism === "laplace" ? "\\mathbb{E}[|\\eta|] \\approx b" : "\\mathbb{E}[|\\eta|] \\approx \\sigma\\sqrt{2/\\pi}") : undefined}
        />
      </div>

      {/* Distribution summaries */}
      <StatGrid
        title="Noisy output distribution"
        formula={isAcademic ? "f(x) + \\text{Lap}(b)" : undefined}
        summary={result.noisySummary}
      />
      <StatGrid
        title="Absolute error distribution"
        formula={isAcademic ? "|M(x) - f(x)|" : undefined}
        summary={result.absErrorSummary}
      />

      {/* Academic formula box */}
      {isAcademic && mechanism === "laplace" && (
        <div className="rounded-lg border border-indigo-700/40 bg-indigo-950/30 p-4 text-xs space-y-1">
          <p className="text-indigo-300 font-semibold text-sm mb-2">
            Laplace Mechanism Summary
          </p>
          <p className="text-gray-300"><MathTex>{"M(x) = f(x) + \\text{Lap}(\\Delta f\\,/\\,\\varepsilon)"}</MathTex></p>
          <p className="text-gray-400">
            <MathTex>{"b = \\Delta f\\,/\\,\\varepsilon"}</MathTex>{" = "}
            {formatNumber(result.scale, 6)}
          </p>
          <p className="text-gray-400">
            <MathTex>{"\\mathbb{E}[|\\eta|] = b"}</MathTex>{" = "}
            {formatNumber(result.scale, 6)}
          </p>
          <p className="text-gray-400">
            <MathTex>{"\\text{Var}[\\eta] = 2b^2"}</MathTex>{" = "}
            {formatNumber(2 * result.scale * result.scale, 6)}
          </p>
          <p className="text-gray-400">
            <MathTex>{"\\text{Std}[\\eta] = b\\sqrt{2}"}</MathTex>{" = "}
            {formatNumber(result.scale * Math.sqrt(2), 6)}
          </p>
        </div>
      )}
      {isAcademic && mechanism === "gaussian" && result.sigma != null && (
        <div className="rounded-lg border border-indigo-700/40 bg-indigo-950/30 p-4 text-xs space-y-1">
          <p className="text-indigo-300 font-semibold text-sm mb-2">
            Gaussian Mechanism Summary
          </p>
          <p className="text-gray-300"><MathTex>{"M(x) = f(x) + \\mathcal{N}(0,\\, \\sigma^2)"}</MathTex></p>
          <p className="text-gray-400">
            <MathTex>{"\\sigma = \\Delta f \\cdot \\sqrt{2\\ln(1.25/\\delta)}\\,/\\,\\varepsilon"}</MathTex>{" = "}
            {formatNumber(result.sigma, 6)}
          </p>
          {result.delta != null && (
            <p className="text-gray-400">
              <MathTex>{"\\delta"}</MathTex>{" = "}
              {result.delta.toExponential(2)}
            </p>
          )}
          <p className="text-gray-400">
            <MathTex>{"\\mathbb{E}[|\\eta|] = \\sigma\\sqrt{2/\\pi}"}</MathTex>{" = "}
            {formatNumber(result.sigma * Math.sqrt(2 / Math.PI), 6)}
          </p>
          <p className="text-gray-400">
            <MathTex>{"\\text{Var}[\\eta] = \\sigma^2"}</MathTex>{" = "}
            {formatNumber(result.sigma * result.sigma, 6)}
          </p>
        </div>
      )}
    </div>
  );
}
