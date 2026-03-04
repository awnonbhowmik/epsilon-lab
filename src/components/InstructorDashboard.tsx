"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { parseLicenseTier, isFeatureEnabled } from "@/lib/license/featureFlags";
import { APP_NAME, APP_VERSION } from "@/lib/version";

const PrivacyAccountant = dynamic(
  () => import("@/components/PrivacyAccountant"),
  { ssr: false },
);

export default function InstructorDashboard() {
  const searchParams = useSearchParams();
  const tier = parseLicenseTier(searchParams);
  const hasAccess = isFeatureEnabled(tier, "instructor_dashboard");

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-indigo-400">Instructor Dashboard</h1>
          <p className="text-gray-400">
            This feature requires an Instructor or Institution license.
          </p>
          <p className="text-sm text-gray-500">
            Add <code className="text-indigo-300">?license=instructor</code> to unlock,
            or <Link href="/pricing" className="text-indigo-400 underline hover:text-indigo-300">view pricing</Link>.
          </p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex flex-wrap gap-4 text-xs">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 underline">Home</Link>
        <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">Simulator</Link>
        <Link href="/for-instructors" className="text-indigo-400 hover:text-indigo-300 underline">Instructor Resources</Link>
        <Link href="/instructor" className="text-indigo-400 hover:text-indigo-300 underline font-semibold">Dashboard</Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-2xl font-bold text-indigo-400">Instructor Dashboard</h1>
        <p className="text-sm text-gray-400">
          License: <span className="text-indigo-300 font-semibold capitalize">{tier}</span>
        </p>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/simulator"
              className="block p-4 bg-gray-900 border border-gray-700 rounded hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200">Open Simulator</h3>
              <p className="text-xs text-gray-500 mt-1">Launch the DP simulator</p>
            </Link>
            <Link
              href="/classroom-pack"
              className="block p-4 bg-gray-900 border border-gray-700 rounded hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200">Classroom Pack</h3>
              <p className="text-xs text-gray-500 mt-1">Generate PDF handouts</p>
            </Link>
            <Link
              href="/lesson-plan"
              className="block p-4 bg-gray-900 border border-gray-700 rounded hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200">Lesson Plan</h3>
              <p className="text-xs text-gray-500 mt-1">View teaching materials</p>
            </Link>
            <Link
              href="/for-instructors"
              className="block p-4 bg-gray-900 border border-gray-700 rounded hover:border-indigo-500 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-200">Preset Library</h3>
              <p className="text-xs text-gray-500 mt-1">Curated demo configurations</p>
            </Link>
          </div>
        </section>

        {/* Quick Demo Links */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Quick Demo Links</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Laplace ε=0.1", href: "/simulator?mech=laplace&e=0.1" },
              { label: "Laplace ε=1", href: "/simulator?mech=laplace&e=1" },
              { label: "Gaussian ε=1 δ=1e-5", href: "/simulator?mech=gaussian&e=1&delta=0.00001" },
              { label: "Composition k=10", href: "/composition" },
              { label: "Privacy Accounting", href: "/privacy-accounting" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs bg-gray-800 text-indigo-300 rounded border border-gray-700 hover:border-indigo-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy Accountant */}
        {isFeatureEnabled(tier, "privacy_accountant") && (
          <section>
            <h2 className="text-lg font-bold text-indigo-300 mb-3">Privacy Accountant</h2>
            <PrivacyAccountant />
          </section>
        )}

        <footer className="border-t border-gray-800 pt-4 text-xs text-gray-600">
          {APP_NAME} v{APP_VERSION}
        </footer>
      </main>
    </div>
  );
}
