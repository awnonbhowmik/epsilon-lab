import Link from "next/link";
import {
  CORE_REFERENCES,
  ADVANCED_REFERENCES,
} from "@/lib/content/references";
import { APP_NAME, APP_VERSION, APP_FULL_TITLE, APP_AUTHOR } from "@/lib/version";

export const metadata = {
  title: `References — ${APP_NAME}`,
};

export default function ReferencesPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Home</Link>
        <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">Compare</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
        <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">Appendix</Link>
        <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">References</Link>
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">Methodology</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">References</h1>

        {/* Cite EpsilonLab */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Cite {APP_NAME}</h2>
          <p className="text-sm text-gray-400">
            If you use {APP_NAME} in teaching or academic work, please cite it as follows:
          </p>
          <p className="text-sm text-gray-300">
            {APP_AUTHOR} ({year}). <em>{APP_FULL_TITLE}</em> [Software]. Version {APP_VERSION}.
          </p>
          <div className="bg-gray-900 border border-gray-700 rounded p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">BibTeX</h3>
            <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{`@software{epsilonlab${year},
  author  = {${APP_AUTHOR}},
  title   = {${APP_FULL_TITLE}},
  year    = {${year}},
  version = {${APP_VERSION}},
  note    = {Client-side differential privacy teaching simulator}
}`}</pre>
          </div>
        </section>

        {/* Core references */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">Core Differential Privacy References</h2>
          <ol className="list-decimal list-inside space-y-3">
            {CORE_REFERENCES.map((r) => (
              <li key={r.id} className="text-sm text-gray-400 leading-relaxed">
                <span className="text-gray-300">{r.apa}</span>
                {r.notes && (
                  <p className="ml-6 mt-1 text-xs text-gray-500 italic">{r.notes}</p>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Advanced references */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200">
            Advanced References
            <span className="ml-2 text-xs font-normal text-gray-500">(advanced)</span>
          </h2>
          <ol className="list-decimal list-inside space-y-3">
            {ADVANCED_REFERENCES.map((r) => (
              <li key={r.id} className="text-sm text-gray-400 leading-relaxed">
                <span className="text-gray-300">{r.apa}</span>
                {r.notes && (
                  <p className="ml-6 mt-1 text-xs text-gray-500 italic">{r.notes}</p>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
