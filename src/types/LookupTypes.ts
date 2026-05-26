export type ContactLookupRequest = {
  environment?: string;
  contactData: ContactData;
  lookupPlan: LookupPlan;
};

export type ContactData = {
  socialSecurityNumber?: string;
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
  queryRule?: QuerySearchRule;
  luceneRule?: LuceneSearchRule;
  stopOnMatch: boolean;
};

export type QuerySearchRule = {
  operator: "Equal" | "GreaterEqual" | "BeginsWith" | "EndsWith" | "Like";
  length?: number;
  pattern?: string;
};

export type LuceneSearchRule = {
  level: number;
  top: number;
};

export type ScoreRule = {
  fieldName: keyof ContactData;
  weight: number;
  thresholdRange: [number, number];
};