"use client";

import { useState } from "react";
import { APP_NAME, APP_VERSION, BUILD_DATE, GIT_COMMIT } from "@/lib/version";
import { getEnvironment } from "@/lib/env";

type Status = "idle" | "checking" | "ok" | "fail";

function Badge({ status }: { status: Status }) {
  const map: Record<Status, { text: string; cls: string }> = {
    idle: { text: "—", cls: "text-gray-500" },
    checking: { text: "checking…", cls: "text-yellow-400 animate-pulse" },
    ok: { text: "OK", cls: "text-green-400" },
    fail: { text: "FAIL", cls: "text-red-400" },
  };
  const { text, cls } = map[status];
  return <span className={`font-bold ${cls}`}>{text}</span>;
}

export default function HealthPage() {
  const [wasmStatus, setWasmStatus] = useState<Status>("idle");
  const [exportStatus, setExportStatus] = useState<Status>("idle");

  const emailConfigured =
    typeof process !== "undefined" &&
    !!(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

  const handleTestWasm = async () => {
    setWasmStatus("checking");
    try {
      const mod = await import("@/wasm/dp_engine/dp_engine.js");
      if (typeof (mod as Record<string, unknown>).default === "function") {
        await (mod.default as unknown as () => Promise<void>)();
      }
      setWasmStatus("ok");
    } catch {
      setWasmStatus("fail");
    }
  };

  const handleTestExport = async () => {
    setExportStatus("checking");
    try {
      const { toPng } = await import("html-to-image");
      const el = document.createElement("div");
      el.style.cssText =
        "width:100px;height:50px;background:#fff;color:#000;position:absolute;left:-9999px;top:0";
      el.textContent = "export test";
      document.body.appendChild(el);
      try {
        await toPng(el, { width: 100, height: 50 });
        setExportStatus("ok");
      } finally {
        document.body.removeChild(el);
      }
    } catch {
      setExportStatus("fail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-xl font-bold text-indigo-400">
          {APP_NAME} Health Check
        </h1>

        {/* Build Info */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2 text-sm font-mono">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
            Build Info
          </h2>
          <p>
            <span className="text-gray-500">Version:</span> {APP_VERSION}
          </p>
          <p>
            <span className="text-gray-500">Build&nbsp;Date:</span>{" "}
            {BUILD_DATE}
          </p>
          <p>
            <span className="text-gray-500">Commit:</span>{" "}
            {GIT_COMMIT.slice(0, 8)}
          </p>
          <p>
            <span className="text-gray-500">Environment:</span>{" "}
            {getEnvironment()}
          </p>
        </section>

        {/* Subsystem checks */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3 text-sm">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
            Subsystem Checks
          </h2>

          {/* WASM */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">WASM Engine</span>
            <div className="flex items-center gap-2">
              <Badge status={wasmStatus} />
              <button
                onClick={handleTestWasm}
                disabled={wasmStatus === "checking"}
                className="px-2 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Test WASM
              </button>
            </div>
          </div>

          {/* Export */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Export Subsystem</span>
            <div className="flex items-center gap-2">
              <Badge status={exportStatus} />
              <button
                onClick={handleTestExport}
                disabled={exportStatus === "checking"}
                className="px-2 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Test Export
              </button>
            </div>
          </div>

          {/* EmailJS */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">EmailJS</span>
            <span
              className={`text-sm font-bold ${emailConfigured ? "text-green-400" : "text-yellow-400"}`}
            >
              Configured: {emailConfigured ? "yes" : "no"}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
