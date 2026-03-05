import { Suspense } from "react";
import Simulator from "@/components/Simulator";

export const metadata = {
  title: "Simulator",
  description:
    "Run interactive differential privacy simulations with Laplace and Gaussian mechanisms.",
};

export default function SimulatorPage() {
  return (
    <Suspense>
      <Simulator />
    </Suspense>
  );
}
