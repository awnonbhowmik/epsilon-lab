import type { Metadata } from "next";
import Script from "next/script";
import "katex/dist/katex.min.css";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: {
    default: "EpsilonLab — Differential Privacy Simulator",
    template: "%s — EpsilonLab",
  },
  description:
    "Interactive platform for learning and demonstrating differential privacy. Free for students, built for instructors.",
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const isProduction = process.env.NODE_ENV === "production";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">
        <ClientShell>{children}</ClientShell>
        {/*
          Privacy-friendly analytics (Plausible) — loaded only when:
            1. NODE_ENV is "production"
            2. NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set
          No cookies, no personal data. Users can opt out by setting
          localStorage.plausible_ignore = "true" in their browser console.
        */}
        {isProduction && plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
