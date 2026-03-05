"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { APP_NAME, APP_VERSION, BUILD_DATE, GIT_COMMIT } from "@/lib/version";
import { getEnvironment } from "@/lib/env";
import { decodeShareState } from "@/lib/share/urlState";

/** Last error captured by the ErrorBoundary (set externally). */
let _lastError: string | null = null;
export function setLastError(msg: string) {
  _lastError = msg;
}

export default function DiagnosticsPanel() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "D") {
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isSimulator = pathname === "/simulator" || pathname === "/embed";

  const searchString = searchParams.toString();
  const simState = useMemo(
    () => (isSimulator ? decodeShareState(searchParams) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSimulator, searchString],
  );

  const buildText = useCallback((): string => {
    const lines = [
      `${APP_NAME} v${APP_VERSION}`,
      `Build: ${BUILD_DATE}`,
      `Commit: ${GIT_COMMIT.slice(0, 8)}`,
      `Environment: ${getEnvironment()}`,
      `Route: ${pathname}`,
      `User-Agent: ${navigator.userAgent}`,
      `Screen: ${window.screen.width}x${window.screen.height}`,
      `Time: ${new Date().toISOString()}`,
    ];
    if (simState) {
      lines.push("--- Simulator State ---");
      if (simState.mechanism) lines.push(`Mechanism: ${simState.mechanism}`);
      if (simState.topic) lines.push(`Topic: ${simState.topic}`);
      if (simState.datasetId) lines.push(`Dataset: ${simState.datasetId}`);
      if (simState.epsilon) lines.push(`Epsilon: ${simState.epsilon}`);
      if (simState.delta != null) lines.push(`Delta: ${simState.delta}`);
      if (simState.sensitivity) lines.push(`Sensitivity: ${simState.sensitivity}`);
      if (simState.runs) lines.push(`Runs: ${simState.runs}`);
      if (simState.seed) lines.push(`Seed: ${simState.seed}`);
    }
    if (_lastError) {
      lines.push(`Last Error: ${_lastError}`);
    }
    return lines.join("\n");
  }, [pathname, simState]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail */
    }
  }, [buildText]);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 text-xs text-gray-300 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-100">Diagnostics</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1 font-mono">
        <p>
          <span className="text-gray-500">App:</span> {APP_NAME} v{APP_VERSION}
        </p>
        <p>
          <span className="text-gray-500">Build:</span> {BUILD_DATE}
        </p>
        <p>
          <span className="text-gray-500">Commit:</span> {GIT_COMMIT.slice(0, 8)}
        </p>
        <p>
          <span className="text-gray-500">Env:</span> {getEnvironment()}
        </p>
        <p>
          <span className="text-gray-500">Route:</span> {pathname}
        </p>
        <p>
          <span className="text-gray-500">UA:</span>{" "}
          <span className="break-all">
            {typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
          </span>
        </p>
        {simState && (
          <>
            <p className="text-gray-500 pt-1 border-t border-gray-800">
              Simulator State
            </p>
            {simState.mechanism && (
              <p>
                <span className="text-gray-500">Mechanism:</span>{" "}
                {simState.mechanism}
              </p>
            )}
            {simState.topic && (
              <p>
                <span className="text-gray-500">Topic:</span> {simState.topic}
              </p>
            )}
            {simState.datasetId && (
              <p>
                <span className="text-gray-500">Dataset:</span>{" "}
                {simState.datasetId}
              </p>
            )}
            {simState.epsilon != null && (
              <p>
                <span className="text-gray-500">Epsilon:</span>{" "}
                {simState.epsilon}
              </p>
            )}
            {simState.delta != null && (
              <p>
                <span className="text-gray-500">Delta:</span> {simState.delta}
              </p>
            )}
            {simState.sensitivity != null && (
              <p>
                <span className="text-gray-500">Sensitivity:</span>{" "}
                {simState.sensitivity}
              </p>
            )}
            {simState.runs != null && (
              <p>
                <span className="text-gray-500">Runs:</span> {simState.runs}
              </p>
            )}
            {simState.seed && (
              <p>
                <span className="text-gray-500">Seed:</span> {simState.seed}
              </p>
            )}
          </>
        )}
        {_lastError && (
          <p className="text-red-400 pt-1 border-t border-gray-800">
            <span className="text-gray-500">Last Error:</span> {_lastError}
          </p>
        )}
      </div>
      <button
        onClick={handleCopy}
        className="w-full mt-2 px-3 py-1.5 text-xs rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
      >
        {copied ? "Copied!" : "Copy Diagnostics"}
      </button>
    </div>
  );
}
