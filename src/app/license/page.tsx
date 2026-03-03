import Link from "next/link";
import Footer from "@/components/Footer";

export default function LicensePage() {
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
        <h1 className="text-3xl font-bold">License Terms</h1>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Usage License
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            EpsilonLab is provided for educational and non-commercial research
            use. You may use, demonstrate, and share the simulator in classroom
            settings, academic workshops, and personal study. Commercial
            redistribution of EpsilonLab or its derivatives without prior written
            permission is not permitted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Attribution
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you use EpsilonLab in teaching materials, publications, or
            presentations, please cite it as:
          </p>
          <blockquote className="border-l-2 border-indigo-500 pl-4 mt-3 text-sm text-gray-400 italic">
            EpsilonLab: Interactive Differential Privacy Simulation Platform.
          </blockquote>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Warranty Disclaimer
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            EpsilonLab is provided &ldquo;as is&rdquo; for educational purposes
            only, without warranty of any kind, express or implied. The authors
            are not liable for any claim, damages, or other liability arising
            from the use of the software.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-indigo-300 mb-3">
            Future Licensing
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Institutional license agreements for department-wide deployment,
            custom integrations, and priority support are available upon request.
            Please{" "}
            <Link
              href="/contact"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              contact us
            </Link>{" "}
            for details.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
