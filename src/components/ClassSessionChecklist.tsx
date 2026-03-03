"use client";

import { useState } from "react";

const CHECKLIST = {
  before: [
    "Verify projector resolution (1280×720 min recommended)",
    "Open preset links in browser tabs",
    "Confirm seed value for reproducibility (e.g. seed = 42)",
    "Test that WASM loads correctly in your browser",
  ],
  during: [
    "Demo 1: Laplace mechanism — compare high ε vs low ε",
    "Demo 2: Gaussian mechanism — show δ effect on σ",
    "Demo 3: Composition — k sequential queries budget tracking",
  ],
  after: [
    "Assign exercises from the lesson plan",
    "Share preset links with students",
    "Collect feedback on simulator usability",
  ],
};

function formatChecklistText(): string {
  let text = "EpsilonLab Class Session Checklist\n";
  text += "==================================\n\n";
  text += "BEFORE CLASS:\n";
  CHECKLIST.before.forEach((item, i) => {
    text += `  [ ] ${i + 1}. ${item}\n`;
  });
  text += "\nDURING CLASS:\n";
  CHECKLIST.during.forEach((item, i) => {
    text += `  [ ] ${i + 1}. ${item}\n`;
  });
  text += "\nAFTER CLASS:\n";
  CHECKLIST.after.forEach((item, i) => {
    text += `  [ ] ${i + 1}. ${item}\n`;
  });
  return text;
}

export default function ClassSessionChecklist() {
  const [copied, setCopied] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatChecklistText()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSection = (
    title: string,
    items: string[],
    prefix: string,
  ) => (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const key = `${prefix}-${i}`;
          return (
            <li key={key} className="flex items-start gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={!!checked[key]}
                onChange={() => toggle(key)}
                className="mt-0.5 accent-indigo-500"
              />
              <span className={checked[key] ? "line-through text-gray-600" : ""}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/60 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-indigo-200">
          Class Session Checklist
        </h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          {copied ? "Copied!" : "Copy checklist"}
        </button>
      </div>

      {renderSection("Before Class", CHECKLIST.before, "before")}
      {renderSection("During Class", CHECKLIST.during, "during")}
      {renderSection("After Class", CHECKLIST.after, "after")}
    </div>
  );
}
