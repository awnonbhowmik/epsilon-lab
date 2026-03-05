import Footer from "@/components/Footer";
import MechanismCard from "@/components/MechanismCard";

export const metadata = {
  title: "Mechanisms — EpsilonLab",
  description:
    "Explore all seven differential privacy mechanisms available in EpsilonLab.",
};

const MECHANISMS = [
  {
    name: "Laplace Mechanism",
    description:
      "Adds Laplace-distributed noise calibrated to the global ℓ₁-sensitivity. The foundational pure ε-DP mechanism for numeric queries.",
    guarantee: "ε-DP",
    href: "/simulator?mechanism=laplace",
    accentColor: "indigo",
  },
  {
    name: "Gaussian Mechanism",
    description:
      "Adds Gaussian noise calibrated to the ℓ₂-sensitivity. Provides (ε,δ)-DP and has better composition properties than Laplace.",
    guarantee: "(ε,δ)-DP",
    href: "/simulator?mechanism=gaussian",
    accentColor: "violet",
  },
  {
    name: "Exponential Mechanism",
    description:
      "For non-numeric outputs: samples a candidate with probability proportional to exp(ε·u/2Δu). Ideal for selection and ranking tasks.",
    guarantee: "ε-DP",
    href: "/mechanisms/exponential",
    accentColor: "indigo",
  },
  {
    name: "Randomized Response",
    description:
      "Local DP for binary surveys: each respondent answers truthfully with probability p = eᵉ/(1+eᵉ), providing plausible deniability.",
    guarantee: "ε-DP (local)",
    href: "/mechanisms/randomized-response",
    accentColor: "indigo",
  },
  {
    name: "Report Noisy Max",
    description:
      "Adds Laplace noise to each candidate count and returns the argmax. A pure DP alternative to the exponential mechanism for counts.",
    guarantee: "ε-DP",
    href: "/mechanisms/report-noisy-max",
    accentColor: "indigo",
  },
  {
    name: "Discrete Laplace",
    description:
      "The geometric mechanism for integer-valued queries. Noise follows a two-sided geometric distribution — exact for counting queries.",
    guarantee: "ε-DP",
    href: "/mechanisms/discrete-laplace",
    accentColor: "indigo",
  },
  {
    name: "Histogram Mechanism",
    description:
      "Adds independent Laplace noise to each bin. Uses parallel composition — the privacy cost is ε regardless of the number of bins.",
    guarantee: "ε-DP",
    href: "/mechanisms/histogram",
    accentColor: "indigo",
  },
];

export default function MechanismsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            DP Mechanism Library
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Seven differential privacy mechanisms, from the classic Laplace and
            Gaussian to local DP and histogram variants. Each page includes an
            interactive simulator and formal theory with KaTeX-rendered proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MECHANISMS.map((m) => (
            <MechanismCard key={m.name} {...m} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
