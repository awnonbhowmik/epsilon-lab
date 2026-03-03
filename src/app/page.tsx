import { Suspense } from "react";
import Simulator from "@/components/Simulator";

export default function Home() {
  return (
    <Suspense>
      <Simulator />
    </Suspense>
  );
}
