"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { useDebouncedValue } from "@/lib/dp/useDebouncedValue";
import {
  encodeShareState,
  decodeShareState,
} from "@/lib/share/urlState";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRef = useRef(true);

  // Decode URL state once on mount.
  const urlState = useMemo(
    () => decodeShareState(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [isAcademic, setIsAcademic] = useState(urlState.mode === "academic");
  const [datasetId, setDatasetId] = useState<DatasetId>(
    urlState.datasetId ?? "small_integers",
  );
  const [queryType, setQueryType] = useState<QueryType>(
    urlState.queryType ?? "sum",
  );
  const [epsilon, setEpsilon] = useState(urlState.epsilon ?? 1.0);
  const [sensitivity, setSensitivity] = useState(() => {
    if (urlState.sensitivity !== undefined) return urlState.sensitivity;
    const dsId = urlState.datasetId ?? "small_integers";
    const qt = urlState.queryType ?? "sum";
    const ds = DATASETS.find((d) => d.id === dsId)!;
    return defaultSensitivity(qt, ds.values);
  });
  const [runs, setRuns] = useState(urlState.runs ?? 100);
  const [seed, setSeed] = useState(urlState.seed ?? "");
  const [advancedOpen, setAdvancedOpen] = useState(
    urlState.advancedSensitivity ?? false,
  );
  const [result, setResult] = useState<SimResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Debounce sensitivity changes so the utility curve isn't recomputed on every tick.
  const debouncedSensitivity = useDebouncedValue(sensitivity, 300);

  const currentDataset = DATASETS.find((d) => d.id === datasetId)!;

  const parsedSeed = useMemo(() => {
    const trimmed = seed.trim();
    if (!trimmed) return undefined;
    try {
      return BigInt(trimmed);
    } catch {
      return undefined;
    }
  }, [seed]);

  // Reset sensitivity default when query type or dataset changes (skip on initial mount if URL provided values).
  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    setSensitivity(defaultSensitivity(queryType, currentDataset.values));
  }, [queryType, datasetId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state → URL (debounced, replace so no history entries).
  useEffect(() => {
    if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    urlDebounceRef.current = setTimeout(() => {
      const params = encodeShareState({
        datasetId,
        queryType,
        epsilon,
        sensitivity,
        runs,
        seed: seed || undefined,
        mode: isAcademic ? "academic" : "student",
        advancedSensitivity: advancedOpen,
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => {
      if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    };
  }, [datasetId, queryType, epsilon, sensitivity, runs, seed, isAcademic, advancedOpen, router]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      /* clipboard API may fail in insecure contexts — ignore */
    }
  }, []);

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    try {
      if (seed.trim() && parsedSeed === undefined) {
        throw new Error(
          `Invalid seed "${seed.trim()}" — must be a non-negative integer`
        );
      }

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
  }, [currentDataset, queryType, epsilon, sensitivity, runs, seed, parsedSeed]);

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

  const handleExportPng = useCallback(async () => {
    const { toPng } = await import("html-to-image");
    // Build a temporary off-screen container with metrics + charts + footer
    const container = document.createElement("div");
    container.style.cssText =
      "background:#030712;color:#f3f4f6;padding:24px;width:1200px;position:absolute;left:-9999px;top:0";
    document.body.appendChild(container);
    try {
      if (exportRef.current) {
        container.appendChild(exportRef.current.cloneNode(true));
      }
      if (chartsRef.current) {
        container.appendChild(chartsRef.current.cloneNode(true));
      }
      const footer = document.createElement("div");
      footer.style.cssText =
        "margin-top:16px;padding-top:12px;border-top:1px solid #374151;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af";
      footer.innerHTML = `<span>EpsilonLab</span><span>${new Date().toLocaleDateString()}</span>`;
      container.appendChild(footer);

      const dataUrl = await toPng(container, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `epsilonlab_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      document.body.removeChild(container);
    }
  }, []);

  const handleExportPdf = useCallback(() => {
    window.print();
  }, []);

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
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              📋 Copy link
            </button>
            {copyToast && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-green-700 px-2 py-1 text-xs text-white shadow-lg z-50">
                Link copied!
              </span>
            )}
          </div>
          <ModeToggle isAcademic={isAcademic} onChange={setIsAcademic} />
        </div>
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

          {/* Right: results + export buttons */}
          <div className="flex-1 min-w-0 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Simulation Results
              </h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPng}
                    className="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Export PNG
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              )}
            </div>
            <div ref={exportRef}>
              <ResultsPanel result={result} isAcademic={isAcademic} />
            </div>
          </div>
        </div>

        {/* Charts row (inside exportRef for export) */}
        {result && (
          <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                Laplace Noise PDF
              </h3>
              {isAcademic && (
                <p className="text-xs font-mono text-indigo-400 mb-3">
                  b = Δf/ε = {result.scale.toFixed(4)},&nbsp;&nbsp;p(η) = (1/2b) · exp(−|η|/b)
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  Shape of the random noise added to the query answer
                </p>
              )}
              <NoisePdfChart scale={result.scale} />
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
                  E[|η|] = b = Δf/ε — error decreases as ε increases
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  How accuracy changes as you vary the privacy budget
                </p>
              )}
              <UtilityVsEpsilonChart
                values={currentDataset.values}
                queryType={queryType}
                sensitivity={debouncedSensitivity}
                seed={parsedSeed}
              />
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
