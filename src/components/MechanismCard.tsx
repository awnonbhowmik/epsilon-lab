import Link from "next/link";

// Map color names to full static Tailwind class strings so Tailwind can
// include them at build time (dynamic template strings are not supported).
const COLOR_CLASSES: Record<string, { heading: string; link: string }> = {
  indigo: {
    heading: "text-indigo-300",
    link: "text-indigo-400 hover:text-indigo-300",
  },
  violet: {
    heading: "text-violet-300",
    link: "text-violet-400 hover:text-violet-300",
  },
  sky: {
    heading: "text-sky-300",
    link: "text-sky-400 hover:text-sky-300",
  },
  emerald: {
    heading: "text-emerald-300",
    link: "text-emerald-400 hover:text-emerald-300",
  },
};

export interface MechanismCardProps {
  name: string;
  description: string;
  guarantee: string; // e.g. "ε-DP" or "(ε,δ)-DP"
  href: string;
  accentColor?: string; // tailwind color name, default "indigo"
}

export default function MechanismCard({
  name,
  description,
  guarantee,
  href,
  accentColor = "indigo",
}: MechanismCardProps) {
  const colors = COLOR_CLASSES[accentColor] ?? COLOR_CLASSES.indigo;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-semibold text-base ${colors.heading}`}>
          {name}
        </h3>
        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-600 text-gray-300">
          {guarantee}
        </span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed flex-1">
        {description}
      </p>
      <Link
        href={href}
        className={`self-start text-sm transition-colors ${colors.link}`}
      >
        Explore →
      </Link>
    </div>
  );
}
