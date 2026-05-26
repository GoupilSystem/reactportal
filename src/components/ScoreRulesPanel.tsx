import { useState } from "react";
import {
  Text,
  Textarea,
  Switch,
} from "@fluentui/react-components";

import type { ScoreRule } from "../types/ScoreRule";
import { ScoreRuleRow } from "./ScoreRuleRow";

type ScoreRulesPanelProps = {
  configJson: string;
  setConfigJson: (v: string) => void;

  scoreRules: ScoreRule[];
  setScoreRules: React.Dispatch<React.SetStateAction<ScoreRule[]>>;
};

export function ScoreRulesPanel(props: ScoreRulesPanelProps) {
  const [jsonMode, setJsonMode] = useState(true);

  const configViewJson = JSON.stringify(
    {
      scoreRules: props.scoreRules ?? []
    },
    null,
    2
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 32
        }}
      >
        <Text weight="semibold">Score Rules</Text>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size={200}>JSON</Text>

          <Switch
            checked={jsonMode}
            onChange={(_, d) => setJsonMode(d.checked)}
          />
        </div>
      </div>

      {/* BODY */}
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
            style={{
              width: "100%",
              minHeight: "100%"
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%"
            }}
          >
            {props.scoreRules.map((rule) => (
              <ScoreRuleRow
                key={rule.fieldName}
                rule={rule}
                onChange={(updated) =>
                  props.setScoreRules((prev) =>
                    prev.map((r) =>
                      r.fieldName === updated.fieldName
                        ? updated
                        : r
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}