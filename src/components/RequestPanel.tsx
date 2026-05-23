import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Text,
  Button,
  Textarea,
  Input,
  Field,
  Switch,
} from "@fluentui/react-components";
import type { LucerneSearchRule } from "../types/LucerneSearchRule";
import { LucerneSearchRuleRow } from "./LucerneSearchRuleRows";

type Props = {
  socialSecurityNumber: string;
  setSocialSecurityNumber: (v: string) => void;

  fullName: string;
  setFullName: (v: string) => void;

  email: string;
  setEmail: (v: string) => void;

  mobilePhone: string;
  setMobilePhone: (v: string) => void;

  street: string;
  setStreet: (v: string) => void;

  postalCode: string;
  setPostalCode: (v: string) => void;

  configJson: string;
  setConfigJson: (v: string) => void;

  lucerneSearchRules: LucerneSearchRule[];
  setLucerneSearchRules: React.Dispatch<React.SetStateAction<LucerneSearchRule[]>>;

  run: () => void;
  loading: boolean;
};

export function RequestPanel({
  socialSecurityNumber,
  setSocialSecurityNumber,
  fullName,
  setFullName,
  email,
  setEmail,
  mobilePhone,
  setMobilePhone,
  street,
  setStreet,
  postalCode,
  setPostalCode,

  configJson,
  setConfigJson,

  lucerneSearchRules,
  setLucerneSearchRules,

  run,
  loading,
}: Props) {
  const [inputJsonMode, setInputJsonMode] = useState(true);
  const [configJsonMode, setConfigJsonMode] = useState(true);

  const inputJson = JSON.stringify(
    { socialSecurityNumber, fullName, email, mobilePhone, street, postalCode },
    null,
    2
  );

  // useEffect(() => {
  //   if (!configJsonMode) return;

  //   let existing = {};
  //   try {
  //     existing = JSON.parse(configJson || "{}");
  //   } catch {
  //     existing = {};
  //   }

  //   setConfigJson(
  //     JSON.stringify(
  //       {
  //         ...existing,
  //         lucerneSearchRules,
  //       },
  //       null,
  //       2
  //     )
  //   );
  // }, [lucerneSearchRules]);

  function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return { flags: {} };
  }
}

  const config = safeParse(configJson);

  function updateFlags(partial: any) {
    const current = safeParse(configJson);

    const next = {
      ...current,
      flags: {
        ...current.flags,
        ...partial,
      },
    };

    setConfigJson(JSON.stringify(next, null, 2));
  }

  const configViewJson = JSON.stringify(
    {
      flags: config.flags ?? {},
      scoringRules: config.scoringRules ?? [],
      lucerneSearchRules,
    },
    null,
    2
  );

  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>

        {/* LEFT: INPUT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 32 }}>
            <Text weight="semibold">Data Input</Text>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text size={200}>JSON</Text>
              <Switch
                checked={inputJsonMode}
                onChange={(_, d) => setInputJsonMode(d.checked)}
              />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex" }}>
            {inputJsonMode ? (
              <Textarea
                value={inputJson}
                onChange={(e) => {
                  try {
                    const v = JSON.parse(e.target.value);

                    setSocialSecurityNumber(v.socialSecurityNumber ?? "");
                    setFullName(v.fullName ?? "");
                    setEmail(v.email ?? "");
                    setMobilePhone(v.mobilePhone ?? "");
                    setStreet(v.street ?? "");
                    setPostalCode(v.postalCode ?? "");
                  } catch {}
                }}
                style={{ minHeight: 320, width: "100%" }}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                <Field label="Social Security Number">
                  <Input value={socialSecurityNumber} onChange={(e) => setSocialSecurityNumber(e.target.value)} />
                </Field>

                <Field label="Full Name">
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </Field>

                <Field label="Email">
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>

                <Field label="Mobile Phone">
                  <Input value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} />
                </Field>

                <Field label="Street">
                  <Input value={street} onChange={(e) => setStreet(e.target.value)} />
                </Field>

                <Field label="Postal Code">
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </Field>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CONFIG */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 32 }}>
            <Text weight="semibold">Search Config</Text>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text size={200}>JSON</Text>
              <Switch
                checked={configJsonMode}
                onChange={(_, d) => setConfigJsonMode(d.checked)}
              />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex" }}>
            {configJsonMode ? (
              <Textarea
                value={configJsonMode ? configViewJson : configJson}
                onChange={(e) => setConfigJson(e.target.value)}
                style={{ minHeight: 320, width: "100%" }}
              />
            ) : (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>

               {/* SSN FLAG */}
              <label style={{ display: "flex", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={config.flags?.ssnSourceOfTruth ?? false}
                  onChange={(e) =>
                    updateFlags({ ssnSourceOfTruth: e.target.checked })
                  }
                />
                <Text>SSN is source of truth</Text>
              </label>

              {/* CREATED FLAG */}
            <label style={{ display: "flex", gap: 8 }}>
              <input
                type="checkbox"
                checked={config.flags?.createdLast2Hours ?? false}
                onChange={(e) =>
                  updateFlags({ createdLast2Hours: e.target.checked })
                }
              />
              <Text>Created last 2 hours</Text>
            </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" />
                <Text>Exact match email</Text>
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Lucerne rules */}
            {lucerneSearchRules.map(rule => (
              <LucerneSearchRuleRow
                key={rule.fieldName}
                label={rule.fieldName}
                rule={rule}
                onChange={(updated) =>
                  setLucerneSearchRules(prev =>
                    prev.map(r => r.fieldName === updated.fieldName ? updated : r)
                  )
                }
              />
            ))}
              </div>

            </div>
            )}
          </div>
        </div>
      </div>

      {/* RUN */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <Button appearance="primary" onClick={run} disabled={loading}>
          {loading ? "Running..." : "Run Match"}
        </Button>
      </div>
    </Card>
  );
}