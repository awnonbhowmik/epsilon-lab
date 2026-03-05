"use client";

export interface BudgetBarProps {
  used: number;
  total: number;
  label?: string;
}

export default function BudgetBar({ used, total, label }: BudgetBarProps) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const overBudget = used > total;

  let barColor = "bg-green-500";
  if (pct >= 85) barColor = "bg-red-500";
  else if (pct >= 60) barColor = "bg-amber-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{label ?? "Privacy Budget"}</span>
        <span className={overBudget ? "text-red-400 font-bold" : ""}>
          {used.toFixed(4)} / {total.toFixed(4)} ε
          {overBudget && " ⚠ Over budget"}
        </span>
      </div>
      <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>{total.toFixed(4)} ε</span>
      </div>
    </div>
  );
}
