"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PRESET_CATEGORIES,
  ALL_PRESETS,
  presetToUrl,
} from "@/lib/presets/presets";
import type { Preset } from "@/lib/presets/presets";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function PresetCard({ preset, compact }: { preset: Preset; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = presetToUrl(preset);

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${url}`;
    copyToClipboard(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-700 rounded-lg p-3 bg-gray-900/60 flex flex-col gap-2">
      <div>
        <h4 className={`font-bold text-indigo-200 ${compact ? "text-xs" : "text-sm"}`}>
          {preset.title}
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">{preset.description}</p>
        {!compact && (
          <p className="text-xs text-gray-500 mt-1">
            <strong className="text-gray-400">Learning goal:</strong>{" "}
            {preset.learningGoal}
          </p>
        )}
      </div>
      <div className="flex gap-2 mt-auto">
        <Link
          href={url}
          className="px-2.5 py-1 text-xs font-medium rounded border border-indigo-600 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 transition-colors"
        >
          Open
        </Link>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

/**
 * Searchable preset picker — used in simulator header and instructor pages.
 */
export default function PresetPicker({ compact }: { compact?: boolean }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return PRESET_CATEGORIES;
    const q = search.toLowerCase();
    return PRESET_CATEGORIES.map((cat) => ({
      ...cat,
      presets: cat.presets.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.learningGoal.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.presets.length > 0);
  }, [search]);

  const totalShown = filtered.reduce((n, c) => n + c.presets.length, 0);

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder={`Search ${ALL_PRESETS.length} presets…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-1.5 text-sm rounded border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {totalShown === 0 && (
        <p className="text-xs text-gray-500">No presets match your search.</p>
      )}

      {filtered.map((cat) => (
        <div key={cat.label}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            {cat.label}
          </h3>
          <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {cat.presets.map((preset: Preset) => (
              <PresetCard key={preset.id} preset={preset} compact={compact} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
