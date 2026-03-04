"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import ControlPanel from "./ControlPanel";
import ResultsPanel from "./ResultsPanel";
import ModeToggle from "./ModeToggle";
import TheoryPanel from "./TheoryPanel";
import References from "./References";
import { APP_NAME, APP_VERSION } from "@/lib/version";
import CompositionPanel from "./CompositionPanel";
import PresetPicker from "./PresetPicker";
import { DATASETS, type Dataset } from "@/lib/datasets";
import type { DatasetId } from "@/lib/datasets";
import type { Mechanism, QueryType, Topic, SimRequest, SimResponse } from "@/lib/dp/types";
import DatasetUpload from "./DatasetUpload";
import type { DatasetUploadResult } from "./DatasetUpload";
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

export default function Simulator({ embed: embedProp }: { embed?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRef = useRef(true);
  const isEmbed = embedProp || searchParams.get("embed") === "1";

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
  const [mechanism, setMechanism] = useState<Mechanism>(
    urlState.mechanism ?? "laplace",
  );
  const [topic, setTopic] = useState<Topic>(
    urlState.topic ?? "single_query",
  );
  const [epsilon, setEpsilon] = useState(urlState.epsilon ?? 1.0);
  const [delta, setDelta] = useState(urlState.delta ?? 1e-5);
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
  const [customDataset, setCustomDataset] = useState<Dataset | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Debounce sensitivity changes so the utility curve isn't recomputed on every tick.
  const debouncedSensitivity = useDebouncedValue(sensitivity, 300);

  const currentDataset = customDataset && datasetId === ("csv_upload" as DatasetId)
    ? customDataset
    : DATASETS.find((d) => d.id === datasetId)!;

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
        mechanism,
        topic,
        delta: mechanism === "gaussian" ? delta : undefined,
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => {
      if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    };
  }, [datasetId, queryType, epsilon, sensitivity, runs, seed, isAcademic, advancedOpen, mechanism, topic, delta, router]);

  const handleCsvDataset = useCallback((result: DatasetUploadResult) => {
    const ds: Dataset = {
      id: "csv_upload" as DatasetId,
      label: `CSV: ${result.columnName}`,
      description: `Uploaded column "${result.columnName}" (${result.values.length} rows)`,
      values: result.values,
    };
    setCustomDataset(ds);
    setDatasetId("csv_upload" as DatasetId);
    setSensitivity(defaultSensitivity(queryType, result.values));
    setCsvOpen(false);
  }, [queryType]);

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
        mechanism,
        epsilon,
        sensitivity,
        runs,
        seed: parsedSeed,
        delta: mechanism === "gaussian" ? delta : undefined,
      };
      const res = await simulate(req);
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsRunning(false);
    }
  }, [currentDataset, queryType, mechanism, epsilon, sensitivity, runs, seed, parsedSeed, delta]);

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

  const [exporting, setExporting] = useState(false);

  const handleExportPng = useCallback(async () => {
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      // Build a temporary off-screen container with metrics + charts + footer
      const container = document.createElement("div");
      container.style.cssText =
        "background:#ffffff;color:#030712;padding:24px;width:1200px;position:absolute;left:-9999px;top:0";
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
          "margin-top:16px;padding-top:12px;border-top:1px solid #374151;display:flex;justify-content:space-between;font-size:11px;color:#6b7280";
        footer.innerHTML = `<span>EpsilonLab</span><span>${new Date().toLocaleDateString()}</span>`;
        container.appendChild(footer);

        const maxDim = 4096;
        const opts = {
          pixelRatio: 2,
          width: Math.min(container.scrollWidth, maxDim),
          height: Math.min(container.scrollHeight, maxDim),
        };

        let dataUrl: string;
        try {
          dataUrl = await toPng(container, opts);
        } catch {
          // retry once
          dataUrl = await toPng(container, opts);
        }
        const link = document.createElement("a");
        link.download = `epsilonlab_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } finally {
        document.body.removeChild(container);
      }
    } finally {
      setExporting(false);
    }
  }, []);

  const handleExportPdf = useCallback(() => {
    window.print();
  }, []);

  const pdfTitle = mechanism === "gaussian" ? "Gaussian Noise PDF" : "Laplace Noise PDF";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {!isEmbed && (
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-400 no-underline hover:opacity-80 transition-opacity">
              ε EpsilonLab
            </Link>
            <span className="hidden sm:block text-xs text-gray-500 font-mono">
              Differential Privacy Teaching Simulator
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPresetsOpen((o) => !o)}
              className="px-3 py-1.5 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {presetsOpen ? "Close Presets" : "📚 Presets"}
            </button>
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
      )}

      {/* ── Academic page links ────────────────────────────────────────────── */}
      {!isEmbed && (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-1.5 flex flex-wrap gap-4 text-xs">
          <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">Compare</Link>
          <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
          <Link href="/privacy-accounting" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Accounting</Link>
          <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">Appendix</Link>
          <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">References</Link>
          <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">Methodology</Link>
        </nav>
      )}

      {/* ── Preset picker panel ────────────────────────────────────────────── */}
      {!isEmbed && presetsOpen && (
        <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 max-h-96 overflow-y-auto">
          <PresetPicker compact />
        </div>
      )}

      {/* ── Mode banner ────────────────────────────────────────────────────── */}
      {!isEmbed && (
        <div className="shrink-0 px-6 py-2.5 bg-gray-900 border-b border-gray-800 text-xs">
          {!isAcademic ? (
            <span className="text-gray-400">
              <strong className="text-gray-200">Student mode —</strong> explore
              how differential privacy adds calibrated noise to query answers.
              Drag the ε slider to see the privacy–utility tradeoff live.
            </span>
          ) : (
            <span className="font-mono text-indigo-300">
              <strong>Academic mode —</strong>{" "}
              {mechanism === "laplace"
                ? "M(x) = f(x) + Lap(Δf/ε) · Pr[M(x)∈S] ≤ e^ε · Pr[M(x′)∈S] for all adjacent x, x′ and all measurable S ⊆ Y"
                : "M(x) = f(x) + N(0, σ²) · (ε, δ)-DP with σ = Δf·√(2ln(1.25/δ)) / ε"}
            </span>
          )}
        </div>
      )}

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
              mechanism={mechanism}
              topic={topic}
              epsilon={epsilon}
              delta={delta}
              sensitivity={sensitivity}
              runs={runs}
              seed={seed}
              advancedOpen={advancedOpen}
              onDatasetChange={setDatasetId}
              onQueryChange={setQueryType}
              onMechanismChange={setMechanism}
              onTopicChange={setTopic}
              onEpsilonChange={setEpsilon}
              onDeltaChange={setDelta}
              onSensitivityChange={setSensitivity}
              onRunsChange={setRuns}
              onSeedChange={setSeed}
              onAdvancedToggle={() => setAdvancedOpen((o) => !o)}
              onRun={runSimulation}
              isRunning={isRunning}
              isAcademic={isAcademic}
            />

            {/* CSV Upload */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <button
                onClick={() => setCsvOpen((o) => !o)}
                className="text-sm text-indigo-400 hover:text-indigo-300 underline focus:outline-none"
              >
                {csvOpen ? "▼" : "▶"} Upload CSV Dataset
              </button>
              {csvOpen && (
                <div className="mt-3">
                  <DatasetUpload onDatasetReady={handleCsvDataset} />
                </div>
              )}
            </div>
          </aside>

          {/* Right: results + export buttons */}
          <div className="flex-1 min-w-0 bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Simulation Results
              </h2>
              {result && !isEmbed && (
                <div className="flex gap-2 items-center">
                  {exporting && (
                    <span className="text-xs text-indigo-400 animate-pulse">
                      Generating export…
                    </span>
                  )}
                  <button
                    onClick={handleExportPng}
                    disabled={exporting}
                    className="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
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
              <ResultsPanel result={result} isAcademic={isAcademic} mechanism={mechanism} />
            </div>
          </div>
        </div>

        {/* Charts row */}
        {result && topic === "single_query" && (
          <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                {pdfTitle}
              </h3>
              {isAcademic && (
                <p className="text-xs font-mono text-indigo-400 mb-3">
                  {mechanism === "laplace"
                    ? `b = Δf/ε = ${result.scale.toFixed(4)},  p(η) = (1/2b) · exp(−|η|/b)`
                    : `σ = ${result.sigma?.toFixed(4)},  p(η) = (1/(σ√(2π))) · exp(−η²/(2σ²))`}
                </p>
              )}
              {!isAcademic && (
                <p className="text-xs text-gray-500 mb-3">
                  Shape of the random noise added to the query answer
                </p>
              )}
              <NoisePdfChart
                scale={result.scale}
                mechanism={mechanism}
                sigma={result.sigma}
              />
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
                  {mechanism === "laplace"
                    ? "E[|η|] = b = Δf/ε — error decreases as ε increases"
                    : `σ = Δf·√(2ln(1.25/δ))/ε, δ = ${delta} — error decreases as ε increases`}
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
                mechanism={mechanism}
                delta={mechanism === "gaussian" ? delta : undefined}
              />
            </div>
          </div>
        )}

        {/* Composition topic view */}
        {topic === "composition" && (
          <CompositionPanel mechanism={mechanism} isAcademic={isAcademic} />
        )}

        {/* References — always visible as collapsible in footer (hidden in embed) */}
        {!isEmbed && <References />}

        {/* Academic theory section */}
        {isAcademic && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Theoretical Background
            </h2>
            <TheoryPanel />
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      {!isEmbed && (
        <footer className="border-t border-gray-800 px-6 py-3 text-xs text-gray-600 flex flex-wrap items-center justify-between">
          <span>{APP_NAME} v{APP_VERSION}</span>
          <nav className="flex gap-4">
            <Link href="/compare" className="text-indigo-400/60 hover:text-indigo-300 underline">Compare</Link>
            <Link href="/composition" className="text-indigo-400/60 hover:text-indigo-300 underline">Composition</Link>
            <Link href="/privacy-accounting" className="text-indigo-400/60 hover:text-indigo-300 underline">Privacy Accounting</Link>
            <Link href="/appendix" className="text-indigo-400/60 hover:text-indigo-300 underline">Appendix</Link>
            <Link href="/references" className="text-indigo-400/60 hover:text-indigo-300 underline">References</Link>
            <Link href="/methodology" className="text-indigo-400/60 hover:text-indigo-300 underline">Methodology</Link>
          </nav>
        </footer>
      )}
    </div>
  );
}
