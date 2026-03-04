import Link from "next/link";

export default function LessonPlanPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-400">
            ε EpsilonLab — Instructor Lesson Plan
          </h1>
          <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 underline">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Learning Objectives */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Learning Objectives</h2>
          <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
            <li>
              <strong>Understand the privacy–utility tradeoff:</strong> Students will be able to explain
              how the privacy budget ε controls the amount of noise added to query answers and
              demonstrate this with the simulator.
            </li>
            <li>
              <strong>Compare Laplace and Gaussian mechanisms:</strong> Students will be able to
              articulate when each mechanism is appropriate and how the additional δ parameter in
              the Gaussian mechanism affects the privacy guarantee.
            </li>
            <li>
              <strong>Apply sequential composition:</strong> Students will be able to compute the
              total privacy budget consumed by multiple queries on the same dataset using basic
              sequential composition.
            </li>
          </ol>
        </section>

        {/* Lecture Outline */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Lecture Outline (20–30 minutes)</h2>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex gap-3">
              <span className="text-indigo-400 font-mono shrink-0 w-20">0–5 min</span>
              <div>
                <strong>Introduction to Differential Privacy.</strong> Motivation: why adding noise
                to query results protects individual records. Define ε-DP informally.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-mono shrink-0 w-20">5–10 min</span>
              <div>
                <strong>Laplace Mechanism Demo.</strong> Open the simulator with Laplace mechanism,
                Sum query, Small Integers dataset. Show how ε slider changes the noise distribution
                and error. Demonstrate seed for reproducibility.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-mono shrink-0 w-20">10–15 min</span>
              <div>
                <strong>Gaussian Mechanism.</strong> Switch to Gaussian mechanism. Explain (ε, δ)-DP.
                Show how δ affects σ. Compare the noise PDF shapes side by side by toggling
                mechanism.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-mono shrink-0 w-20">15–22 min</span>
              <div>
                <strong>Sequential Composition.</strong> Switch to Composition topic. Show how
                ε_total grows linearly with k queries. Discuss implications for data analysts
                who need to run many queries.
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-400 font-mono shrink-0 w-20">22–30 min</span>
              <div>
                <strong>Student Exercises.</strong> Students work through the exercises below
                independently or in pairs, using the simulator.
              </div>
            </div>
          </div>
        </section>

        {/* Guided Demos */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Guided Demos</h2>

          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
              <h3 className="text-sm font-bold text-indigo-200 mb-2">Demo 1: Laplace Mechanism — Privacy vs. Utility</h3>
              <p className="text-xs text-gray-400 mb-2">
                <strong>Parameters:</strong> Dataset = Small Integers, Query = Sum, Mechanism = Laplace,
                Runs = 500, Seed = 42
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
                <li>Set ε = 0.1. Observe wide noise distribution, large errors.</li>
                <li>Increase ε to 1.0. Note how the histogram tightens around the true value.</li>
                <li>Set ε = 10. Almost no noise — but poor privacy guarantee.</li>
                <li>Toggle to Academic mode to see the Laplace scale b = Δf/ε change.</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Expected outcome:</strong> Students see the smooth tradeoff between noise
                magnitude and ε, with the Utility vs. ε chart confirming the 1/ε relationship.
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
              <h3 className="text-sm font-bold text-indigo-200 mb-2">Demo 2: Gaussian vs. Laplace Comparison</h3>
              <p className="text-xs text-gray-400 mb-2">
                <strong>Parameters:</strong> Dataset = Small Integers, Query = Sum, Runs = 500,
                ε = 1.0, Seed = 42
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-1">
                <li>Run with Laplace mechanism. Note the PDF shape (sharp peak, heavy tails).</li>
                <li>Switch to Gaussian mechanism, set δ = 1e-5. Run again.</li>
                <li>Compare: Gaussian PDF is bell-shaped with lighter tails but wider body.</li>
                <li>Compare the mean absolute errors between the two mechanisms.</li>
                <li>Discuss: Gaussian provides (ε, δ)-DP — slightly weaker guarantee but
                    often preferred in practice due to better composition properties.</li>
              </ol>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Expected outcome:</strong> Students understand the visual and quantitative
                differences between the two noise distributions and can articulate why the
                Gaussian mechanism requires an additional δ parameter.
              </p>
            </div>
          </div>
        </section>

        {/* Student Exercises */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Student Exercises</h2>

          <div className="space-y-4">
            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
              <h3 className="text-sm font-bold text-indigo-200 mb-1">Exercise 1: Sensitivity Exploration</h3>
              <p className="text-xs text-gray-300">
                Using the Small Integers dataset with ε = 1.0 and the Laplace mechanism:
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 mt-1">
                <li>Run the Sum query and note b and the mean error.</li>
                <li>Switch to Mean query. How does b change? Why?</li>
                <li>Switch to Count query. What is b now? Explain the difference.</li>
              </ol>
              <p className="text-xs text-gray-500 mt-1">
                <em>Hint: Look at how Δf differs for each query type.</em>
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
              <h3 className="text-sm font-bold text-indigo-200 mb-1">Exercise 2: Delta Sensitivity</h3>
              <p className="text-xs text-gray-300">
                Using the Gaussian mechanism with ε = 1.0 and Sum query:
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 mt-1">
                <li>Set δ = 1e-3 and note σ and the mean error.</li>
                <li>Set δ = 1e-5. How does σ change?</li>
                <li>Set δ = 1e-7. What happens to the noise?</li>
                <li>Explain the relationship between δ and σ qualitatively.</li>
              </ol>
            </div>

            <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
              <h3 className="text-sm font-bold text-indigo-200 mb-1">Exercise 3: Composition Budget Planning</h3>
              <p className="text-xs text-gray-300">
                Switch to the Composition topic:
              </p>
              <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1 mt-1">
                <li>You have a total privacy budget of ε_total = 2.0. If you need to run
                    k = 10 queries, what per-query ε can you afford?</li>
                <li>If you switch to k = 5 queries, how does your per-query budget change?</li>
                <li>For the Gaussian mechanism with δ_total = 1e-4 and k = 10, what per-query
                    δ should you use?</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Copy Demo Link */}
        <section>
          <h2 className="text-lg font-bold text-indigo-300 mb-3">Demo Links</h2>
          <p className="text-xs text-gray-400 mb-2">
            Copy these URLs and share with students as starting points for each demo:
          </p>
          <div className="space-y-2 text-xs font-mono bg-gray-900 border border-gray-700 rounded p-3 text-gray-300 break-all">
            <p>
              <strong className="text-indigo-400">Demo 1 (Laplace):</strong>{" "}
              <Link href="/simulator?d=small_integers&q=sum&e=1&s=15&r=500&seed=42&m=student&adv=0&mech=laplace&topic=single" className="text-indigo-400 hover:text-indigo-300 underline">
                /simulator?d=small_integers&q=sum&e=1&s=15&r=500&seed=42&m=student&adv=0&mech=laplace&topic=single
              </Link>
            </p>
            <p>
              <strong className="text-indigo-400">Demo 2 (Gaussian):</strong>{" "}
              <Link href="/simulator?d=small_integers&q=sum&e=1&s=15&r=500&seed=42&m=student&adv=0&mech=gaussian&topic=single&dl=0.00001" className="text-indigo-400 hover:text-indigo-300 underline">
                /simulator?d=small_integers&q=sum&e=1&s=15&r=500&seed=42&m=student&adv=0&mech=gaussian&topic=single&dl=0.00001
              </Link>
            </p>
            <p>
              <strong className="text-indigo-400">Composition:</strong>{" "}
              <Link href="/simulator?d=small_integers&q=sum&e=0.5&s=15&r=100&m=academic&adv=0&mech=laplace&topic=comp" className="text-indigo-400 hover:text-indigo-300 underline">
                /simulator?d=small_integers&q=sum&e=0.5&s=15&r=100&m=academic&adv=0&mech=laplace&topic=comp
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
