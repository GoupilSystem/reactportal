import type { ContactData, LookupPlan } from "../types/LookupTypes";

export const defaultContactData: ContactData = {
    SSN: "25059241837",
    fullName: "Iselin Renée Lægreid",
    email: "iselin@laegreid.net",
    mobilePhone: "+4792809389",
    street: "Harald Hårfagres gate 12 C",
    postalCode: "0363"
}

// This is default
export const defaultLookupPlan: LookupPlan = {
  searchSteps: [
    {
      id: crypto.randomUUID(),
      order: 1,
      fieldName: "email",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0 
      },
      luceneRule: {
        deviation: 0,
        top: 50,
      },
      stopOnMatch: true,
    },
    {
      id: crypto.randomUUID(),
      order: 2,
      fieldName: "mobilePhone",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0 
      },
      luceneRule: {
        deviation: 1,
        top: 15,
      },
      stopOnMatch: true,
    },
    {
      id: crypto.randomUUID(),
      order: 3,
      fieldName: "fullName",
      type: "Lucene",
      queryRule: {
        operator: "Equal",
        length: 0 
      },
      luceneRule: {
        deviation: 1,
        top: 15,
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
        length: 0 
      },
      luceneRule: {
        deviation: 1,
        top: 15,
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
        length: 0 
      },
      luceneRule: {
        deviation: 1,
        top: 15,
      },
      stopOnMatch: false,
    },
  ],

  scoreRules: [
    {
      fieldName: "email",
      weight: 40,
      thresholdRange: [50, 90]
    },
    {
      fieldName: "mobilePhone",
      weight: 30,
      thresholdRange: [70, 100]
    },
    {
      fieldName: "fullName",
      weight: 20,
      thresholdRange: [60, 95]
    },
    {
      fieldName: "street",
      weight: 10,
      thresholdRange: [50, 90]
    },
  ],
};