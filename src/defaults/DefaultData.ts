import type { DataInput, LookupPlan } from "../types/LookupRequestTypes";

export const defaultDataInput: DataInput[] = [
  {
    "ssn": "25059241837",
    "fullName": "Iselin Renée Lægreid",
    "email": "iselin@laegreid.net",
    "mobilePhone": "+4792809389",
    "street": "Harald Hårfagres gate 12 C",
    "postalCode": "0363",
    "city": "OSLO",
    "country": "Norge"
  },
  {
      "ssn": "25059241837",
      "fullName": "Raoul Renée Lægreid",
      "email": "islin@laegreid.net",
      "mobilePhone": "+4792809389",
      "street": "Harald Hårfagres gate 12 C",
      "postalCode": "0363",
      "city": "OSLO",
    "country": "Norge"
    },
  {
    "organizationNumber": "992037601",
    "email": "contact@company.no",
    "telephone": "+4700000000",
    "name": "AccentureAS",
    "street": "Rådhusgata 27",
    "postalCode": "0158",
    "city": "OSLO",
    "country": "Norge"
  }
];

export const defaultLookupPlan: LookupPlan = {
  reviewThreshold: 50,
  autoMatchThreshold: 80,
  searchSteps: [
    {
      id: crypto.randomUUID(),
      order: 1,
      fieldName: "email",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0,
      },
      luceneRule: {
        deviation: 1,
        top: 20,
      },
      stopOnMatch: false,
    },
    {
      id: crypto.randomUUID(),
      order: 2,
      fieldName: "mobilePhone",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0,
      },
      luceneRule: {
        deviation: 1,
        top: 20,
      },
      stopOnMatch: false,
    },
    {
      id: crypto.randomUUID(),
      order: 3,
      fieldName: "fullName",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0,
      },
      luceneRule: {
        deviation: 1,
        top: 20,
      },
      stopOnMatch: false,
    },
    {
      id: crypto.randomUUID(),
      order: 4,
      fieldName: "street",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0,
      },
      luceneRule: {
        deviation: 1,
        top: 20,
      },
      stopOnMatch: false,
    },
    {
      id: crypto.randomUUID(),
      order: 5,
      fieldName: "postalCode",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0,
      },
      luceneRule: {
        deviation: 1,
        top: 20,
      },
      stopOnMatch: false,
    },
  ],

  scoreRules: [
    {
      fieldName: "email",
      weight: 40,
      thresholdRange: [75, 100],
    },
    {
      fieldName: "mobilePhone",
      weight: 30,
      thresholdRange: [85, 100],
    },
    {
      fieldName: "fullName",
      weight: 10,
      thresholdRange: [70, 100],
    },
    {
      fieldName: "street",
      weight: 10,
      thresholdRange: [50, 100],
    },
    {
      fieldName: "postalCode",
      weight: 10,
      thresholdRange: [85, 100],
    }
  ],
};