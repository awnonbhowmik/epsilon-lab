"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Props {
  noisyValues: number[];
  trueValue: number;
}

function buildHistogram(values: number[], bins = 30) {
  if (values.length === 0) return [];
  const { min, max } = values.reduce(
    (acc, v) => ({ min: v < acc.min ? v : acc.min, max: v > acc.max ? v : acc.max }),
    { min: values[0], max: values[0] }
  );
  const range = max - min || 1;
  const binWidth = range / bins;
  const counts = new Array(bins).fill(0);
  values.forEach((v) => {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= bins) idx = bins - 1;
    counts[idx]++;
  });
  return counts.map((count, i) => ({
    x: parseFloat((min + (i + 0.5) * binWidth).toFixed(4)),
    count,
  }));
}

export default function NoisyResultsHistogram({ noisyValues, trueValue }: Props) {
  const data = buildHistogram(noisyValues);
  const domain = noisyValues.length > 0
    ? [Math.min(...noisyValues), Math.max(...noisyValues)]
    : [0, 1];

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="x"
            type="number"
            domain={domain}
            tickFormatter={(v) => Number(v).toFixed(1)}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            label={{ value: "Noisy Value", position: "insideBottom", offset: -2, fill: "#9ca3af", fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
          <Tooltip
            formatter={(value) => [value, "Count"]}
            labelFormatter={(label) => `Value: ${Number(label).toFixed(3)}`}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }}
          />
          <ReferenceLine x={trueValue} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "True", fill: "#f59e0b", fontSize: 11 }} />
          <Bar dataKey="count" fill="#34d399" opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
