"use client";

import { useEffect, useState } from "react";
import { APP_NAME, APP_VERSION } from "@/lib/version";
import { getEnvironment } from "@/lib/env";

type Status = "checking" | "ok" | "fail";

export default function HealthPage() {
  const [wasmStatus, setWasmStatus] = useState<Status>("checking");
  const [chartsStatus, setChartsStatus] = useState<Status>("checking");

  useEffect(() => {
    (async () => {
      try {
        const mod = await import("@/wasm/dp_engine/dp_engine.js");
        if (typeof (mod as Record<string, unknown>).default === "function") {
          await (mod.default as unknown as () => Promise<void>)();
        }
        setWasmStatus("ok");
      } catch {
        setWasmStatus("fail");
      }
    })();

    (async () => {
      try {
        await import("recharts");
        setChartsStatus("ok");
      } catch {
        setChartsStatus("fail");
      }
    })();
  }, []);

  const label = (s: Status) =>
    s === "ok" ? "OK" : s === "fail" ? "FAIL" : "...";
  const color = (s: Status) =>
    s === "ok"
      ? "text-green-400"
      : s === "fail"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
      <pre className="font-mono text-sm space-y-1">
        <p className="text-indigo-400 font-bold">
          {APP_NAME} v{APP_VERSION}
        </p>
        <p>
          WASM Engine:{" "}
          <span className={color(wasmStatus)}>{label(wasmStatus)}</span>
        </p>
        <p>
          Charts:{" "}
          <span className={color(chartsStatus)}>{label(chartsStatus)}</span>
        </p>
        <p>
          Environment:{" "}
          <span className="text-gray-300">{getEnvironment()}</span>
        </p>
      </pre>
    </div>
  );
}
