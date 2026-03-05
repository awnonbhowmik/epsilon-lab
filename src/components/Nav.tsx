"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string; separator?: boolean }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Simulator", href: "/simulator" },
  {
    label: "Mechanisms",
    children: [
      { label: "Laplace", href: "/simulator?mechanism=laplace" },
      { label: "Gaussian", href: "/simulator?mechanism=gaussian" },
      { label: "Exponential", href: "/mechanisms/exponential" },
      { label: "Randomized Response", href: "/mechanisms/randomized-response" },
      { label: "Report Noisy Max", href: "/mechanisms/report-noisy-max" },
      { label: "Discrete Laplace", href: "/mechanisms/discrete-laplace" },
      { label: "Histogram", href: "/mechanisms/histogram" },
      { label: "All Mechanisms", href: "/mechanisms", separator: true },
    ],
  },
  { label: "Composition", href: "/composition" },
  { label: "Compare", href: "/compare" },
  { label: "Budget", href: "/budget" },
  {
    label: "Learn",
    children: [
      { label: "Appendix", href: "/appendix" },
      { label: "Methodology", href: "/methodology" },
      { label: "References", href: "/references" },
    ],
  },
  {
    label: "For Instructors",
    children: [
      { label: "Overview", href: "/for-instructors" },
      { label: "Classroom Pack", href: "/classroom-pack" },
      { label: "Lesson Plan", href: "/lesson-plan" },
      { label: "Embed", href: "/for-instructors#embed" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];

function DropdownMenu({
  items,
}: {
  items: { label: string; href: string; separator?: boolean }[];
}) {
  return (
    <div className="absolute top-full left-0 mt-1 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
      {items.map((item, i) => (
        <div key={item.href}>
          {item.separator && i > 0 && (
            <div className="border-t border-gray-700 my-1" />
          )}
          <Link
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-indigo-300 transition-colors"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  );
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = item.href
    ? pathname === item.href || pathname?.startsWith(item.href + "/")
    : item.children?.some((c) => pathname === c.href);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href!}
        className={`text-sm transition-colors ${
          isActive
            ? "text-indigo-400"
            : "text-gray-400 hover:text-indigo-300"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-1 text-sm transition-colors ${
          isActive ? "text-indigo-400" : "text-gray-400 hover:text-indigo-300"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && <DropdownMenu items={item.children} />}
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Hide nav on embed route
  if (pathname === "/embed") return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.svg" alt="EpsilonLab logo" width={28} height={28} />
          <span className="text-xl font-bold text-gray-100">EpsilonLab</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.label} item={item} />
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-gray-200"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 space-y-1 text-sm border-t border-gray-800 pt-3">
          {NAV_ITEMS.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 px-2 rounded ${
                    pathname === item.href
                      ? "text-indigo-400"
                      : "text-gray-400 hover:text-indigo-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            const isExpanded = expandedGroup === item.label;
            return (
              <div key={item.label}>
                <button
                  className="w-full flex items-center justify-between py-2 px-2 rounded text-gray-400 hover:text-indigo-300"
                  onClick={() =>
                    setExpandedGroup(isExpanded ? null : item.label)
                  }
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="pl-4 space-y-0.5 border-l border-gray-700 ml-2">
                    {item.children.map((child) => (
                      <div key={child.href}>
                        {child.separator && (
                          <div className="border-t border-gray-700 my-1" />
                        )}
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 text-gray-400 hover:text-indigo-300"
                        >
                          {child.label}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
