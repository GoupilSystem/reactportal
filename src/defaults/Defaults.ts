// src/defaults/lookupDefaults.ts

import type { LuceneSearchRule } from "../types/LuceneSearchRule";
import type { ScoreRule } from "../types/ScoreRule";
import type { LookupRule } from "../types/LookupRule";
import type { LookupConfig } from "../types/LookupConfig";

export const defaultLookupConfig: LookupConfig = {
  flags: {
    ssnSourceOfTruth: true,
    emailSourceOfTruth: true,
    mobilePhoneSourceOfTruth: true,
    createdLast2Hours: true,
  },
  lookupRules: [
    {
    fieldName: "emailaddress1",
    enabled: true,
    fuzzySearchLevel: 1,
    fuzzySearchTop: 15,
    scoreWeight: 40,
    scoreThresholdRange: [85, 100]
  },
  {
    fieldName: "mobilephone",
    enabled: true,
    fuzzySearchLevel: 1,
    fuzzySearchTop: 15,
    scoreWeight: 30,
    scoreThresholdRange: [70, 100]
  },
  {
    fieldName: "fullname",
    enabled: true,
    fuzzySearchLevel: 1,
    fuzzySearchTop: 15,
    scoreWeight: 20,
    scoreThresholdRange: [60, 95]
  },
  {
    fieldName: "address1_line1",
    enabled: true,
    fuzzySearchLevel: 1,
    fuzzySearchTop: 15,
    scoreWeight: 10,
    scoreThresholdRange: [50, 90]
  },
  {
    fieldName: "postalcode",
    enabled: true,
    fuzzySearchLevel: 1,
    fuzzySearchTop: 15,
    scoreWeight: 10,
    scoreThresholdRange: [50, 90]
  }
  ],
};