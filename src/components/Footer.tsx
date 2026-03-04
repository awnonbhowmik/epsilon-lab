import Link from "next/link";
import { APP_VERSION } from "@/lib/version";

const productLinks = [
  { label: "Simulator", href: "/simulator" },
  { label: "Presets", href: "/for-instructors" },
  { label: "Classroom Pack", href: "/classroom-pack" },
];

const resourceLinks = [
  { label: "Lesson Plan", href: "/lesson-plan" },
  { label: "Compare", href: "/compare" },
  { label: "Composition", href: "/composition" },
  { label: "Appendix", href: "/appendix" },
  { label: "References", href: "/references" },
  { label: "Methodology", href: "/methodology" },
];

const companyLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
  { label: "License", href: "/license" },
  { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <p className="font-bold text-gray-100 mb-2">
            <span className="text-indigo-400">ε</span> EpsilonLab
          </p>
          <p className="text-xs text-gray-500">
            Interactive Differential Privacy Simulation Platform
          </p>
          <p className="text-xs text-gray-600 mt-2">v{APP_VERSION}</p>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Product</h4>
          <ul className="space-y-1">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-indigo-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Resources</h4>
          <ul className="space-y-1">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-indigo-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Company</h4>
          <ul className="space-y-1">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-indigo-300 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center text-xs text-gray-600 py-4">
        © {new Date().getFullYear()} EpsilonLab. All rights reserved.
      </div>
    </footer>
  );
}
