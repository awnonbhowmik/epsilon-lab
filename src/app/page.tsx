import Link from "next/link";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import DiagnosticsPanel from "@/components/DiagnosticsPanel";

const features = [
  {
    title: "Interactive Simulator",
    desc: "Adjust ε, δ, sensitivity and observe results instantly.",
    href: "/simulator",
  },
  {
    title: "Mechanism Comparison",
    desc: "Explore Laplace and Gaussian mechanisms visually.",
    href: "/compare",
  },
  {
    title: "Classroom Presets",
    desc: "Prebuilt demos for lectures and tutorials.",
    href: "/for-instructors#presets",
  },
  {
    title: "Export & Classroom Pack",
    desc: "Generate PDFs and lecture-ready materials.",
    href: "/classroom-pack",
  },
];

const useCases = [
  { role: "Instructors", desc: "Demonstrate DP concepts live", href: "/for-instructors" },
  { role: "Students", desc: "Experiment and build intuition", href: "/simulator" },
  { role: "Researchers", desc: "Illustrate privacy-utility tradeoffs", href: "/methodology" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Nav */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-indigo-400">ε</span>
          <span className="text-xl font-bold text-gray-100">EpsilonLab</span>
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link href="/simulator" className="hover:text-indigo-300">Simulator</Link>
          <Link href="/for-instructors" className="hover:text-indigo-300">Instructors</Link>
          <Link href="/pricing" className="hover:text-indigo-300">Pricing</Link>
          <Link href="/contact" className="hover:text-indigo-300">Contact</Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-indigo-400">Epsilon</span>Lab
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Interactive Differential Privacy Simulation Platform
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Visualize privacy-utility tradeoffs, compare mechanisms, and
            demonstrate differential privacy concepts in real time.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Open Simulator
            </Link>
            <Link
              href="/for-instructors"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              For Instructors
            </Link>
            <Link
              href="/for-instructors#presets"
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              View Presets
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="border border-gray-800 rounded-lg p-5 bg-gray-900/50 hover:border-indigo-500 transition-colors block"
              >
                <h3 className="font-semibold text-indigo-300 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {useCases.map((uc) => (
              <Link key={uc.role} href={uc.href} className="p-6 block hover:bg-gray-900/50 rounded-lg transition-colors">
                <h3 className="text-lg font-bold text-indigo-300 mb-2">
                  {uc.role}
                </h3>
                <p className="text-sm text-gray-400">{uc.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Screenshots */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">
            See It in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Simulator", src: "/screenshots/simulator.png" },
              { label: "Charts", src: "/screenshots/charts.png" },
              { label: "Composition Demo", src: "/screenshots/composition.png" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gray-800 rounded-lg bg-gray-900/50 overflow-hidden"
              >
                <img
                  src={item.src}
                  alt={`${item.label} screenshot`}
                  className="w-full h-auto"
                />
                <p className="text-center text-xs text-gray-500 py-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8">
            Try the simulator now or reach out for an institutional license.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Try Simulator
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Contact for Institutional License
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <DiagnosticsPanel />
    </div>
  );
}
