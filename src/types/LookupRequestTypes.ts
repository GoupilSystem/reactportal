export type RunMode = "Single" | "Dual";

export type ContactLookupRequest = {
  environment?: string;
  contactData: ContactData[];
  lookupPlan: LookupPlan;
  runMode: RunMode;
};

export type ContactData = {
  SSN?: string;
  fullName?: string;
  email?: string;
  mobilePhone?: string;
  street?: string;
  postalCode?: string;
};

export type LookupPlan = {
  searchSteps: SearchStep[];
  scoreRules?: ScoreRule[];
};

export type SearchStep = {
  id: string;
  order: number;
  fieldName: keyof ContactData;
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
  fieldName: keyof ContactData;
  weight: number;
  thresholdRange: [number, number];
};