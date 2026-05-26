import { useState } from "react";
import { Text, Textarea, Switch } from "@fluentui/react-components";
import type { LookupRule } from "../types/LookupRule";
import type { LookupConfig } from "../types/LookupConfig";
import { LookupRuleRow } from "./LookupRuleRow";

type Props = {
  lookupConfig: LookupConfig;
  setLookupConfig: React.Dispatch<React.SetStateAction<LookupConfig>>;
};

export function LookupConfigPanel(props: Props) {
  const [jsonMode, setJsonMode] = useState(true);

  const configViewJson = JSON.stringify(props.lookupConfig, null, 2);

  function updateRule(updated: LookupRule) {
    props.setLookupConfig(prev => ({
      ...prev,
      rules: prev.lookupRules.map(r =>
        r.fieldName === updated.fieldName ? updated : r
      ),
    }));
  }

  function updateFlag(key: keyof LookupConfig["flags"], value: boolean) {
    props.setLookupConfig(prev => ({
      ...prev,
      flags: {
        ...prev.flags,
        [key]: value,
      },
    }));
  }

  function safeParse(json: string): LookupConfig | null {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  const gridTemplate = "180px 60px 60px 40px 70px 60px 60px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text weight="semibold">Lookup Config</Text>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size={200}>JSON</Text>
          <Switch checked={jsonMode} onChange={(_, d) => setJsonMode(d.checked)} />
        </div>
      </div>

      {/* CONTAINER */}
      <div
        style={{
          border: "1px solid #d0d0d0",
          borderRadius: 6,
          padding: 10,
          background: "white",
          minHeight: 320,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >

        {/* EDIT MODE */}
        {!jsonMode && (
          <>
            {/* FLAGS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              <label>
                <input
                  type="checkbox"
                  checked={props.lookupConfig.flags.ssnSourceOfTruth}
                  onChange={(e) => updateFlag("ssnSourceOfTruth", e.target.checked)}
                />
                SSN Source of Truth
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={props.lookupConfig.flags.emailSourceOfTruth}
                  onChange={(e) => updateFlag("emailSourceOfTruth", e.target.checked)}
                />
                Email Source of Truth
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={props.lookupConfig.flags.mobilePhoneSourceOfTruth}
                  onChange={(e) => updateFlag("mobilePhoneSourceOfTruth", e.target.checked)}
                />
                Mobile Source of Truth
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={props.lookupConfig.flags.createdLast2Hours}
                  onChange={(e) => updateFlag("createdLast2Hours", e.target.checked)}
                />
                Created last 2 hours
              </label>
            </div>

            {/* HEADER ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: gridTemplate,
                alignItems: "center",
                columnGap: 12,
                fontSize: 12,
                opacity: 0.8,
              }}
            >
              <div>Field</div>
              <div style={{ textAlign: "center" }}>Level</div>
              <div style={{ textAlign: "center" }}>Top</div>
              <div />
              <div style={{ textAlign: "center" }}>Weight</div>
              <div style={{ textAlign: "center" }}>Min</div>
              <div style={{ textAlign: "center" }}>Max</div>
            </div>

            {/* ROWS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {props.lookupConfig.lookupRules.map(rule => (
                <LookupRuleRow
                  key={rule.fieldName}
                  rule={rule}
                  gridTemplate={gridTemplate}
                  onChange={updateRule}
                />
              ))}
            </div>
          </>
        )}

        {/* JSON MODE */}
        {jsonMode && (
          <Textarea
            value={configViewJson}
            onChange={(e) => {
              const parsed = safeParse(e.target.value);
              if (parsed) props.setLookupConfig(parsed);
            }}
            style={{ width: "100%", minHeight: 320 }}
          />
        )}
      </div>
    </div>
  );
}