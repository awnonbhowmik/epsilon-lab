import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Student",
    price: "Free",
    description: "Full access to the simulator for individual learning.",
    features: [
      "Access simulator",
      "All mechanisms",
      "Presets",
      "Shareable links",
      "CSV dataset upload",
      "Charts & visualizations",
    ],
    cta: "Open Simulator",
    href: "/simulator",
    highlight: false,
  },
  {
    name: "Instructor",
    price: "$149",
    period: "per semester",
    description: "Everything you need to teach differential privacy.",
    features: [
      "Classroom pack export",
      "Lesson plans",
      "Preset library management",
      "Instructor dashboard",
      "Instructor materials",
      "Email support",
    ],
    cta: "Instructor License Request",
    href: "/contact?intent=instructor",
    highlight: true,
  },
  {
    name: "Institutional",
    price: "Contact for pricing",
    description: "Department-wide deployment with dedicated support.",
    features: [
      "Privacy accountant",
      "Advanced composition tools",
      "Department access",
      "Unlimited instructors",
      "Priority support",
      "Custom demos",
    ],
    cta: "Institutional Licensing",
    href: "/contact?intent=institution",
    highlight: false,
  },
];

const licensingSteps = [
  "Submit a request via the contact form.",
  "We review your request and follow up within 48 hours.",
  "You receive a license token and setup instructions.",
  "Activate your license — no on-site payment required yet.",
  "Reach out anytime for support or renewals.",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-center mb-4">Pricing</h1>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
          EpsilonLab is free for students. Instructors and institutions can
          request a license below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border p-6 flex flex-col ${
                tier.highlight
                  ? "border-indigo-500 bg-indigo-950/30"
                  : "border-gray-800 bg-gray-900/50"
              }`}
            >
              <h2 className="text-xl font-bold mb-1">{tier.name}</h2>
              <p className="text-2xl font-extrabold text-indigo-400 mb-1">
                {tier.price}
              </p>
              {tier.period && (
                <p className="text-xs text-gray-500 mb-3">{tier.period}</p>
              )}
              <p className="text-sm text-gray-400 mb-4">{tier.description}</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`block text-center py-2 rounded-lg font-semibold transition-colors ${
                  tier.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* How licensing works */}
        <div className="mt-12 max-w-2xl mx-auto border border-gray-800 rounded-lg p-6 bg-gray-900/50">
          <h3 className="text-lg font-bold mb-3">How Licensing Works</h3>
          <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
            {licensingSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Payments are not processed online yet.{" "}
          <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 underline">
            Contact us for licensing.
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
