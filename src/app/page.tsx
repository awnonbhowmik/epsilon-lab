import Link from "next/link";
import Footer from "@/components/Footer";
import MechanismCard from "@/components/MechanismCard";

export const metadata = {
  title: "EpsilonLab — Differential Privacy Simulator",
  description:
    "Free, browser-based differential privacy simulator for classroom instruction. 7 mechanisms, privacy budget manager, and more.",
};

const features = [
  {
    title: "Interactive DP Simulator",
    desc: "Adjust ε, δ, and sensitivity in real time. Laplace & Gaussian mechanisms with full chart output.",
  },
  {
    title: "7 Mechanisms",
    desc: "Laplace, Gaussian, Exponential, Randomized Response, Report Noisy Max, Discrete Laplace, and Histogram.",
  },
  {
    title: "Privacy Budget Manager",
    desc: "Track cumulative ε-consumption across multiple queries with a real-time budget bar and CSV export.",
  },
  {
    title: "Composition Theorems",
    desc: "Sequential and parallel composition visualized. Advanced composition via Rényi DP accounting.",
  },
];

const audiences = [
  { role: "Instructors", desc: "Demonstrate DP concepts live in lectures." },
  { role: "Students", desc: "Experiment and build intuition interactively." },
  { role: "Researchers", desc: "Illustrate privacy-utility tradeoffs clearly." },
];

const SHOWCASE_MECHANISMS = [
  {
    name: "Exponential Mechanism",
    description: "Select non-numeric outputs with privacy-preserving sampling proportional to exp(ε·u/2Δu).",
    guarantee: "ε-DP",
    href: "/mechanisms/exponential",
  },
  {
    name: "Randomized Response",
    description: "Local DP for binary surveys — answer truthfully with probability eᵉ/(1+eᵉ).",
    guarantee: "ε-DP (local)",
    href: "/mechanisms/randomized-response",
  },
  {
    name: "Discrete Laplace",
    description: "The geometric mechanism for integer queries — exact and optimal for counting.",
    guarantee: "ε-DP",
    href: "/mechanisms/discrete-laplace",
  },
  {
    name: "Histogram Mechanism",
    description: "Add Laplace noise to each bin. Parallel composition keeps total cost at ε.",
    guarantee: "ε-DP",
    href: "/mechanisms/histogram",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
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
            Teach, learn, and demonstrate differential privacy with an
            interactive simulator built for the classroom.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Try Simulator
            </Link>
            <Link
              href="/contact?intent=instructor"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Instructor License Request
            </Link>
          </div>
          <Link
            href="/pricing"
            className="inline-block mt-4 text-sm text-gray-500 hover:text-indigo-300 transition-colors"
          >
            View Pricing →
          </Link>
        </section>

        {/* What it does */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">What It Does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-gray-800 rounded-lg p-5 bg-gray-900/50"
              >
                <h3 className="font-semibold text-indigo-300 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mechanism showcase */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Mechanism Showcase</h2>
            <Link
              href="/mechanisms"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              All 7 mechanisms →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SHOWCASE_MECHANISMS.map((m) => (
              <MechanismCard key={m.name} {...m} />
            ))}
          </div>
        </section>

        {/* For Instructors CTA */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">Teaching a Privacy Course?</h2>
              <p className="text-sm text-gray-400">
                Get curated presets, lesson plans, and embed the simulator
                directly in your LMS.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/classroom-pack"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors whitespace-nowrap"
              >
                Get the Classroom Pack →
              </Link>
              <Link
                href="/for-instructors#embed"
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Embed in Your LMS →
              </Link>
            </div>
          </div>
        </section>

        {/* Who it is for */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">Who It&apos;s For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {audiences.map((a) => (
              <div key={a.role} className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                <h3 className="text-lg font-bold text-indigo-300 mb-2">{a.role}</h3>
                <p className="text-sm text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Try Simulator
            </Link>
            <Link
              href="/contact?intent=instructor"
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Instructor License Request
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
