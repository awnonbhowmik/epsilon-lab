"use client";

import MathTex from "./Math";

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

function Formula({ children }: { children: string }) {
  return (
    <div className="my-2 px-3 py-2 bg-gray-950 border border-gray-700 rounded text-indigo-200 text-xs overflow-x-auto">
      <MathTex display>{children}</MathTex>
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
          <MathTex>{"M : \\mathcal{X} \\to \\mathcal{Y}"}</MathTex> satisfies{" "}
          <MathTex>{"\\varepsilon"}</MathTex>-differential
          privacy if, for all adjacent datasets{" "}
          <MathTex>{"x, x' \\in \\mathcal{X}"}</MathTex>{" "}
          (differing in exactly one record) and all measurable{" "}
          <MathTex>{"S \\subseteq \\mathcal{Y}"}</MathTex>:
        </p>
        <Formula>{"\\Pr[M(x) \\in S] \\leq e^{\\varepsilon} \\cdot \\Pr[M(x') \\in S]"}</Formula>
        <p>
          The parameter <MathTex>{"\\varepsilon > 0"}</MathTex>{" "}
          controls the privacy budget. As{" "}
          <MathTex>{"\\varepsilon \\to 0"}</MathTex> the
          outputs become indistinguishable; as{" "}
          <MathTex>{"\\varepsilon \\to \\infty"}</MathTex> privacy
          guarantees vanish.
        </p>
      </Block>

      {/* Definition 2 */}
      <Block title="Global Sensitivity (ℓ₁)">
        <p>
          For a function{" "}
          <MathTex>{"f : \\mathcal{X} \\to \\mathbb{R}"}</MathTex>, the
          global ℓ₁-sensitivity is:
        </p>
        <Formula>{"\\Delta f = \\max_{x,\\, x'} |f(x) - f(x')|"}</Formula>
        <p>
          where the maximum is over all adjacent{" "}
          <MathTex>{"x, x'"}</MathTex>.
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Examples used in this simulator:
          <br />
          Sum:&nbsp; <MathTex>{"\\Delta f = \\max(\\text{values})"}</MathTex>
          <br />
          Mean: <MathTex>{"\\Delta f = \\max(\\text{values}) / n"}</MathTex>
          <br />
          Count: <MathTex>{"\\Delta f = 1"}</MathTex>
        </p>
      </Block>

      {/* Definition 3 */}
      <Block title="Laplace Mechanism">
        <p>
          Given{" "}
          <MathTex>{"f : \\mathcal{X} \\to \\mathbb{R}"}</MathTex> with
          sensitivity <MathTex>{"\\Delta f"}</MathTex>,
          the Laplace mechanism outputs:
        </p>
        <Formula>{"M(x) = f(x) + \\eta, \\quad \\eta \\sim \\text{Lap}(0, b), \\quad b = \\Delta f \\,/\\, \\varepsilon"}</Formula>
        <p>
          The Laplace PDF is{" "}
          <MathTex>{"p(\\eta) = \\frac{1}{2b} \\exp\\!\\left(-\\frac{|\\eta|}{b}\\right)"}</MathTex>
          .
        </p>
        <p>
          The mechanism satisfies{" "}
          <MathTex>{"\\varepsilon"}</MathTex>-DP by the
          composition of the privacy loss random variable.
        </p>
      </Block>

      {/* Definition 4 */}
      <Block title="Privacy–Utility Tradeoff">
        <p>
          Utility is commonly measured by expected absolute error:
        </p>
        <Formula>
          {"\\mathbb{E}[|M(x) - f(x)|] = \\mathbb{E}[|\\eta|] = b = \\Delta f \\,/\\, \\varepsilon"}
        </Formula>
        <p>
          Variance of the noise:{" "}
          <MathTex>{"\\text{Var}[\\eta] = 2b^2"}</MathTex>.
        </p>
        <p>
          Increasing <MathTex>{"\\varepsilon"}</MathTex>{" "}
          linearly decreases the expected error{" "}
          <MathTex>{"b"}</MathTex> but weakens the
          privacy guarantee by a factor of{" "}
          <MathTex>{"e^{\\varepsilon}"}</MathTex> — an
          exponential cost. Practitioners choose{" "}
          <MathTex>{"\\varepsilon"}</MathTex> by balancing
          acceptable error against tolerable privacy loss.
        </p>
      </Block>

      {/* Sampling note */}
      <Block title="Inverse-CDF Sampling (implementation)">
        <p>
          This engine draws Laplace noise via the inverse CDF. Given{" "}
          <MathTex>{"U \\sim \\text{Uniform}(0, 1)"}</MathTex>
          :
        </p>
        <Formula>{"\\eta = -b \\cdot \\text{sign}(U - \\tfrac{1}{2}) \\cdot \\ln(1 - 2|U - \\tfrac{1}{2}|)"}</Formula>
        <p>
          The RNG is ChaCha20, seeded with a user-supplied u64 for
          reproducibility or with OS entropy otherwise.
        </p>
      </Block>

      {/* Composition */}
      <Block title="Sequential Composition">
        <p>
          If <MathTex>{"k"}</MathTex> mechanisms
          each satisfy{" "}
          <MathTex>{"\\varepsilon_i"}</MathTex>-DP, their
          sequential composition satisfies:
        </p>
        <Formula>{"\\sum_i \\varepsilon_i\\text{-DP}"}</Formula>
        <p>
          This means repeated queries on the same dataset consume the budget
          additively. Advanced composition (Dwork et al., 2010) improves this
          to{" "}
          <MathTex>{"O\\!\\left(\\varepsilon \\sqrt{k \\ln(1/\\delta)}\\right)"}</MathTex>{" "}
          under <MathTex>{"(\\varepsilon, \\delta)"}</MathTex>-DP.
        </p>
      </Block>
    </div>
  );
}
