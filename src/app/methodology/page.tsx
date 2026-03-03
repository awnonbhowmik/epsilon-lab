import Link from "next/link";
import { METHODOLOGY_SECTIONS, FUTURE_WORK } from "@/lib/content/methodology";
import { APP_NAME, APP_VERSION } from "@/lib/version";

export const metadata = {
  title: `Methodology — ${APP_NAME}`,
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">Compare</Link>
        <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">Composition</Link>
        <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">Appendix</Link>
        <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">References</Link>
        <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Methodology</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">Methodology, Accuracy, and Limitations</h1>

        {METHODOLOGY_SECTIONS.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-200">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-gray-400 leading-relaxed">{p}</p>
            ))}
          </section>
        ))}

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-200">Future Work</h2>
          <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
            {FUTURE_WORK.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
