export type RunMode = "NewLookup" | "VsLegacyLookup";

export type LookupResult = {
  runMode: RunMode;
  results: SingleResult[];
};

export type SingleResult = {
  candidates: Candidate[];
  singleResultTimeReport: SingleResultTimeReport;
  vsLegacySummary: VsLegacySummary;
};

export type VsLegacySummary = {
  statusText: string;
  matchCount: number;
};

export type Candidate = {
  candidateId: string;

  ssn?: string;
  fullName?: string;
  email?: string;
  mobilePhone?: string;
  street?: string;
  postalCode?: string;

  candidateScore: CandidateScore;

  fieldScores: FieldScore[];
};

export type CandidateScore = {
  score: number;
  fuzzyScore: number | null;
  fuzzySourceField: string | null;
};

export type FieldScore = {
  fieldName: string;
  absoluteSimilarity: number;
  normalizedSimilarity: number;
  weight: number;
  contributionToCandidateScore: number;
  used: boolean;
};

export type SingleResultTimeReport = {
  totalTimeMs: number;
  searchTimeMs: number;
  scoreTimeMs: number;
  stepTimeReports: StepTimeReport[];
};

export type StepTimeReport = {
  order: number;
  fieldName: string;
  type: "Search" | "Score";
  operation: string;
  timeMs: number;
  candidatesFound?: number;
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