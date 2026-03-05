"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { label: "Simulator", href: "/simulator" },
  { label: "For Instructors", href: "/for-instructors" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide header on embed route (designed for iframe usage)
  if (pathname === "/embed") return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="EpsilonLab logo" width={28} height={28} />
          <span className="text-xl font-bold text-gray-100">EpsilonLab</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-4 text-sm text-gray-400">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href || pathname?.startsWith(l.href + "/")
                  ? "text-indigo-300"
                  : "hover:text-indigo-300 transition-colors"
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-gray-200"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 text-sm">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-1 ${
                pathname === l.href ? "text-indigo-300" : "text-gray-400 hover:text-indigo-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
