import Link from "next/link";
import { NOTATION, DEFINITIONS } from "@/lib/content/glossary";
import { MECHANISMS, UTILITY_METRICS, UTILITY_BEHAVIOR } from "@/lib/content/appendix";
import { APP_NAME, APP_VERSION } from "@/lib/version";

export const metadata = {
  title: `Math Appendix — ${APP_NAME}`,
};

export default function AppendixPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Home</Link>
        <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">Compare</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
        <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Appendix</Link>
        <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">References</Link>
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">Methodology</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">Math Appendix</h1>

        {/* A) Notation */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">A. Notation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="py-2 px-3 font-semibold text-gray-400">Symbol</th>
                  <th className="py-2 px-3 font-semibold text-gray-400">Name</th>
                  <th className="py-2 px-3 font-semibold text-gray-400">Definition</th>
                </tr>
              </thead>
              <tbody>
                {NOTATION.map((entry) => (
                  <tr key={entry.symbol} className="border-b border-gray-800">
                    <td className="py-2 px-3 font-mono text-indigo-300">{entry.symbol}</td>
                    <td className="py-2 px-3">{entry.name}</td>
                    <td className="py-2 px-3 text-gray-400">{entry.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* B) Definitions */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">B. Definitions</h2>
          {DEFINITIONS.map((def) => (
            <div key={def.title} className="bg-gray-900 border border-gray-700 rounded p-4 space-y-1">
              <h3 className="text-sm font-semibold text-indigo-300">{def.title}</h3>
              <p className="text-sm text-gray-400 font-mono leading-relaxed">{def.body}</p>
            </div>
          ))}
        </section>

        {/* C) Mechanisms */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">C. Mechanisms Used in {APP_NAME}</h2>
          {MECHANISMS.map((m) => (
            <div key={m.name} className="bg-gray-900 border border-gray-700 rounded p-4 space-y-2">
              <h3 className="text-sm font-semibold text-indigo-300">{m.name}</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Privacy guarantee:</span> {m.privacyGuarantee}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Sensitivity type:</span> {m.sensitivityType}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Noise scale:</span>{" "}
                  <code className="text-indigo-200 bg-gray-800 px-1 rounded">{m.noiseScale}</code>
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">PDF:</span>{" "}
                  <code className="text-indigo-200 bg-gray-800 px-1 rounded">{m.pdfFormula}</code>
                </p>
                {m.notes && (
                  <p className="text-xs text-yellow-400/80 mt-1 italic">{m.notes}</p>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* D) Utility Metrics */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">D. Utility Metrics</h2>
          {UTILITY_METRICS.map((metric) => (
            <div key={metric.name} className="bg-gray-900 border border-gray-700 rounded p-4 space-y-1">
              <h3 className="text-sm font-semibold text-indigo-300">{metric.name}</h3>
              <p className="text-sm text-gray-400">
                <code className="text-indigo-200 bg-gray-800 px-1 rounded">{metric.formula}</code>
              </p>
              <p className="text-sm text-gray-500">{metric.description}</p>
            </div>
          ))}
          <div className="bg-gray-900 border border-gray-700 rounded p-4 space-y-1">
            <h3 className="text-sm font-semibold text-indigo-300">Expected Behavior</h3>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
              {UTILITY_BEHAVIOR.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
