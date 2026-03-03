/** Typed reference entries used across the application. */

export type Reference = {
  id: string;
  apa: string;
  notes?: string;
};

export const CORE_REFERENCES: Reference[] = [
  {
    id: "dwork2006",
    apa: "Dwork, C., McSherry, F., Nissim, K., & Smith, A. (2006). Calibrating noise to sensitivity in private data analysis. Proceedings of the 3rd Theory of Cryptography Conference (TCC 2006), LNCS 3876, pp. 265–284. Springer.",
    notes: "Foundational paper introducing the Laplace mechanism and the formal definition of differential privacy.",
  },
  {
    id: "dwork2014",
    apa: "Dwork, C., & Roth, A. (2014). The Algorithmic Foundations of Differential Privacy. Foundations and Trends in Theoretical Computer Science, 9(3–4), pp. 211–407. Now Publishers.",
    notes: "Comprehensive textbook covering definitions, mechanisms, composition theorems, and the Gaussian mechanism.",
  },
  {
    id: "dwork2010",
    apa: "Dwork, C., Rothblum, G. N., & Vadhan, S. (2010). Boosting and Differential Privacy. Proceedings of the 51st Annual IEEE Symposium on Foundations of Computer Science (FOCS 2010), pp. 51–60.",
    notes: "Introduces advanced composition theorems for tighter privacy accounting.",
  },
  {
    id: "mcsherry2007",
    apa: "McSherry, F., & Talwar, K. (2007). Mechanism design via differential privacy. Proceedings of the 48th Annual IEEE Symposium on Foundations of Computer Science (FOCS 2007), pp. 94–103.",
  },
  {
    id: "nissim2007",
    apa: "Nissim, K., Raskhodnikova, S., & Smith, A. (2007). Smooth sensitivity and sampling in private data analysis. Proceedings of the 39th Annual ACM Symposium on Theory of Computing (STOC 2007), pp. 75–84.",
  },
  {
    id: "balle2018",
    apa: "Balle, B., & Wang, Y.-X. (2018). Improving the Gaussian mechanism for differential privacy: Analytical calibration and optimal denoising. Proceedings of the 35th International Conference on Machine Learning (ICML 2018), pp. 394–403.",
    notes: "Provides tighter analytical calibration for the Gaussian mechanism.",
  },
];

export const ADVANCED_REFERENCES: Reference[] = [
  {
    id: "kairouz2015",
    apa: "Kairouz, P., Oh, S., & Viswanath, P. (2015). The Composition Theorem for Differential Privacy. Proceedings of the 32nd International Conference on Machine Learning (ICML 2015), pp. 1376–1385.",
    notes: "Advanced composition analysis with optimal constants.",
  },
  {
    id: "mironov2017",
    apa: "Mironov, I. (2017). Renyi Differential Privacy. Proceedings of the 30th IEEE Computer Security Foundations Symposium (CSF 2017), pp. 263–275.",
    notes: "Introduces Renyi differential privacy (RDP) for tighter composition accounting.",
  },
];
