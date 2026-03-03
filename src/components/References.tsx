"use client";

import { useState } from "react";

interface Ref {
  authors: string;
  year: number;
  title: string;
  venue: string;
}

const REFERENCES: Ref[] = [
  {
    authors: "Dwork, C., McSherry, F., Nissim, K., & Smith, A.",
    year: 2006,
    title:
      "Calibrating noise to sensitivity in private data analysis",
    venue:
      "Proceedings of the 3rd Theory of Cryptography Conference (TCC 2006), LNCS 3876, pp. 265–284. Springer.",
  },
  {
    authors: "Dwork, C., & Roth, A.",
    year: 2014,
    title: "The Algorithmic Foundations of Differential Privacy",
    venue:
      "Foundations and Trends® in Theoretical Computer Science, 9(3–4), pp. 211–407. Now Publishers.",
  },
  {
    authors: "Dwork, C., Rothblum, G. N., & Vadhan, S.",
    year: 2010,
    title: "Boosting and Differential Privacy",
    venue:
      "Proceedings of the 51st Annual IEEE Symposium on Foundations of Computer Science (FOCS 2010), pp. 51–60.",
  },
  {
    authors: "McSherry, F., & Talwar, K.",
    year: 2007,
    title:
      "Mechanism design via differential privacy",
    venue:
      "Proceedings of the 48th Annual IEEE Symposium on Foundations of Computer Science (FOCS 2007), pp. 94–103.",
  },
  {
    authors: "Nissim, K., Raskhodnikova, S., & Smith, A.",
    year: 2007,
    title:
      "Smooth sensitivity and sampling in private data analysis",
    venue:
      "Proceedings of the 39th Annual ACM Symposium on Theory of Computing (STOC 2007), pp. 75–84.",
  },
  {
    authors: "Balle, B., & Wang, Y.-X.",
    year: 2018,
    title:
      "Improving the Gaussian mechanism for differential privacy: Analytical calibration and optimal denoising",
    venue:
      "Proceedings of the 35th International Conference on Machine Learning (ICML 2018), pp. 394–403.",
  },
];

export default function References() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-800 pt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-bold text-gray-400 uppercase tracking-widest hover:text-gray-200 focus:outline-none"
      >
        {open ? "▼" : "▶"} References
      </button>
      {open && (
        <ol className="mt-3 space-y-3 list-decimal list-inside">
          {REFERENCES.map((r, i) => (
            <li key={i} className="text-xs text-gray-400 leading-relaxed pl-1">
              <span className="text-gray-300">{r.authors}</span>{" "}
              ({r.year}).{" "}
              <span className="italic text-gray-200">{r.title}</span>.{" "}
              {r.venue}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
