export type RunMode = "NewLookup" | "VsLegacyLookup";

export type ContactLookupRequest = {
  dataInput: DataInput[];
  lookupPlan: LookupPlan;
  runMode: RunMode;
};

export type DataInput = {
  // Contact
  ssn?: string;
  fullName?: string;
  mobilePhone?: string;
  // Account
  organizationNumber?: string;
  telephone?: string;
  name?: string;
  // Shared
  email?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
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

export type FieldOption = {
  key: keyof DataInput;
  label: string;
  group: "Contact" | "Account" | "Shared";
};