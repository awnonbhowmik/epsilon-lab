export type QueryType = "sum" | "mean" | "count";

export type SimRequest = {
  values: number[];
  queryType: QueryType;
  epsilon: number;
  sensitivity: number;
  runs: number;
  seed?: bigint;
};

export type SimSummary = {
  mean: number;
  stddev: number;
  min: number;
  max: number;
  median: number;
};

export type SimResponse = {
  trueValue: number;
  noisyValues: number[];
  absErrors: number[];
  relErrorsPct: number[];
  noisySummary: SimSummary;
  absErrorSummary: SimSummary;
  scale: number;
};
