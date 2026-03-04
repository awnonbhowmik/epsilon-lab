import { Suspense } from "react";
import Simulator from "@/components/Simulator";
import ErrorBoundary from "@/components/ErrorBoundary";
import DiagnosticsPanel from "@/components/DiagnosticsPanel";

export default function SimulatorPage() {
  return (
    <ErrorBoundary>
      <Suspense>
        <Simulator />
      </Suspense>
      <DiagnosticsPanel />
    </ErrorBoundary>
  );
}
