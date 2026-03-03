import { Suspense } from "react";
import Simulator from "@/components/Simulator";

export default function SimulatorPage() {
  return (
    <Suspense>
      <Simulator />
    </Suspense>
  );
}
