"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import ControlPanel from "./ControlPanel";
import ResultsPanel from "./ResultsPanel";
import ModeToggle from "./ModeToggle";
import { DATASETS } from "@/lib/datasets";
import type { DatasetId } from "@/lib/datasets";
import type { QueryType, SimRequest, SimResponse } from "@/lib/dp/types";
import { defaultSensitivity } from "@/lib/dp/utils";
import { simulate } from "@/lib/dp/wasmClient";

const NoisePdfChart = dynamic(() => import("./charts/NoisePdfChart"), { ssr: false });
const NoisyResultsHistogram = dynamic(() => import("./charts/NoisyResultsHistogram"), { ssr: false });
const UtilityVsEpsilonChart = dynamic(() => import("./charts/UtilityVsEpsilonChart"), { ssr: false });

export default function Simulator() {
  const [isAcademic, setIsAcademic] = useState(false);
  const [datasetId, setDatasetId] = useState<DatasetId>("small_integers");
  const [queryType, setQueryType] = useState<QueryType>("sum");
  const [epsilon, setEpsilon] = useState(1.0);
  const [sensitivity, setSensitivity] = useState(() => {
    const ds = DATASETS.find((d) => d.id === "small_integers")!;
    return defaultSensitivity("sum", ds.values);
  });
  const [runs, setRuns] = useState(100);
  const [seed, setSeed] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [result, setResult] = useState<SimResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentDataset = DATASETS.find((d) => d.id === datasetId)!;

  useEffect(() => {
    setSensitivity(defaultSensitivity(queryType, currentDataset.values));
  }, [queryType, datasetId]);

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      const req: SimRequest = {
        values: currentDataset.values,
        queryType,
        epsilon,
        sensitivity,
        runs,
        seed: seed.trim() ? BigInt(seed.trim()) : undefined,
      };
      const res = await simulate(req);
      setResult(res);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  }, [currentDataset, queryType, epsilon, sensitivity, runs, seed]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSimulation();
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [runSimulation]);

  const baseRequest: SimRequest = {
    values: currentDataset.values,
    queryType,
    epsilon,
    sensitivity,
    runs,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-400">ε EpsilonLab</h1>
          <p className="text-xs text-gray-500">Differential Privacy Simulator</p>
        </div>
        <ModeToggle isAcademic={isAcademic} onChange={setIsAcademic} />
      </header>

      {/* Mode description */}
      {!isAcademic && (
        <div className="px-6 py-3 bg-gray-900 border-b border-gray-800 text-sm text-gray-400">
          <strong className="text-gray-200">Student Mode:</strong> Explore how differential privacy adds noise to protect individual data. Adjust ε to see the privacy-utility tradeoff.
        </div>
      )}
      {isAcademic && (
        <div className="px-6 py-3 bg-gray-900 border-b border-gray-800 text-sm text-indigo-300 font-mono">
          <strong>Academic Mode:</strong> M(x) = f(x) + Lap(Δf/ε) &nbsp;|&nbsp; ε-differential privacy guarantees Pr[M(x)∈S] ≤ e^ε · Pr[M(x&apos;)∈S] for all adjacent x, x&apos;
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-sm text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-1 bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h2 className="text-base font-semibold text-gray-200 mb-4">Controls</h2>
            <ControlPanel
              datasetId={datasetId}
              queryType={queryType}
              epsilon={epsilon}
              sensitivity={sensitivity}
              runs={runs}
              seed={seed}
              advancedOpen={advancedOpen}
              onDatasetChange={setDatasetId}
              onQueryChange={setQueryType}
              onEpsilonChange={setEpsilon}
              onSensitivityChange={setSensitivity}
              onRunsChange={setRuns}
              onSeedChange={setSeed}
              onAdvancedToggle={() => setAdvancedOpen((o) => !o)}
              onRun={runSimulation}
              isRunning={isRunning}
              isAcademic={isAcademic}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h2 className="text-base font-semibold text-gray-200 mb-4">Results</h2>
            <ResultsPanel result={result} isAcademic={isAcademic} />
          </div>
        </div>

        {/* Charts */}
        {result && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Laplace Noise PDF
                {isAcademic && <span className="text-indigo-400 font-mono ml-2">f(x) = (1/2b)e^(-|x|/b)</span>}
              </h3>
              <NoisePdfChart scale={result.scale} trueValue={result.trueValue} />
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Noisy Results Distribution
                {isAcademic && <span className="text-indigo-400 font-mono ml-2">histogram of f̃(x)</span>}
              </h3>
              <NoisyResultsHistogram noisyValues={result.noisyValues} trueValue={result.trueValue} />
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                Utility vs. ε
                {isAcademic && <span className="text-indigo-400 font-mono ml-2">E[|error|] = b = Δf/ε</span>}
              </h3>
              <UtilityVsEpsilonChart baseRequest={baseRequest} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
