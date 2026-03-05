"use client";

import { useState, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";
import BudgetBar from "@/components/BudgetBar";
import MathTex from "@/components/Math";

const STORAGE_KEY = "epsilonlab_budget_v1";

interface QueryEntry {
  id: string;
  mechanism: string;
  description: string;
  epsilon: number;
  delta: number | null;
  timestamp: string;
}

interface BudgetState {
  total: number;
  delta: number | null;
  queries: QueryEntry[];
}

const DEFAULT_STATE: BudgetState = {
  total: 1.0,
  delta: null,
  queries: [],
};

const MECHANISMS = [
  "Laplace",
  "Gaussian",
  "Exponential",
  "Randomized Response",
  "Report Noisy Max",
  "Discrete Laplace",
  "Histogram",
  "Other",
];

function loadState(): BudgetState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as BudgetState;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: BudgetState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function BudgetPage() {
  const [state, setState] = useState<BudgetState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Form state
  const [formMechanism, setFormMechanism] = useState(MECHANISMS[0]);
  const [formDescription, setFormDescription] = useState("");
  const [formEpsilon, setFormEpsilon] = useState(0.1);
  const [formDelta, setFormDelta] = useState<string>("");

  // Budget setup editing
  const [editingTotal, setEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState("1.0");
  const [deltaInput, setDeltaInput] = useState("");

  useEffect(() => {
    const s = loadState();
    setState(s);
    setTotalInput(String(s.total));
    setDeltaInput(s.delta != null ? String(s.delta) : "");
    setLoaded(true);
  }, []);

  const usedEpsilon = state.queries.reduce((acc, q) => acc + q.epsilon, 0);
  const usedDelta = state.queries.reduce(
    (acc, q) => acc + (q.delta ?? 0),
    0,
  );
  const remainingEpsilon = state.total - usedEpsilon;

  const update = useCallback((next: BudgetState) => {
    setState(next);
    saveState(next);
  }, []);

  function saveBudget() {
    const total = parseFloat(totalInput);
    const delta = deltaInput.trim() ? parseFloat(deltaInput) : null;
    if (!isNaN(total) && total > 0) {
      update({ ...state, total, delta: delta && !isNaN(delta) ? delta : null });
    }
    setEditingTotal(false);
  }

  function addQuery() {
    if (!formDescription.trim() || formEpsilon <= 0) return;
    const delta = formDelta.trim() ? parseFloat(formDelta) : null;
    const entry: QueryEntry = {
      id: Date.now().toString(),
      mechanism: formMechanism,
      description: formDescription.trim(),
      epsilon: formEpsilon,
      delta: delta && !isNaN(delta) ? delta : null,
      timestamp: new Date().toISOString(),
    };
    update({ ...state, queries: [...state.queries, entry] });
    setFormDescription("");
    setFormEpsilon(0.1);
    setFormDelta("");
  }

  function removeQuery(id: string) {
    update({ ...state, queries: state.queries.filter((q) => q.id !== id) });
  }

  function exportCSV() {
    const rows = [
      ["Mechanism", "Description", "Epsilon", "Delta", "Timestamp"],
      ...state.queries.map((q) => [
        q.mechanism,
        q.description,
        String(q.epsilon),
        q.delta != null ? String(q.delta) : "",
        q.timestamp,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "privacy_budget.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (window.confirm("Clear all queries and reset the budget?")) {
      update(DEFAULT_STATE);
      setTotalInput("1.0");
      setDeltaInput("");
    }
  }

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Privacy Budget Manager</h1>
          <p className="text-gray-400 text-sm">
            Track your{" "}
            <MathTex>{"\\varepsilon"}</MathTex>-budget across multiple queries.
            Stored in <code className="text-indigo-300">localStorage</code> —
            session-scoped and never sent to a server.
          </p>
        </div>

        {/* Budget setup */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-indigo-300">Budget Setup</h2>
            <button
              onClick={() => setEditingTotal((v) => !v)}
              className="text-xs text-gray-500 hover:text-indigo-400 transition-colors"
            >
              {editingTotal ? "Cancel" : "Edit"}
            </button>
          </div>

          {editingTotal ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-400 w-32">
                  Total <MathTex>{"\\varepsilon"}</MathTex>:
                </label>
                <input
                  type="number"
                  value={totalInput}
                  step="0.01"
                  min="0.001"
                  onChange={(e) => setTotalInput(e.target.value)}
                  className="w-28 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-400 w-32">
                  Delta <MathTex>{"\\delta"}</MathTex>{" "}
                  <span className="text-gray-600">(optional)</span>:
                </label>
                <input
                  type="number"
                  value={deltaInput}
                  step="1e-6"
                  min="0"
                  placeholder="e.g. 1e-5"
                  onChange={(e) => setDeltaInput(e.target.value)}
                  className="w-28 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={saveBudget}
                className="px-4 py-1.5 rounded bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-gray-400">
              <p>
                Total budget:{" "}
                <span className="text-white font-semibold">{state.total}</span>{" "}
                <MathTex>{"\\varepsilon"}</MathTex>
              </p>
              {state.delta != null && (
                <p>
                  Delta:{" "}
                  <span className="text-white font-semibold">{state.delta}</span>{" "}
                  <MathTex>{"\\delta"}</MathTex>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Budget bar */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-indigo-300">
              <MathTex>{"\\varepsilon"}</MathTex> Usage
            </h2>
            <span
              className={`text-2xl font-bold ${
                remainingEpsilon < 0 ? "text-red-400" : "text-white"
              }`}
            >
              {remainingEpsilon.toFixed(4)} remaining
            </span>
          </div>
          <BudgetBar used={usedEpsilon} total={state.total} />
          {state.delta != null && usedDelta > 0 && (
            <BudgetBar
              used={usedDelta}
              total={state.delta}
              label={"δ budget"}
            />
          )}
        </div>

        {/* Add query */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-indigo-300">Log a Query</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mechanism</label>
              <select
                value={formMechanism}
                onChange={(e) => setFormMechanism(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              >
                {MECHANISMS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Count query on age"
                className="w-full px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                <MathTex>{"\\varepsilon"}</MathTex> consumed
              </label>
              <input
                type="number"
                value={formEpsilon}
                step="0.01"
                min="0.001"
                onChange={(e) => setFormEpsilon(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                <MathTex>{"\\delta"}</MathTex> consumed{" "}
                <span className="text-gray-600">(optional)</span>
              </label>
              <input
                type="number"
                value={formDelta}
                step="1e-6"
                min="0"
                placeholder="e.g. 1e-5"
                onChange={(e) => setFormDelta(e.target.value)}
                className="w-full px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            onClick={addQuery}
            disabled={!formDescription.trim() || formEpsilon <= 0}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            Add Query
          </button>
        </div>

        {/* Query log */}
        {state.queries.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-indigo-300">
                Query Log ({state.queries.length})
              </h2>
              <button
                onClick={exportCSV}
                className="text-xs px-3 py-1 rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Export CSV
              </button>
            </div>
            <div className="space-y-2">
              {state.queries.map((q) => (
                <div
                  key={q.id}
                  className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-800">
                        {q.mechanism}
                      </span>
                      <span className="text-sm text-gray-200 truncate">
                        {q.description}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      <span>
                        <MathTex>{"\\varepsilon"}</MathTex> = {q.epsilon}
                      </span>
                      {q.delta != null && (
                        <span>
                          <MathTex>{"\\delta"}</MathTex> = {q.delta}
                        </span>
                      )}
                      <span>{new Date(q.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeQuery(q.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.queries.length === 0 && (
          <p className="text-center text-gray-600 text-sm py-4">
            No queries logged yet. Add your first query above.
          </p>
        )}

        {/* Reset */}
        <div className="flex justify-end">
          <button
            onClick={reset}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors"
          >
            Reset session →
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
