"use client";

import { DATASETS } from "@/lib/datasets";
import type { DatasetId } from "@/lib/datasets";
import type { QueryType } from "@/lib/dp/types";
import { defaultSensitivity } from "@/lib/dp/utils";

interface Props {
  datasetId: DatasetId;
  queryType: QueryType;
  epsilon: number;
  sensitivity: number;
  runs: number;
  seed: string;
  advancedOpen: boolean;
  onDatasetChange: (id: DatasetId) => void;
  onQueryChange: (q: QueryType) => void;
  onEpsilonChange: (e: number) => void;
  onSensitivityChange: (s: number) => void;
  onRunsChange: (r: number) => void;
  onSeedChange: (s: string) => void;
  onAdvancedToggle: () => void;
  onRun: () => void;
  isRunning: boolean;
  isAcademic: boolean;
}

export default function ControlPanel({
  datasetId,
  queryType,
  epsilon,
  sensitivity,
  runs,
  seed,
  advancedOpen,
  onDatasetChange,
  onQueryChange,
  onEpsilonChange,
  onSensitivityChange,
  onRunsChange,
  onSeedChange,
  onAdvancedToggle,
  onRun,
  isRunning,
  isAcademic,
}: Props) {
  const currentDataset = DATASETS.find((d) => d.id === datasetId)!;

  return (
    <div className="flex flex-col gap-5">
      {/* Dataset */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">Dataset</label>
        <select
          value={datasetId}
          onChange={(e) => onDatasetChange(e.target.value as DatasetId)}
          className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {DATASETS.map((ds) => (
            <option key={ds.id} value={ds.id}>{ds.label}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{currentDataset.description}</p>
        {isAcademic && (
          <p className="text-xs text-indigo-400 mt-1 font-mono">
            n = {currentDataset.values.length}, values ∈ [{Math.min(...currentDataset.values).toFixed(2)}, {Math.max(...currentDataset.values).toFixed(2)}]
          </p>
        )}
      </div>

      {/* Query */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">Query</label>
        <select
          value={queryType}
          onChange={(e) => onQueryChange(e.target.value as QueryType)}
          className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="sum">Sum</option>
          <option value="mean">Mean</option>
          <option value="count">Count</option>
        </select>
        {!isAcademic && (
          <p className="text-xs text-gray-500 mt-1">
            {queryType === "sum" ? "Total sum of all values" : queryType === "mean" ? "Average of all values" : "Number of records"}
          </p>
        )}
        {isAcademic && (
          <p className="text-xs text-indigo-400 mt-1 font-mono">
            {queryType === "sum" ? "f(x) = Σxᵢ" : queryType === "mean" ? "f(x) = (1/n)Σxᵢ" : "f(x) = |x|"}
          </p>
        )}
      </div>

      {/* Epsilon */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Privacy Budget (ε)
          {isAcademic && <span className="text-indigo-400 font-mono"> — controls noise level</span>}
        </label>
        {!isAcademic && (
          <p className="text-xs text-gray-500 mb-2">
            Lower ε = more privacy, more noise. Higher ε = less privacy, less noise.
          </p>
        )}
        {isAcademic && (
          <p className="text-xs text-indigo-400 mb-2 font-mono">
            Laplace scale b = Δf/ε &nbsp;|&nbsp; Pr[output ∈ S] ≤ e^ε · Pr[output ∈ S | adjacent input]
          </p>
        )}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={epsilon}
            onChange={(e) => onEpsilonChange(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={epsilon}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (v > 0 && v <= 10) onEpsilonChange(v);
            }}
            className="w-20 bg-gray-800 border border-gray-600 text-gray-100 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Runs */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">Simulation Runs</label>
        {!isAcademic && <p className="text-xs text-gray-500 mb-2">More runs = smoother histogram</p>}
        {isAcademic && <p className="text-xs text-indigo-400 mb-2 font-mono">Monte Carlo samples for empirical error distribution</p>}
        <div className="flex gap-2">
          {[50, 100, 500].map((r) => (
            <button
              key={r}
              onClick={() => onRunsChange(r)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                runs === r
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced toggle */}
      <div>
        <button
          onClick={onAdvancedToggle}
          className="text-sm text-indigo-400 hover:text-indigo-300 underline focus:outline-none"
        >
          {advancedOpen ? "▼" : "▶"} Advanced Settings
        </button>
        {advancedOpen && (
          <div className="mt-3 flex flex-col gap-3 pl-2 border-l-2 border-gray-700">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Sensitivity (Δf)
                {isAcademic && <span className="text-indigo-400 font-mono"> = max |f(x) - f(x&apos;)|</span>}
              </label>
              <input
                type="number"
                min={0.001}
                step={0.1}
                value={sensitivity}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (v > 0) onSensitivityChange(v);
                }}
                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Seed (optional)
                {isAcademic && <span className="text-indigo-400 font-mono"> — for reproducibility</span>}
              </label>
              <input
                type="text"
                placeholder="Leave empty for random"
                value={seed}
                onChange={(e) => onSeedChange(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isRunning}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {isRunning ? "Running…" : "Run Simulation"}
      </button>
    </div>
  );
}
