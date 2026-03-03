"use client";

import type { SimResponse } from "@/lib/dp/types";
import { formatNumber } from "@/lib/dp/utils";

interface Props {
  result: SimResponse | null;
  isAcademic: boolean;
}

function StatRow({ label, value, formula }: { label: string; value: string; formula?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400">{label}</span>
      {formula && <span className="text-xs text-indigo-400 font-mono">{formula}</span>}
      <span className="text-lg font-mono font-semibold text-gray-100">{value}</span>
    </div>
  );
}

export default function ResultsPanel({ result, isAcademic }: Props) {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
        Run a simulation to see results
      </div>
    );
  }

  const sampleNoisyMean = result.noisySummary.mean;
  const sampleAbsError = result.absErrorSummary.mean;

  return (
    <div className="flex flex-col gap-5">
      {/* Core stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatRow
          label="True Value"
          value={formatNumber(result.trueValue)}
          formula={isAcademic ? "f(x)" : undefined}
        />
        <StatRow
          label="Mean Noisy Value"
          value={formatNumber(sampleNoisyMean)}
          formula={isAcademic ? "f(x) + Lap(b)" : undefined}
        />
        <StatRow
          label="Laplace Scale (b)"
          value={formatNumber(result.scale)}
          formula={isAcademic ? "b = Δf/ε" : undefined}
        />
        <StatRow
          label="Mean |Error|"
          value={formatNumber(sampleAbsError)}
          formula={isAcademic ? "E[|f̃(x) - f(x)|] ≈ b" : undefined}
        />
      </div>

      {/* Noisy Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Noisy Output Distribution
          {isAcademic && <span className="text-indigo-400 font-mono ml-2">(f(x) + Lap(b))</span>}
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[
            { label: "Min", value: formatNumber(result.noisySummary.min) },
            { label: "Median", value: formatNumber(result.noisySummary.median) },
            { label: "Max", value: formatNumber(result.noisySummary.max) },
            { label: "Mean", value: formatNumber(result.noisySummary.mean) },
            { label: "Std Dev", value: formatNumber(result.noisySummary.stddev) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">{label}</div>
              <div className="font-mono text-gray-100">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Summary */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-2">
          Absolute Error Distribution
          {isAcademic && <span className="text-indigo-400 font-mono ml-2">(|f̃(x) - f(x)|)</span>}
        </h3>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[
            { label: "Min", value: formatNumber(result.absErrorSummary.min) },
            { label: "Median", value: formatNumber(result.absErrorSummary.median) },
            { label: "Max", value: formatNumber(result.absErrorSummary.max) },
            { label: "Mean", value: formatNumber(result.absErrorSummary.mean) },
            { label: "Std Dev", value: formatNumber(result.absErrorSummary.stddev) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded p-2">
              <div className="text-xs text-gray-400">{label}</div>
              <div className="font-mono text-gray-100">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {isAcademic && (
        <div className="bg-gray-800 border border-gray-700 rounded p-3 text-xs font-mono text-gray-300">
          <p className="text-indigo-300 font-semibold mb-1">Laplace Mechanism:</p>
          <p>M(x) = f(x) + Lap(Δf/ε)</p>
          <p className="mt-1 text-gray-400">E[|noise|] = b = Δf/ε = {formatNumber(result.scale, 4)}</p>
          <p className="text-gray-400">Var[noise] = 2b² = {formatNumber(2 * result.scale * result.scale, 4)}</p>
        </div>
      )}
    </div>
  );
}
