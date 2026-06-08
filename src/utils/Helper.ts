import type { DataInput, FieldOption } from "../types/LookupRequestTypes";

export function buildFieldOptions(dataInput: DataInput[]): FieldOption[] {
  const contactKeys = ["ssn", "fullName", "mobilePhone"] as const;
  const accountKeys = ["organizationNumber", "telephone", "name"] as const;

  const mergedKeys = new Set<keyof DataInput>();

  dataInput.forEach(item => {
    Object.keys(item).forEach(k => {
      mergedKeys.add(k as keyof DataInput);
    });
  });

  return Array.from(mergedKeys).map(key => {
    const group =
      contactKeys.includes(key as any)
        ? "Contact"
        : accountKeys.includes(key as any)
        ? "Account"
        : "Shared";

    return { key, label: key, group };
  });
}