"use client";

import katex from "katex";

interface MathProps {
  /** LaTeX expression to render. */
  children: string;
  /** Display mode (block) vs inline mode. Default: false (inline). */
  display?: boolean;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Renders a LaTeX math expression using KaTeX.
 *
 * Usage:
 *   <Math>{"\\varepsilon"}</Math>               — inline
 *   <Math display>{"\\Pr[M(x) \\in S]"}</Math>  — display / block
 */
export default function Math({
  children,
  display = false,
  className = "",
}: MathProps) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });

  return display ? (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
