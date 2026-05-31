import type { ContactData } from "./LookupRequestTypes";

export type Mode = "Single" | "Dual";

export type LookupResult = {
  runMode: Mode;
  results: SingleResult[];
};

export type SingleResult = {
  contactData: ContactData;

  action: string;
  candidateCount: number;
  confidence: number;

  contactId?: string;

  candidates: ContactCandidate[];
  execution: LookupExecutionReport;

  legacyLookupSummary?: LegacyLookupSummary;
  vsLegacyDiff?: VsLegacyDiff;
};

export type ContactLookupResult = {
  action: string;
  candidateCount: number;
  confidence: number;
  contactId?: string;
  candidates: ContactCandidate[];
  execution: LookupExecutionReport;
};

export type ContactCandidate = {
  contactId: string;
  ssn?: string;
  fullName?: string;
  email?: string;
  mobilePhone?: string;
  street?: string;
  postalCode?: string;
  score: number;
  fuzzyScore: number;
  breakdown: ScoreBreakdown;
};

export type ScoreBreakdown = {
  ssn?: FieldScore;
  email?: FieldScore;
  mobilePhone?: FieldScore;
  fullName?: FieldScore;
  address?: FieldScore;
};

export type FieldScore = {
  fieldName: string;
  absoluteSimilarity: number;
  normalizedSimilarity: number;
  weight: number;
  contributionToGlobalScore: number;
  used: boolean;
  level?: string;
  thresholdRange: [number, number];
};

export type LookupExecutionReport = {
  totalTimeMs: number;
  searchTimeMs: number;
  scoreTimeMs: number;
  steps: StepExecutionReport[];
};

export type StepExecutionReport = {
  order: number;
  fieldName: string;
  type: "Search" | "Score";
  operation: string;
  timeMs: number;
  candidatesFound?: number;
};

export type LegacyLookupSummary = {
  statusText: string;
  matchCount: number;
  hasMatch: boolean;
  invalidSearchCriteria: boolean;
};

export type VsLegacyDiff = {
  improved: boolean;
  regression: boolean;
  same: boolean;
};

export type ResultTab = {
    id: string;
    title: string;
    timestamp: string;
    result: LookupResult;
  };

export type ResultRow = {
  key: string;
  result: LookupResult["results"][number];
};