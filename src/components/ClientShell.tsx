"use client";

import { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ToastProvider";
import DiagnosticsPanel from "@/components/DiagnosticsPanel";
import Nav from "@/components/Nav";

/**
 * Client-side shell that wraps the entire app with:
 * - Nav (two-level dropdown navbar with hamburger menu on mobile)
 * - ErrorBoundary for graceful error handling
 * - ToastProvider for non-fatal notifications
 * - DiagnosticsPanel (Shift+D)
 *
 * This is a "use client" component so that ErrorBoundary (a class component)
 * and the context providers work correctly inside the server-rendered layout.
 */
export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Nav />
        {children}
        <Suspense>
          <DiagnosticsPanel />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  );
}
