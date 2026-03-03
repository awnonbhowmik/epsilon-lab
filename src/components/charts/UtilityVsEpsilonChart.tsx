"use client";

import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { simulate } from "@/lib/dp/wasmClient";
import type { SimRequest } from "@/lib/dp/types";

interface Props {
  baseRequest: SimRequest;
}

interface DataPoint {
  epsilon: number;
  meanAbsError: number;
}

const EPSILONS = [0.1, 0.2, 0.5, 1, 2, 5, 10];

export default function UtilityVsEpsilonChart({ baseRequest }: Props) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const points: DataPoint[] = [];
        for (const eps of EPSILONS) {
          const req: SimRequest = { ...baseRequest, epsilon: eps, runs: 50 };
          const res = await simulate(req);
          points.push({ epsilon: eps, meanAbsError: res.absErrorSummary.mean });
        }
        setData(points);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [baseRequest.values, baseRequest.queryType, baseRequest.sensitivity]);

  return (
    <div className="w-full h-56 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10 rounded">
          <span className="text-gray-400 text-sm">Computing…</span>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="epsilon"
            type="number"
            scale="log"
            domain={[0.1, 10]}
            ticks={EPSILONS}
            tickFormatter={(v) => String(v)}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            label={{ value: "ε (epsilon)", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            label={{ value: "Mean |Error|", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => [typeof value === "number" ? value.toFixed(4) : value, "Mean Abs Error"]}
            labelFormatter={(label) => `ε = ${label}`}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
          />
          <Line
            type="monotone"
            dataKey="meanAbsError"
            stroke="#f472b6"
            dot={{ r: 4, fill: "#f472b6" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
