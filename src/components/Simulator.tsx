"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import ControlPanel from "./ControlPanel";
import ResultsPanel from "./ResultsPanel";
import ModeToggle from "./ModeToggle";
import TheoryPanel from "./TheoryPanel";
import References from "./References";
import { DATASETS } from "@/lib/datasets";
import type { DatasetId } from "@/lib/datasets";
import type { QueryType, SimRequest, SimResponse } from "@/lib/dp/types";
import { defaultSensitivity } from "@/lib/dp/utils";
import { simulate } from "@/lib/dp/wasmClient";

const NoisePdfChart = dynamic(() => import("./charts/NoisePdfChart"), {
  ssr: false,
});
const NoisyResultsHistogram = dynamic(
  () => import("./charts/NoisyResultsHistogram"),
  { ssr: false }
);
const UtilityVsEpsilonChart = dynamic(
  () => import("./charts/UtilityVsEpsilonChart"),
  { ssr: false }
);

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

  // Reset sensitivity default when query type or dataset changes.
  useEffect(() => {
    setSensitivity(defaultSensitivity(queryType, currentDataset.values));
  }, [queryType, datasetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      const parsedSeed = seed.trim()
        ? (() => {
            try {
              return BigInt(seed.trim());
            } catch {
              throw new Error(
                `Invalid seed "${seed.trim()}" — must be a non-negative integer`
              );
            }
          })()
        : undefined;

      const req: SimRequest = {
        values: currentDataset.values,
        queryType,
        epsilon,
        sensitivity,
        runs,
        seed: parsedSeed,
      };
      const res = await simulate(req);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsRunning(false);
    }
  }, [currentDataset, queryType, epsilon, sensitivity, runs, seed]);

  // Auto-run with 300 ms debounce on any control change.
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
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">
            ε EpsilonLab
          </h1>
          <span className="hidden sm:block text-xs text-gray-500 font-mono">
            Differential Privacy Teaching Simulator
          </span>
        </div>
        <ModeToggle isAcademic={isAcademic} onChange={setIsAcademic} />
      </header>

      {/* ── Mode banner ────────────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-2.5 bg-gray-900 border-b border-gray-800 text-xs">
        {!isAcademic ? (
          <span className="text-gray-400">
            <strong className="text-gray-200">Student mode —</strong> explore
            how differential privacy adds calibrated noise to query answers.
            Drag the ε slider to see the privacy–utility tradeoff live.
          </span>
        ) : (
          <span className="font-mono text-indigo-300">
            <strong>Academic mode —</strong> M(x) = f(x) + Lap(Δf/ε) ·
            Pr[M(x)∈S] ≤ e^ε · Pr[M(x′)∈S] for all adjacent x, x′ and all
            measurable S ⊆ Y
          </span>
        )}
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-6 mt-4 shrink-0 p-3 bg-red-900/40 border border-red-700/60 rounded-lg text-sm text-red-300 flex items-start gap-2">
          <span className="text-red-400 font-bold shrink-0">⚠</span>
          <span>
            <strong className="text-red-200">Error:</strong> {error}
          </span>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 p-6 space-y-6">
        {/* Top row: controls (fixed 320px) + results */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: controls — fixed width on large screens */}
          <aside className="w-full lg:w-80 shrink-0 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Simulation Controls
            </h2>
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
          </aside>

          {/* Right: results */}
          <div className="flex-1 min-w-0 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Simulation Results
            </h2>
            <ResultsPanel result={result} isAcademic={isAcademic} />
          </div>
        </div>

        {/* Charts row */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Laplace Noise PDF
              </h3>
              {isAcademic && (
                <p className="text-xs font-mono text-indigo-400 mb-3">
                  p(η) = (1/2b) · exp(−|η|/b),&nbsp;&nbsp;b = {result.scale.toFixed(4)}
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  Shape of the random noise added to the query answer
                </p>
              )}
              <NoisePdfChart scale={result.scale} trueValue={result.trueValue} />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Noisy Results Distribution
              </h3>
              {isAcademic && (
                <p className="text-xs font-mono text-indigo-400 mb-3">
                  Histogram of M(x) = f(x) + η over {runs} runs
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  Distribution of noisy answers across {runs} simulation runs
                </p>
              )}
              <NoisyResultsHistogram
                noisyValues={result.noisyValues}
                trueValue={result.trueValue}
              />
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Utility vs. ε
              </h3>
              {isAcademic && (
                <p className="text-xs font-mono text-indigo-400 mb-3">
                  E[|η|] = b = Δf/ε → error ∝ 1/ε
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  How accuracy changes as you vary the privacy budget
                </p>
              )}
              <UtilityVsEpsilonChart baseRequest={baseRequest} />
            </div>
          </div>
        )}

        {/* Academic theory section */}
        {isAcademic && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Theoretical Background
            </h2>
            <TheoryPanel />
            <References />
          </section>
        )}
      </main>
    </div>
  );
}
