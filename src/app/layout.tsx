import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EpsilonLab — Differential Privacy Simulator",
  description: "Interactive Differential Privacy teaching simulator using the Laplace mechanism",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
