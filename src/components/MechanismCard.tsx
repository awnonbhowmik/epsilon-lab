import Link from "next/link";

export interface MechanismCardProps {
  name: string;
  description: string;
  guarantee: string; // e.g. "ε-DP" or "(ε,δ)-DP"
  href: string;
  accentColor?: string; // tailwind color class, default "indigo"
}

export default function MechanismCard({
  name,
  description,
  guarantee,
  href,
  accentColor = "indigo",
}: MechanismCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-3 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-semibold text-${accentColor}-300 text-base`}>
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
        className={`self-start text-sm text-${accentColor}-400 hover:text-${accentColor}-300 transition-colors`}
      >
        Explore →
      </Link>
    </div>
  );
}
