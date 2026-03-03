"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_PRESETS, presetToUrl } from "@/lib/presets/presets";
import type { Preset } from "@/lib/presets/presets";
import { generateClassroomPack } from "@/lib/export/classroomPack";

export default function ClassroomPackPage() {
  const [course, setCourse] = useState("");
  const [instructor, setInstructor] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const cancelRef = useState({ current: false })[0];

  const togglePreset = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 6 ? [...prev, id] : prev,
    );
  };

  const selectedPresets = selected
    .map((id) => ALL_PRESETS.find((p) => p.id === id))
    .filter(Boolean) as Preset[];

  const handleGenerate = async () => {
    if (selectedPresets.length < 3) return;
    setGenerating(true);
    setCancelled(false);
    cancelRef.current = false;
    setPdfBlob(null);

    try {
      const blob = await generateClassroomPack({
        course: course || undefined,
        instructor: instructor || undefined,
        presets: selectedPresets,
        onProgress: (msg) => setProgress(msg),
        isCancelled: () => cancelRef.current,
      });
      if (!cancelRef.current) {
        setPdfBlob(blob);
        setProgress("Done!");
      }
    } catch (e) {
      if (!cancelRef.current) {
        setProgress(`Error: ${e instanceof Error ? e.message : String(e)}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setCancelled(true);
    setGenerating(false);
    setProgress("Cancelled.");
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `epsilonlab_classroom_pack_${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">
            ε EpsilonLab — Classroom Pack
          </h1>
          <Link
            href="/"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <p className="text-sm text-gray-400">
          Generate a single PDF handout for your lecture. Includes a cover page,
          key concepts summary, and preset pages with parameter tables and share
          URLs.
        </p>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Course Name (optional)
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. CS 6340 — Data Privacy"
              className="w-full px-3 py-1.5 text-sm rounded border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Instructor Name (optional)
            </label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Smith"
              className="w-full px-3 py-1.5 text-sm rounded border border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Preset selector */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2">
            Select 3–6 Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto border border-gray-700 rounded-lg p-3 bg-gray-900/60">
            {ALL_PRESETS.map((p) => {
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePreset(p.id)}
                  className={`text-left p-2 rounded border text-xs transition-colors ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-600/20 text-indigo-200"
                      : "border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  <span className="font-bold">{p.title}</span>
                  <br />
                  <span className="text-gray-500">{p.description}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selected.length}/6 selected
            {selected.length < 3 && " (minimum 3)"}
          </p>
        </div>

        {/* Generate / download */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={generating || selectedPresets.length < 3}
            className="px-4 py-2 text-sm font-medium rounded border border-indigo-600 bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? "Generating…" : "Generate PDF"}
          </button>
          {generating && (
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium rounded border border-red-600 bg-red-600/20 text-red-300 hover:bg-red-600/40 transition-colors"
            >
              Cancel
            </button>
          )}
          {pdfBlob && !generating && (
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm font-medium rounded border border-green-600 bg-green-600/20 text-green-300 hover:bg-green-600/40 transition-colors"
            >
              Download PDF
            </button>
          )}
        </div>

        {progress && (
          <p className="text-xs text-gray-400 font-mono">{progress}</p>
        )}
      </main>
    </div>
  );
}
