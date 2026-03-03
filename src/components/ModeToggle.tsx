"use client";

interface Props {
  isAcademic: boolean;
  onChange: (v: boolean) => void;
}

export default function ModeToggle({ isAcademic, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${!isAcademic ? "text-indigo-400" : "text-gray-400"}`}>
        Student
      </span>
      <button
        role="switch"
        aria-checked={isAcademic}
        onClick={() => onChange(!isAcademic)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isAcademic ? "bg-indigo-600" : "bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAcademic ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isAcademic ? "text-indigo-400" : "text-gray-400"}`}>
        Academic
      </span>
    </div>
  );
}
