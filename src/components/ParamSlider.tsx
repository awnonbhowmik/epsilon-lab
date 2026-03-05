"use client";

export interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  unit?: string;
}

export default function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: ParamSliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <label className="text-gray-300 font-medium">{label}</label>
        <span className="text-indigo-300 font-mono">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= min && v <= max) onChange(v);
          }}
          className="w-20 px-2 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-gray-200 text-center"
        />
      </div>
    </div>
  );
}
