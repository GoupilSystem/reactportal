import { Text } from "@fluentui/react-components";
import type { QuerySearchRule } from "../types/QuerySearchRule";

type Props = {
  rule: QuerySearchRule;
  onChange: (r: QuerySearchRule) => void;
};

export function QuerySearchRuleRow({ rule, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Text style={{ width: 180 }}>{rule.fieldName}</Text>

      <select
        value={rule.operator}
        onChange={(e) =>
          onChange({ ...rule, operator: e.target.value as any })
        }
      >
        <option value="Equal">Equal</option>
        <option value="BeginsWith">BeginsWith</option>
        <option value="EndsWith">EndsWith</option>
      </select>
    </div>
  );
}