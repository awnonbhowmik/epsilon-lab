"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { laplacePdf, gaussianPdf } from "@/lib/dp/utils";
import type { Mechanism } from "@/lib/dp/types";

export type NoisePdfChartProps = {
  scale: number;
  mechanism?: Mechanism;
  sigma?: number;
};

export default function NoisePdfChart({ scale, mechanism = "laplace", sigma }: NoisePdfChartProps) {
  const isGaussian = mechanism === "gaussian" && sigma != null;
  const spread = isGaussian ? sigma! : scale;
  const numPoints = 200;
  const range = Math.max(spread * 6, 1);
  const data = Array.from({ length: numPoints }, (_, i) => {
    const x = -range + (2 * range * i) / (numPoints - 1);
    const pdf = isGaussian ? gaussianPdf(x, sigma!) : laplacePdf(x, scale);
    return { x: parseFloat(x.toFixed(4)), pdf };
  });

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[-range, range]}
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            label={{ value: "Noise", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => v.toFixed(3)}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
          />
          <Tooltip
            formatter={(value) => [typeof value === "number" ? value.toFixed(5) : value, "PDF"]}
            labelFormatter={(label) => `Noise: ${Number(label).toFixed(3)}`}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
          />
          <ReferenceLine x={0} stroke="#6366f1" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="pdf"
            stroke={isGaussian ? "#f472b6" : "#818cf8"}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
