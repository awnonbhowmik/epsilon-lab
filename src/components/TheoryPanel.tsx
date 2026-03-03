"use client";

interface BlockProps {
  title: string;
  children: React.ReactNode;
}

function Block({ title, children }: BlockProps) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/60">
      <h4 className="text-sm font-bold text-indigo-300 mb-2 tracking-wide uppercase">
        {title}
      </h4>
      <div className="text-sm text-gray-300 space-y-2 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded font-mono text-indigo-200 text-xs overflow-x-auto">
      {children}
    </div>
  );
}

/**
 * Formal academic explanations of ε-differential privacy and the Laplace
 * mechanism.  Shown only in Academic mode.
 */
export default function TheoryPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Definition 1 */}
      <Block title="ε-Differential Privacy (Dwork et al., 2006)">
        <p>
          A randomised mechanism{" "}
          <span className="font-mono text-indigo-300">M : X → Y</span> satisfies{" "}
          <span className="font-mono text-indigo-300">ε</span>-differential
          privacy if, for all adjacent datasets{" "}
          <span className="font-mono text-indigo-300">x, x′ ∈ X</span>{" "}
          (differing in exactly one record) and all measurable{" "}
          <span className="font-mono text-indigo-300">S ⊆ Y</span>:
        </p>
        <Formula>Pr[M(x) ∈ S] ≤ e^ε · Pr[M(x′) ∈ S]</Formula>
        <p>
          The parameter <span className="font-mono text-indigo-300">ε &gt; 0</span>{" "}
          controls the privacy budget. As{" "}
          <span className="font-mono text-indigo-300">ε → 0</span> the
          outputs become indistinguishable; as{" "}
          <span className="font-mono text-indigo-300">ε → ∞</span> privacy
          guarantees vanish.
        </p>
      </Block>

      {/* Definition 2 */}
      <Block title="Global Sensitivity (ℓ₁)">
        <p>
          For a function{" "}
          <span className="font-mono text-indigo-300">f : X → ℝ</span>, the
          global ℓ₁-sensitivity is:
        </p>
        <Formula>Δf = max&#8203;&#8203;&#8203;&#8203; |f(x) − f(x′)|</Formula>
        <p>
          where the maximum is over all adjacent{" "}
          <span className="font-mono text-indigo-300">x, x′</span>.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Examples used in this simulator:
          <br />
          Sum:&nbsp; Δf = max value in dataset
          <br />
          Mean: Δf = max value / n
          <br />
          Count: Δf = 1
        </p>
      </Block>

      {/* Definition 3 */}
      <Block title="Laplace Mechanism">
        <p>
          Given{" "}
          <span className="font-mono text-indigo-300">f : X → ℝ</span> with
          sensitivity <span className="font-mono text-indigo-300">Δf</span>,
          the Laplace mechanism outputs:
        </p>
        <Formula>M(x) = f(x) + η,&nbsp;&nbsp;η ~ Lap(0, b),&nbsp;&nbsp;b = Δf / ε</Formula>
        <p>
          The Laplace PDF is{" "}
          <span className="font-mono text-indigo-300">
            p(η) = (1/2b) · exp(−|η|/b)
          </span>
          .
        </p>
        <p>
          The mechanism satisfies{" "}
          <span className="font-mono text-indigo-300">ε</span>-DP by the
          composition of the privacy loss random variable.
        </p>
      </Block>

      {/* Definition 4 */}
      <Block title="Privacy–Utility Tradeoff">
        <p>
          Utility is commonly measured by expected absolute error:
        </p>
        <Formula>
          E[|M(x) − f(x)|] = E[|η|] = b = Δf / ε
        </Formula>
        <p>
          Variance of the noise:{" "}
          <span className="font-mono text-indigo-300">Var[η] = 2b²</span>.
        </p>
        <p>
          Increasing <span className="font-mono text-indigo-300">ε</span>{" "}
          linearly decreases the expected error{" "}
          <span className="font-mono text-indigo-300">b</span> but weakens the
          privacy guarantee by a factor of{" "}
          <span className="font-mono text-indigo-300">e^ε</span> — an
          exponential cost. Practitioners choose{" "}
          <span className="font-mono text-indigo-300">ε</span> by balancing
          acceptable error against tolerable privacy loss.
        </p>
      </Block>

      {/* Sampling note */}
      <Block title="Inverse-CDF Sampling (implementation)">
        <p>
          This engine draws Laplace noise via the inverse CDF. Given{" "}
          <span className="font-mono text-indigo-300">
            U ~ Uniform(0, 1)
          </span>
          :
        </p>
        <Formula>η = −b · sign(U − ½) · ln(1 − 2|U − ½|)</Formula>
        <p>
          The RNG is ChaCha20, seeded with a user-supplied u64 for
          reproducibility or with OS entropy otherwise.
        </p>
      </Block>

      {/* Composition */}
      <Block title="Sequential Composition">
        <p>
          If <span className="font-mono text-indigo-300">k</span> mechanisms
          each satisfy{" "}
          <span className="font-mono text-indigo-300">εᵢ</span>-DP, their
          sequential composition satisfies:
        </p>
        <Formula>Σᵢ εᵢ-DP</Formula>
        <p>
          This means repeated queries on the same dataset consume the budget
          additively. Advanced composition (Dwork et al., 2010) improves this
          to{" "}
          <span className="font-mono text-indigo-300">
            O(ε √(k ln(1/δ)))
          </span>{" "}
          under (ε, δ)-DP.
        </p>
      </Block>
    </div>
  );
}
