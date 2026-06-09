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
  bankAccountNumber?: string;
};

export type LookupPlan = {
  reviewThreshold: number;
  autoMatchThreshold: number;
  lookupSteps: LookupStep[];
};

export type LookupStep = {
  id: string;
  order: number;
  fieldName: keyof DataInput;
  type: "Query" | "Lucene";

  queryRule: QuerySearchRule;
  luceneRule: LuceneSearchRule;

  stopOnMatch: boolean;

  scoreRule: ScoreRule;
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
  weight: number;
  thresholdRange: [number, number];
};

export type FieldOption = {
  key: keyof DataInput;
  label: string;
  group: "Contact" | "Account" | "Shared";
};