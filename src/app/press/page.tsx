"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { APP_NAME, APP_VERSION, BUILD_DATE } from "@/lib/version";
import { encodeShareState } from "@/lib/share/urlState";
import type { ShareState } from "@/lib/share/urlState";

/* ── Demo link definitions ────────────────────────────────────────── */

const DEMO_LINKS: { label: string; state: ShareState }[] = [
  {
    label: "Laplace — High Privacy (ε = 0.2)",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.2,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
  },
  {
    label: "Laplace — Low Privacy (ε = 5)",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 5,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "student",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "single_query",
    },
  },
  {
    label: "Gaussian — Baseline (ε = 1, δ = 1e-5)",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-5,
    },
  },
  {
    label: "Gaussian — Smaller δ (1e-7)",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 1,
      sensitivity: 15,
      runs: 500,
      seed: "42",
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "gaussian",
      topic: "single_query",
      delta: 1e-7,
    },
  },
  {
    label: "Composition — k = 5, ε = 0.5 each",
    state: {
      datasetId: "small_integers",
      queryType: "sum",
      epsilon: 0.5,
      sensitivity: 15,
      runs: 100,
      mode: "academic",
      advancedSensitivity: false,
      mechanism: "laplace",
      topic: "composition",
    },
  },
];

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#4f46e5"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-weight="bold"
        font-size="44" fill="white">ε</text>
</svg>`;

/* ── Copy helper ──────────────────────────────────────────────────── */

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may fail */
    }
  }, [text]);
  return (
    <button
      onClick={copy}
      className="shrink-0 px-2 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : label ?? "Copy"}
    </button>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function PressPage() {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://epsilonlab.app";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">Press &amp; Outreach</h1>

        {/* Product summary */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">About {APP_NAME}</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {APP_NAME} is a free, browser-based differential privacy simulator
            designed for classroom instruction and self-study. All computation
            runs client-side via a Rust/WebAssembly engine — no data ever
            leaves the browser.
          </p>
        </section>

        {/* Features */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Key Features</h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Laplace &amp; Gaussian mechanism simulations</li>
            <li>13 curated teaching presets with shareable URLs</li>
            <li>Classroom Pack PDF handout generator</li>
            <li>LMS embed mode (Canvas, Blackboard, Moodle)</li>
            <li>Privacy accounting &amp; sequential composition</li>
            <li>Export results as PNG for slides and reports</li>
          </ul>
        </section>

        {/* Audience */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">
            Intended Audience
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>University instructors teaching data privacy courses</li>
            <li>Students learning differential privacy concepts</li>
            <li>Researchers prototyping DP query analyses</li>
          </ul>
        </section>

        {/* Cite */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">
            Cite {APP_NAME}
          </h2>
          <p className="text-sm text-gray-400">
            Awnon Bhowmik ({BUILD_DATE.slice(0, 4)}).{" "}
            <em>
              {APP_NAME}: Interactive Differential Privacy Simulation Platform
            </em>{" "}
            [Software]. Version {APP_VERSION}.
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/simulator"
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Open Simulator
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/for-instructors"
            className="px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            For Instructors
          </Link>
        </section>

        {/* Demo Links */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Demo Links</h2>
          <p className="text-sm text-gray-400">
            Copy-paste these URLs to showcase specific DP scenarios.
          </p>
          <div className="space-y-2">
            {DEMO_LINKS.map((d) => {
              const url = `${origin}/simulator?${encodeShareState(d.state).toString()}`;
              return (
                <div
                  key={d.label}
                  className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2"
                >
                  <span className="flex-1 text-sm text-gray-300 truncate">
                    {d.label}
                  </span>
                  <CopyButton text={url} label="Copy URL" />
                </div>
              );
            })}
          </div>
        </section>

        {/* Brand Assets */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Brand Assets</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
            <p className="text-sm text-gray-300">
              <strong>App name:</strong> {APP_NAME} &nbsp;|&nbsp;{" "}
              <strong>Version:</strong> {APP_VERSION}
            </p>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16"
                dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
              />
              <CopyButton text={LOGO_SVG} label="Copy Logo SVG" />
            </div>
          </div>
        </section>

        {/* Documentation links */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Documentation</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="https://github.com/awnonbhowmik/epsilon-lab/blob/main/docs/INSTRUCTORS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Instructor Guide ↗
            </a>
            <a
              href="https://github.com/awnonbhowmik/epsilon-lab/blob/main/docs/SUPPORT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Support &amp; Bug Reports ↗
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
