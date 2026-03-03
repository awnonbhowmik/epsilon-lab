import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-1 no-underline">
      <span className="text-xl font-bold tracking-tight text-indigo-400">ε</span>
      <span className="text-xl font-bold tracking-tight text-gray-100">
        EpsilonLab
      </span>
    </Link>
  );
}
