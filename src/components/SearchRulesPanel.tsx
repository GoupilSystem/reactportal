import {  useState } from "react";
import {
  Text,
  Textarea,
  Switch,
} from "@fluentui/react-components";
import type { LuceneSearchRule } from "../types/LuceneSearchRule";
import { LuceneSearchRuleRow } from "./LuceneSearchRuleRows";

type SearchRulesPanelProps = {
  configJson: string;
  setConfigJson: (v: string) => void;

  luceneSearchRules: LuceneSearchRule[];
  setLuceneSearchRules: React.Dispatch<React.SetStateAction<LuceneSearchRule[]>>;
};

export function SearchRulesPanel(props: SearchRulesPanelProps) {
  const [jsonMode, setJsonMode] = useState(true);

  const config = safeParse(props.configJson);

  function safeParse(json: string) {
    try {
      return JSON.parse(json);
    } catch {
      return { flags: {} };
    }
  }

  function updateFlags(partial: any) {
    const current = safeParse(props.configJson);

    const next = {
      ...current,
      flags: {
        ...current.flags,
        ...partial,
      },
    };

    props.setConfigJson(JSON.stringify(next, null, 2));
  }

  const configViewJson = JSON.stringify(
    {
      flags: config.flags ?? {},
      luceneSearchRules: props.luceneSearchRules,
    },
    null,
    2
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 32 }}>
        <Text weight="semibold">Search Rules</Text>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size={200}>JSON</Text>
            <Switch checked={jsonMode} onChange={(_, d) => setJsonMode(d.checked)} />
        </div>
      </div>
        
      <div
        style={{
          minHeight: 320,
          border: "1px solid #d0d0d0",
          borderRadius: 6,
          padding: 10,
          background: "white",
          display: "flex"
        }}
      >
        {jsonMode ? (
          <Textarea
            value={configViewJson}
            onChange={(e) => props.setConfigJson(e.target.value)}
            style={{ width: "100%", minHeight: "100%" }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <label>
            <input
              type="checkbox"
              checked={config.flags?.ssnSourceOfTruth ?? false}
              onChange={(e) => updateFlags({ ssnSourceOfTruth: e.target.checked })}
            />
            SSN
          </label>

          <label>
            <input
              type="checkbox"
              checked={config.flags?.emailSourceOfTruth ?? false}
              onChange={(e) => updateFlags({ emailSourceOfTruth: e.target.checked })}
            />
            Email
          </label>

          <label>
            <input
              type="checkbox"
              checked={config.flags?.mobilePhoneSourceOfTruth ?? false}
              onChange={(e) => updateFlags({ mobilePhoneSourceOfTruth: e.target.checked })}
            />
            Mobile
          </label>

          {props.luceneSearchRules.map((rule) => (
            <LuceneSearchRuleRow
              key={rule.fieldName}
              label={rule.fieldName}
              rule={rule}
              onChange={(updated) =>
                props.setLuceneSearchRules((prev) =>
                  prev.map((r) => (r.fieldName === updated.fieldName ? updated : r))
                )
              }
            />
          ))}

          <label>
            <input
              type="checkbox"
              checked={config.flags?.createdLast2Hours ?? false}
              onChange={(e) => updateFlags({ createdLast2Hours: e.target.checked })}
            />
            Created last 2 hours
          </label>
        </div>
      )}
      </div>
    </div>
  );
}