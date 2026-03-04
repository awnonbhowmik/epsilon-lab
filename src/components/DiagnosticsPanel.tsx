"use client";

import { useEffect, useState, useCallback } from "react";
import { APP_NAME, APP_VERSION, BUILD_DATE } from "@/lib/version";
import { getEnvironment } from "@/lib/env";

export default function DiagnosticsPanel() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "D") {
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const buildText = useCallback((): string => {
    const lines = [
      `${APP_NAME} v${APP_VERSION}`,
      `Build: ${BUILD_DATE}`,
      `Environment: ${getEnvironment()}`,
      `User-Agent: ${navigator.userAgent}`,
      `URL: ${window.location.href}`,
      `Screen: ${window.screen.width}x${window.screen.height}`,
      `Time: ${new Date().toISOString()}`,
    ];
    return lines.join("\n");
  }, []);

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
          <span className="text-gray-500">Env:</span> {getEnvironment()}
        </p>
        <p>
          <span className="text-gray-500">UA:</span>{" "}
          <span className="break-all">
            {typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
          </span>
        </p>
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
