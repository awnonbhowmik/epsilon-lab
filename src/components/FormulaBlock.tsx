"use client";

import { useState, useCallback } from "react";
import MathTex from "./Math";

export interface FormulaBlockProps {
  latex: string;
  label?: string;
  copyable?: boolean;
}

export default function FormulaBlock({
  latex,
  label,
  copyable = false,
}: FormulaBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable */
    }
  }, [latex]);

  return (
    <div className="my-3 rounded-lg border border-gray-700 bg-gray-950 overflow-hidden">
      {(label || copyable) && (
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700 bg-gray-900">
          {label && (
            <span className="text-xs text-gray-400 font-medium">{label}</span>
          )}
          {copyable && (
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy LaTeX"}
            </button>
          )}
        </div>
      )}
      <div className="px-4 py-3 text-indigo-200 overflow-x-auto">
        <MathTex display>{latex}</MathTex>
      </div>
    </div>
  );
}
