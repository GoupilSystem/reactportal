import { Input, Text } from "@fluentui/react-components";
import type { LookupRule } from "../types/LookupRule";

type Props = {
  rule: LookupRule;
  onChange: (r: LookupRule) => void;
  gridTemplate: string;
};

export function LookupRuleRow({ rule, onChange, gridTemplate }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: gridTemplate,
        alignItems: "center",
        columnGap: 10,
      }}
    >

      {/* FIELD + CHECKBOX */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={rule.enabled}
          onChange={(e) =>
            onChange({ ...rule, enabled: e.target.checked })
          }
        />
        <Text>{rule.fieldName}</Text>
      </div>

      {/* LEVEL */}
      <Input
        appearance="outline"
        type="number"
        value={String(rule.fuzzySearchLevel)}
        onChange={(e) =>
          onChange({ ...rule, fuzzySearchLevel: Number(e.target.value) })
        }
        style={{ width: "100%" }}
      />

      {/* TOP */}
      <Input
        appearance="outline"
        type="number"
        value={String(rule.fuzzySearchTop)}
        onChange={(e) =>
          onChange({ ...rule, fuzzySearchTop: Number(e.target.value) })
        }
        style={{ width: "100%" }}
      />

      {/* GAP COLUMN (between search & score) */}
      <div />

      {/* WEIGHT */}
      <Input
        appearance="outline"
        type="number"
        value={String(rule.scoreWeight)}
        onChange={(e) =>
          onChange({ ...rule, scoreWeight: Number(e.target.value) })
        }
        style={{ width: "100%" }}
      />

      {/* MIN */}
      <Input
        appearance="outline"
        type="number"
        value={String(rule.scoreThresholdRange[0])}
        onChange={(e) =>
          onChange({
            ...rule,
            scoreThresholdRange: [
              Number(e.target.value),
              rule.scoreThresholdRange[1],
            ],
          })
        }
        style={{ width: "100%" }}
      />

      {/* MAX */}
      <Input
        appearance="outline"
        type="number"
        value={String(rule.scoreThresholdRange[1])}
        onChange={(e) =>
          onChange({
            ...rule,
            scoreThresholdRange: [
              rule.scoreThresholdRange[0],
              Number(e.target.value),
            ],
          })
        }
        style={{ width: "100%" }}
      />
    </div>
  );
}