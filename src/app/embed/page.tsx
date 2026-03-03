import { Suspense } from "react";
import Simulator from "@/components/Simulator";

export default function EmbedPage() {
  return (
    <Suspense>
      <Simulator embed />
    </Suspense>
  );
}
