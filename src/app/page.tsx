import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "EpsilonLab — Differential Privacy Simulator",
  description:
    "Free, browser-based differential privacy simulator for classroom instruction. Laplace & Gaussian mechanisms, presets, exports, and more.",
};

const features = [
  {
    title: "Interactive DP Simulator",
    desc: "Adjust ε, δ, and sensitivity in real time.",
  },
  {
    title: "Mechanism Comparison",
    desc: "Compare Laplace and Gaussian mechanisms visually.",
  },
  {
    title: "Classroom Presets",
    desc: "Pre-built demos and shareable configurations.",
  },
  {
    title: "Export Materials",
    desc: "Generate classroom-ready PDFs and reports.",
  },
];

const audiences = [
  { role: "Instructors", desc: "Demonstrate DP concepts live in lectures." },
  { role: "Students", desc: "Experiment and build intuition interactively." },
  { role: "Researchers", desc: "Illustrate privacy-utility tradeoffs clearly." },
];

const screenshots = [
  { label: "Simulator controls and live output", src: "/screenshots/simulator.png" },
  { label: "Charts and distribution visualization", src: "/screenshots/charts.png" },
  { label: "Composition theorem demo", src: "/screenshots/composition.png" },
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

        {/* Screenshots */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">See It in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {screenshots.map((item) => (
              <div
                key={item.label}
                className="border border-gray-800 rounded-lg bg-gray-900/50 overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={600}
                  height={375}
                  className="w-full h-auto"
                />
                <p className="text-center text-xs text-gray-500 py-2">
                  {item.label}
                </p>
              </div>
            ))}
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
