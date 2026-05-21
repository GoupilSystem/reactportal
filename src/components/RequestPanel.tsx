import { useState } from "react";
import {
  Card,
  Text,
  Button,
  Textarea,
  Switch,
  Input,
  Field,
} from "@fluentui/react-components";
import type { SearchUI } from "../types/SearchUI";

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

  search: SearchUI;
  setSearch: (v: SearchUI) => void;

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

  search,
  setSearch,

  run,
  loading,
}: Props) {
  const [inputJsonMode, setInputJsonMode] = useState(true);

  const inputJson = JSON.stringify(
    { socialSecurityNumber, fullName, email, mobilePhone, street, postalCode },
    null,
    2
  );

  const isLucerne = search.mode === "lucerne";

  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", gap: 14 }}>

        {/* LEFT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text weight="semibold">Data Input</Text>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text size={200}>JSON</Text>
              <Switch
                checked={inputJsonMode}
                onChange={(_, d) => setInputJsonMode(d.checked)}
              />
            </div>
          </div>

          {inputJsonMode ? (
            <Textarea
              value={inputJson}
              onChange={(e) => {
                try {
                  const v = JSON.parse(e.target.value);

                  setFullName(v.socialSecurityNumber ?? "");
                  setFullName(v.fullName ?? "");
                  setEmail(v.email ?? "");
                  setMobilePhone(v.mobilePhone ?? "");
                  setStreet(v.street ?? "");
                  setPostalCode(v.postalCode ?? "");
                } catch {}
              }}
              style={{ minHeight: 260 }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

        {/* RIGHT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text weight="semibold">Search Configuration</Text>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Text size={200}>{search.mode.toUpperCase()}</Text>

              <Switch
                checked={isLucerne}
                onChange={(_, d) =>
                  setSearch({
                    ...search,
                    mode: d.checked ? "lucerne" : "query",
                  })
                }
              />
            </div>
          </div>

          {/* BODY (UNIFIED PANEL STYLE) */}
          <div
            style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {isLucerne ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text>Lucerne coefficient</Text>

                <select
                  value={search.lucerneFactor}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      lucerneFactor: Number(e.target.value) as 1 | 2 | 4,
                    })
                  }
                  style={{
                    height: 32,
                    borderRadius: 6,
                    padding: "0 8px",
                    minWidth: 80,
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </div>
            ) : (
              <div>
                <Text>Query mode</Text>

                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                  Uses searchRules + scoringRules from payload
                </div>

                <div style={{ marginTop: 10 }}>
                  <Textarea
                    value={configJson}
                    onChange={(e) => setConfigJson(e.target.value)}
                    style={{ minHeight: 200 }}
                  />
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