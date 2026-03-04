import { Suspense } from "react";
import InstructorDashboard from "@/components/InstructorDashboard";

/**
 * Instructor Dashboard — `/instructor`
 *
 * Access controlled via license flag (?license=instructor or ?license=institution).
 * Features: preset manager, classroom pack links, quick demo links, privacy accountant.
 */
export default function InstructorPage() {
  return (
    <Suspense>
      <InstructorDashboard />
    </Suspense>
  );
}
