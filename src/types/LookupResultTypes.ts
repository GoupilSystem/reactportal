import type { DataInput } from "./LookupRequestTypes";

export type RunMode = "Single" | "Dual";

export type LookupResult = {
  runMode: RunMode;
  results: SingleResult[];
};

export type SingleResult = {
  dataInput: DataInput;

  action: string;
  candidateCount: number;
  confidence: number;

  contactId?: string;

  candidates: ContactCandidate[];
  execution: LookupExecutionReport;

  legacyLookupSummary?: LegacyLookupSummary;
  vsLegacyDiff?: VsLegacyDiff;
};

export type ContactCandidate = {
  contactId: string;

  ssn?: string;
  fullName?: string;
  email?: string;
  mobilePhone?: string;
  street?: string;
  postalCode?: string;

  scoring: CandidateScoring;
  breakdown: ScoreBreakdown;
};

export type CandidateScoring = {
  score: number;
  fuzzyScore: number | null;
  fuzzySourceField: string | null;
  action: string;
};

export type ScoreBreakdown = {
  ssn?: FieldScore;
  email?: FieldScore;
  mobilePhone?: FieldScore;
  fullName?: FieldScore;
  street?: FieldScore;
  postalCode?: FieldScore;
};

export type FieldScore = {
  fieldName: string;
  absoluteSimilarity: number;
  normalizedSimilarity: number;
  weight: number;
  contributionToGlobalScore: number;
  used: boolean;
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