import Link from "next/link";
import PresetPicker from "@/components/PresetPicker";
import ClassSessionChecklist from "@/components/ClassSessionChecklist";

export default function ForInstructorsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">
            ε EpsilonLab — For Instructors
          </h1>
          <Link
            href="/"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Quick start */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Quick Start
          </h2>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
            <li>
              <strong>Pick a preset</strong> from the library below — each one
              demonstrates a specific DP concept.
            </li>
            <li>
              <strong>Open in the simulator</strong> or copy the share link to
              distribute to students.
            </li>
            <li>
              <strong>Use the Classroom Pack</strong> to generate a single PDF
              handout for your lecture.
            </li>
            <li>
              <strong>Embed in your LMS</strong> — see the embedding
              instructions below for Canvas, Blackboard, or Moodle.
            </li>
          </ol>
        </section>

        {/* Demo Presets */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Demo Presets Library
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Curated simulator configurations for common teaching scenarios.
            Click &quot;Open&quot; to launch or &quot;Copy link&quot; to share.
          </p>
          <PresetPicker />
        </section>

        {/* Class Session Checklist */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Class Session Checklist
          </h2>
          <ClassSessionChecklist />
        </section>

        {/* Embed instructions */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            How to Embed in Your LMS
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            EpsilonLab has an embed-friendly mode that hides navigation chrome.
            Use an <code className="text-indigo-300">&lt;iframe&gt;</code> in
            your LMS page:
          </p>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap break-all">
{`<iframe
  src="https://YOUR_DOMAIN/embed?d=small_integers&q=sum&e=1&s=15&r=500&mech=laplace&topic=single"
  width="100%"
  height="800"
  frameborder="0"
  allow="clipboard-write"
  style="border:none; border-radius:8px;"
></iframe>`}
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <div>
              <h4 className="font-bold text-indigo-200">Canvas</h4>
              <p className="text-xs text-gray-400">
                Edit a page → HTML editor → paste the iframe snippet above.
                Replace <code className="text-indigo-300">YOUR_DOMAIN</code>{" "}
                with your EpsilonLab deployment URL.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-indigo-200">Blackboard</h4>
              <p className="text-xs text-gray-400">
                Content → Build Content → Web Link or HTML fragment. Paste the
                iframe snippet.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-indigo-200">Moodle</h4>
              <p className="text-xs text-gray-400">
                Edit a Label or Page resource → toggle HTML source → paste the
                iframe snippet.
              </p>
            </div>
          </div>
        </section>

        {/* Reproducibility tips */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Reproducibility Tips
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>
              Set the <strong>seed</strong> field (e.g. 42) for deterministic
              results across browser sessions.
            </li>
            <li>
              Share URLs with the seed included — students see identical output.
            </li>
            <li>
              Use Export PNG to capture a snapshot before class for slides.
            </li>
          </ul>
        </section>

        {/* Links */}
        <section className="flex gap-4 text-sm">
          <Link
            href="/classroom-pack"
            className="px-4 py-2 rounded border border-indigo-600 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40 transition-colors"
          >
            Generate Classroom Pack PDF →
          </Link>
          <Link
            href="/embed"
            className="px-4 py-2 rounded border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Preview Embed Mode →
          </Link>
        </section>
      </main>
    </div>
  );
}
