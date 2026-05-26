import { Input, Text } from "@fluentui/react-components";
import type { ScoreRule } from "../types/ScoreRule";

type Props = {
  rule: ScoreRule;
  onChange: (r: ScoreRule) => void;
};

export function ScoreRuleRow({ rule, onChange }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

      {/* enabled */}
      <input
        type="checkbox"
        checked={rule.enabled}
        onChange={(e) =>
          onChange({
            ...rule,
            enabled: e.target.checked,
          })
        }
      />

      {/* field */}
      <Text style={{ minWidth: 120 }}>
        {rule.fieldName}
      </Text>

      {/* weight */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Text size={200}>Weight</Text>

        <Input
          type="number"
          value={String(rule.weight)}
          onChange={(e) =>
            onChange({
              ...rule,
              weight: Number(e.target.value),
            })
          }
          style={{ width: 70 }}
        />
      </div>

      {/* min */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Text size={200}>Min</Text>

        <Input
          type="number"
          value={String(rule.thresholdRange[0])}
          onChange={(e) =>
            onChange({
              ...rule,
              thresholdRange: [
                Number(e.target.value),
                rule.thresholdRange[1],
              ],
            })
          }
          style={{ width: 70 }}
        />
      </div>

      {/* max */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Text size={200}>Max</Text>

        <Input
          type="number"
          value={String(rule.thresholdRange[1])}
          onChange={(e) =>
            onChange({
              ...rule,
              thresholdRange: [
                rule.thresholdRange[0],
                Number(e.target.value),
              ],
            })
          }
          style={{ width: 70 }}
        />
      </div>
    </div>
  );
}