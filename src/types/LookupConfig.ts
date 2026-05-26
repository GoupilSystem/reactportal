import type { LookupRule } from "./LookupRule";

export type LookupConfig = {
  flags: {
    ssnSourceOfTruth: boolean;
    emailSourceOfTruth: boolean;
    mobilePhoneSourceOfTruth: boolean;
    createdLast2Hours: boolean;
  };

  lookupRules: LookupRule[];
};