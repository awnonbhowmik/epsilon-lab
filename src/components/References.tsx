"use client";

interface Ref {
  authors: string;
  year: number;
  title: string;
  venue: string;
  url?: string;
}

const REFERENCES: Ref[] = [
  {
    authors: "Dwork, C., McSherry, F., Nissim, K., & Smith, A.",
    year: 2006,
    title:
      "Calibrating noise to sensitivity in private data analysis",
    venue:
      "Proceedings of the 3rd Theory of Cryptography Conference (TCC 2006), LNCS 3876, pp. 265–284. Springer.",
    url: "https://doi.org/10.1007/11681878_14",
  },
  {
    authors: "Dwork, C., & Roth, A.",
    year: 2014,
    title: "The Algorithmic Foundations of Differential Privacy",
    venue:
      "Foundations and Trends® in Theoretical Computer Science, 9(3–4), pp. 211–407. Now Publishers.",
    url: "https://doi.org/10.1561/0400000042",
  },
  {
    authors: "Dwork, C., Rothblum, G. N., & Vadhan, S.",
    year: 2010,
    title: "Boosting and Differential Privacy",
    venue:
      "Proceedings of the 51st Annual IEEE Symposium on Foundations of Computer Science (FOCS 2010), pp. 51–60.",
    url: "https://doi.org/10.1109/FOCS.2010.12",
  },
  {
    authors: "McSherry, F., & Talwar, K.",
    year: 2007,
    title:
      "Mechanism design via differential privacy",
    venue:
      "Proceedings of the 48th Annual IEEE Symposium on Foundations of Computer Science (FOCS 2007), pp. 94–103.",
    url: "https://doi.org/10.1109/FOCS.2007.41",
  },
  {
    authors: "Nissim, K., Raskhodnikova, S., & Smith, A.",
    year: 2007,
    title:
      "Smooth sensitivity and sampling in private data analysis",
    venue:
      "Proceedings of the 39th Annual ACM Symposium on Theory of Computing (STOC 2007), pp. 75–84.",
    url: "https://doi.org/10.1145/1250790.1250803",
  },
];

export default function References() {
  return (
    <div className="mt-8 border-t border-gray-800 pt-6">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
        References
      </h3>
      <ol className="space-y-3 list-decimal list-inside">
        {REFERENCES.map((r, i) => (
          <li key={i} className="text-xs text-gray-400 leading-relaxed pl-1">
            <span className="text-gray-300">{r.authors}</span>{" "}
            ({r.year}).{" "}
            <span className="italic text-gray-200">{r.title}</span>.{" "}
            {r.venue}
            {r.url && (
              <>
                {" "}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  doi
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
