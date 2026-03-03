import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-indigo-400">ε</span>
          <span className="text-xl font-bold text-gray-100">EpsilonLab</span>
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link href="/" className="hover:text-indigo-300">Home</Link>
          <Link href="/pricing" className="hover:text-indigo-300">Pricing</Link>
          <Link href="/contact" className="hover:text-indigo-300">Contact</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-10">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Information Collected
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            EpsilonLab runs entirely in your browser. Simulator inputs such as
            dataset selections, epsilon values, and mechanism choices are
            processed locally and are <strong>not</strong> transmitted to or
            stored on any server. Optional lightweight, privacy-friendly
            analytics may collect anonymous page-view counts in production; no
            personal data is collected.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Data Storage
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            No personal data is stored. EpsilonLab does not use a database and
            does not persist any user information between sessions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Cookies
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            EpsilonLab does not require cookies. No tracking cookies are set at
            any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Analytics
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            In production, EpsilonLab may use{" "}
            <a
              href="https://plausible.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Plausible Analytics
            </a>
            , a lightweight, cookie-free, privacy-first analytics service. It
            collects only anonymous, aggregate page-view counts — no personal
            data, no tracking cookies, and no cross-site tracking.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong>Opt out:</strong> To disable analytics in your browser, open
            your browser console and run{" "}
            <code className="text-indigo-300 bg-gray-900 px-1 rounded">
              localStorage.plausible_ignore = &quot;true&quot;
            </code>
            . Analytics will no longer be recorded for your visits.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Contact
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            For privacy-related questions, please{" "}
            <Link
              href="/contact"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              contact us
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
