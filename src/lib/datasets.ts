export type DatasetId =
  | "small_integers"
  | "small_floats"
  | "skewed"
  | "uniform";

export type Dataset = {
  id: DatasetId;
  label: string;
  description: string;
  values: number[];
};

export const DATASETS: Dataset[] = [
  {
    id: "small_integers",
    label: "Small Integers",
    description: "A small dataset of integer values between 1 and 20",
    values: [3, 7, 2, 9, 5, 14, 8, 11, 6, 4, 13, 10, 1, 15, 12, 7, 3, 9, 5, 8],
  },
  {
    id: "small_floats",
    label: "Small Floats",
    description: "A dataset of floating-point values with moderate variance",
    values: [1.2, 3.5, 2.8, 4.1, 0.9, 3.2, 2.0, 4.7, 1.5, 3.8, 2.3, 4.0, 1.8, 3.1, 2.6, 4.4, 0.7, 3.9, 2.1, 4.2],
  },
  {
    id: "skewed",
    label: "Skewed Distribution",
    description: "A right-skewed dataset with a few large outliers",
    values: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 7, 8, 10, 15, 20, 35, 50, 100],
  },
  {
    id: "uniform",
    label: "Uniform Distribution",
    description: "Values uniformly distributed between 0 and 100",
    values: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
];

export function getDataset(id: DatasetId): Dataset {
  const ds = DATASETS.find((d) => d.id === id);
  if (!ds) throw new Error(`Unknown dataset: ${id}`);
  return ds;
}

export function getDefaultDataset(): Dataset {
  return DATASETS[0];
}
