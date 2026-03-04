import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <Image src="/logo.svg" alt="EpsilonLab logo" width={28} height={28} />
      <span className="text-xl font-bold tracking-tight text-gray-100">
        EpsilonLab
      </span>
    </Link>
  );
}
