export type RunMode = "Single" | "Dual";

export type ContactLookupRequest = {
  dataInput: DataInput[];
  lookupPlan: LookupPlan;
  runMode: RunMode;
};

export type DataInput = {
  SSN?: string;
  fullName?: string;
  email?: string;
  mobilePhone?: string;
  street?: string;
  postalCode?: string;
};

export type LookupPlan = {
  reviewThreshold: number;
  autoMatchThreshold: number;
  searchSteps: SearchStep[];
  scoreRules?: ScoreRule[];
};

export type SearchStep = {
  id: string;
  order: number;
  fieldName: keyof DataInput;
  type: "Query" | "Lucene";
  queryRule: QuerySearchRule;
  luceneRule: LuceneSearchRule;
  stopOnMatch: boolean;
};

export const queryOperators = [
  "Equal",
  "BeginsWith",
  "EndsWith",
  "Like",
] as const;

export type QueryOperator = (typeof queryOperators)[number];

export type QuerySearchRule = {
  operator: QueryOperator;
  length: number;
  pattern?: string;
};

export type LuceneSearchRule = {
  deviation: number;
  top: number;
};

export type ScoreRule = {
  fieldName: keyof DataInput;
  weight: number;
  thresholdRange: [number, number];
};