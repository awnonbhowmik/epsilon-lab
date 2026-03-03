import { Suspense } from "react";
import Simulator from "@/components/Simulator";
import Link from "next/link";

export default function Home() {
  return (
    <Suspense>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Landing nav links */}
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-2 flex gap-4 text-xs">
          <Link href="/simulator" className="text-indigo-400 hover:text-indigo-300 underline">
            Simulator
          </Link>
          <Link href="/for-instructors" className="text-indigo-400 hover:text-indigo-300 underline">
            For Instructors
          </Link>
          <Link href="/classroom-pack" className="text-indigo-400 hover:text-indigo-300 underline">
            Classroom Pack
          </Link>
          <Link href="/embed" className="text-indigo-400 hover:text-indigo-300 underline">
            Embed
          </Link>
          <Link href="/lesson-plan" className="text-indigo-400 hover:text-indigo-300 underline">
            Instructor Lesson Plan
          </Link>
          <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 underline">
            Compare
          </Link>
          <Link href="/composition" className="text-indigo-400 hover:text-indigo-300 underline">
            Composition
          </Link>
          <Link href="/appendix" className="text-indigo-400 hover:text-indigo-300 underline">
            Appendix
          </Link>
          <Link href="/references" className="text-indigo-400 hover:text-indigo-300 underline">
            References
          </Link>
          <Link href="/methodology" className="text-indigo-400 hover:text-indigo-300 underline">
            Methodology
          </Link>
        </nav>
        <Simulator />
      </div>
    </Suspense>
  );
}
