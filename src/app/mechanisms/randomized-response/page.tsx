"use client";

import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import ParamSlider from "@/components/ParamSlider";
import FormulaBlock from "@/components/FormulaBlock";
import MathTex from "@/components/Math";
import { randomizedResponse, rrEstimate } from "@/lib/dp/mechanisms";

export default function RandomizedResponsePage() {
  const [trueAnswer, setTrueAnswer] = useState(true);
  const [epsilon, setEpsilon] = useState(1.0);
  const [showTheory, setShowTheory] = useState(false);

  const N = 1000;

  const p = useMemo(
    () => Math.exp(epsilon) / (1 + Math.exp(epsilon)),
    [epsilon],
  );

  // Single noisy response
  const noisyResponse = useMemo(
    () => randomizedResponse(trueAnswer, epsilon),
    [trueAnswer, epsilon],
  );

  // N trials
  const trialStats = useMemo(() => {
    let truePos = 0;
    let falsePos = 0;
    for (let i = 0; i < N; i++) {
      const r = randomizedResponse(trueAnswer, epsilon);
      if (trueAnswer && r) truePos++;
      if (!trueAnswer && r) falsePos++;
    }
    const tpr = trueAnswer ? truePos / N : 1 - falsePos / N;
    const fpr = trueAnswer ? falsePos / N : (N - truePos) / N;
    const reportedYes = trueAnswer ? truePos / N : falsePos / N;
    const estimate = rrEstimate(reportedYes, epsilon);
    return { tpr, fpr, reportedYes, estimate };
  }, [trueAnswer, epsilon]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <a href="/mechanisms" className="text-xs text-gray-500 hover:text-indigo-400">
              ← All Mechanisms
            </a>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-600 text-gray-300">
              ε-DP (local)
            </span>
          </div>
          <h1 className="text-2xl font-bold">Randomized Response</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Local differential privacy for binary (Yes/No) surveys. Each
            respondent answers truthfully with probability{" "}
            <MathTex>{"p = e^\\varepsilon / (1 + e^\\varepsilon)"}</MathTex>,
            providing plausible deniability.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-5">
          <h2 className="font-semibold text-indigo-300">Parameters</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">True Answer:</span>
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setTrueAnswer(true)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  trueAnswer
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setTrueAnswer(false)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  !trueAnswer
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                No
              </button>
            </div>
          </div>

          <ParamSlider
            label="ε (epsilon)"
            value={epsilon}
            min={0.01}
            max={5}
            step={0.01}
            onChange={setEpsilon}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-2">
            <h2 className="font-semibold text-indigo-300 text-sm">
              Truthfulness Probability
            </h2>
            <p className="text-3xl font-bold text-white">
              {(p * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              <MathTex>
                {"p = e^\\varepsilon / (1 + e^\\varepsilon) = " + p.toFixed(4)}
              </MathTex>
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-2">
            <h2 className="font-semibold text-indigo-300 text-sm">
              Single Noisy Response
            </h2>
            <p
              className={`text-3xl font-bold ${
                noisyResponse ? "text-green-400" : "text-red-400"
              }`}
            >
              {noisyResponse ? "Yes" : "No"}
            </p>
            <p className="text-xs text-gray-500">
              True answer: <strong>{trueAnswer ? "Yes" : "No"}</strong>.{" "}
              {noisyResponse === trueAnswer ? "Answered truthfully." : "Answer flipped."}
            </p>
          </div>
        </div>

        {/* N trials */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-indigo-300">
            <MathTex>{"N = " + N}</MathTex> Trial Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">True Positive Rate</p>
              <p className="text-xl font-bold text-green-400">
                {(trialStats.tpr * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">False Positive Rate</p>
              <p className="text-xl font-bold text-red-400">
                {(trialStats.fpr * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reported &ldquo;Yes&rdquo;</p>
              <p className="text-xl font-bold text-indigo-300">
                {(trialStats.reportedYes * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Bias-Corrected Estimate
              </p>
              <p className="text-xl font-bold text-white">
                {(trialStats.estimate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Bias-corrected estimate formula:{" "}
            <MathTex>
              {"\\hat{p} = \\frac{\\text{freq} - (1-p)}{2p - 1}"}
            </MathTex>
          </p>
        </div>

        {/* Theory */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-indigo-300 hover:bg-gray-800 transition-colors"
            onClick={() => setShowTheory((v) => !v)}
          >
            <span>Theory — Local DP &amp; Randomized Response</span>
            <svg
              className={`w-4 h-4 transition-transform ${showTheory ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheory && (
            <div className="px-5 pb-5 space-y-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Local Differential Privacy
                </h3>
                <p>
                  A mechanism <MathTex>{"M"}</MathTex> satisfies{" "}
                  <MathTex>{"\\varepsilon"}</MathTex>-local DP if for all pairs of
                  inputs <MathTex>{"x, x'"}</MathTex> and all outputs{" "}
                  <MathTex>{"S"}</MathTex>:
                </p>
                <FormulaBlock
                  latex={"\\Pr[M(x) \\in S] \\leq e^\\varepsilon \\cdot \\Pr[M(x') \\in S]"}
                  label="Local DP definition"
                  copyable
                />
                <p>
                  Unlike central DP, local DP requires no trusted curator —
                  each individual randomizes their own answer.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Warner&apos;s Randomized Response (1965)
                </h3>
                <p>
                  For a binary question, respond truthfully with probability{" "}
                  <MathTex>{"p"}</MathTex> and flip with probability{" "}
                  <MathTex>{"1-p"}</MathTex>:
                </p>
                <FormulaBlock
                  latex={"p = \\frac{e^\\varepsilon}{1 + e^\\varepsilon}"}
                  label="Truthfulness probability"
                  copyable
                />
                <p>
                  This gives privacy ratio{" "}
                  <MathTex>{"p / (1-p) = e^\\varepsilon"}</MathTex>, satisfying{" "}
                  <MathTex>{"\\varepsilon"}</MathTex>-local DP.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-indigo-300 font-semibold">
                  Bias-Corrected Estimator
                </h3>
                <p>
                  If a fraction <MathTex>{"\\text{freq}"}</MathTex> of
                  respondents report &ldquo;Yes&rdquo;, the unbiased population
                  estimate is:
                </p>
                <FormulaBlock
                  latex={"\\hat{\\pi} = \\frac{\\text{freq} - (1 - p)}{2p - 1}"}
                  label="Bias-corrected estimate"
                  copyable
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
