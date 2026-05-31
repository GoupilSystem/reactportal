import { type SearchStep, type ScoreRule, queryOperators } from "../types/LookupRequestTypes";
import type { ContactData, QueryOperator } from "../types/LookupRequestTypes";
import { Select, Input, Button, Text } from "@fluentui/react-components";

type Props = {
  step: SearchStep | null;
  stepsLength: number;
  isAddRow: boolean;
  scoreRule?: ScoreRule;

  col: any;
  contactFields: { key: keyof ContactData; label: string }[];

  updateStep: (s: SearchStep) => void;
  updateScoreRule: (
    fieldName: keyof ContactData,
    patch: Partial<ScoreRule>
  ) => void;

  addStep: (order: number) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  deleteStep: (id: string) => void;

  cellStyle: (w: number) => React.CSSProperties;
  Row: React.FC<{ children: React.ReactNode }>;
};

export function SearchStepRow({
  step,
  stepsLength,
  isAddRow,
  scoreRule,
  col,
  contactFields,
  updateScoreRule,
  updateStep,
  addStep,
  moveUp,
  moveDown,
  deleteStep,
  cellStyle,
  Row,
}: Props) {
  const threshold = scoreRule?.thresholdRange ?? [0, 100];

  const isValid = contactFields.some(f => f.key === step?.fieldName);

  const selectValue =
    step?.fieldName && isValid ? step?.fieldName : "";

  if (isAddRow || !step) {
    return (
        <Row>
          <div style={{ ...cellStyle(col.gap), padding: 8, paddingLeft: 28 }}>
            <Button
              size="medium"
              style= {{borderRadius: 20, background: "#86e8af"}}
              appearance="subtle"
              icon={<span style={{ marginBottom: 4, fontSize: 36, color: "#2ecc71" }}>＋</span>}
              onClick={() => addStep(stepsLength)}
            />
          </div>
        </Row>
      );
  }
  
  return (
    <div>
      {/* SUB HEADER */}
      <Row>
        <div style={cellStyle(col.order)} />
        <div style={cellStyle(col.field)} />
        <div style={cellStyle(col.type)} />
        <div style={cellStyle(col.gap)} />

        {step.type === "Lucene" ? (
          <>
            <div style={cellStyle(col.rule1)}>
              <Text size={200}>~</Text>
            </div>
            <div style={cellStyle(col.rule2)}>
              <Text size={200}>Top</Text>
            </div>
          </>
        ) : (
          <>
            <div style={cellStyle(col.rule1)}>
              <Text size={200}>Operator</Text>
            </div>
            <div style={cellStyle(col.rule2)}>
              <Text size={200}>Length</Text>
            </div>
          </>
        )}

        <div style={cellStyle(col.gap)} />

        <div style={cellStyle(col.weight)}>
          <Text size={200}>Weight</Text>
        </div>

        <div style={cellStyle(col.min)}>
          <Text size={200}>Min</Text>
        </div>

        <div style={cellStyle(col.max)}>
          <Text size={200}>Max</Text>
        </div>

        <div style={cellStyle(col.gap)} />
        <div style={cellStyle(col.stop)} />
        <div style={cellStyle(col.gap)} />
        <div style={cellStyle(col.action)} />
      </Row>

      <div style={{ height: 4 }} />

      {/* DATA ROW */}
      <Row>
        <div style={cellStyle(col.order)}>{step.order}</div>

        <div
          style={{
            border: isValid ? "none" : "1px solid #e74c3c",
            borderRadius: 4,
          }}
        >
          <Select
            value={selectValue}
            onChange={(_, d) =>
              updateStep({
                ...step,
                fieldName: d.value as keyof ContactData,
              })
            }
          >
            <option value="">-- missing field --</option>

            {contactFields.map(f => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </Select>
        </div>

        <div style={cellStyle(col.type)}>
          <Select
            value={step.type}
            onChange={(_, d) =>
              updateStep({ ...step, type: d.value as any })
            }
          >
            <option value="Query">Query</option>
            <option value="Lucene">Lucene</option>
          </Select>
        </div>

        <div style={cellStyle(col.gap)} />

        {/* RULES */}
        <div style={cellStyle(col.rule1)}>
          {step.type === "Query" ? (
            <Select
              value={step.queryRule.operator ?? "Equal"}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  queryRule: {
                    ...step.queryRule,
                    operator: d.value as QueryOperator,
                  },
                })
              }
            >
              {queryOperators.map(op => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              value={String(step.luceneRule.deviation ?? 1)}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  luceneRule: {
                    deviation: Number(d.value),
                    top: step.luceneRule.top ?? 100,
                  },
                })
              }
              style={{ width: 60 }}
            />
          )}
        </div>

        <div style={cellStyle(col.rule2)}>
          {step.type === "Query" ? (
            step.queryRule?.operator !== "Equal" && (
              <Input
                type="number"
                value={String(step.queryRule?.length ?? 0)}
                onChange={(_, d) =>
                  updateStep({
                    ...step,
                    queryRule: {
                      ...step.queryRule,
                      length: Number(d.value),
                    },
                  })
                }
                style={{ width: 60 }}
              />
            )
          ) : (
            <Input
              type="number"
              value={String(step.luceneRule.top ?? 100)}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  luceneRule: {
                    deviation: step.luceneRule.deviation ?? 1,
                    top: Number(d.value),
                  },
                })
              }
              style={{ width: 60 }}
            />
          )}
        </div>

        <div style={{ width: col.gap }} />

        {/* SCORE RULES */}
        <div style={cellStyle(col.weight)}>
          <Input
            type="number"
            value={String(scoreRule?.weight ?? 0)}
            onChange={(_, d) =>
              updateScoreRule(step.fieldName, {
                weight: Number(d.value),
              })
            }
            style={{ width: 60 }}
          />
        </div>

        <div style={cellStyle(col.min)}>
          <Input
            type="number"
            value={String(threshold[0])}
            onChange={(_, d) =>
              updateScoreRule(step.fieldName, {
                thresholdRange: [
                  Number(d.value),
                  threshold[1],
                ],
              })
            }
            style={{ width: 60 }}
          />
        </div>

        <div style={cellStyle(col.max)}>
          <Input
            type="number"
            value={String(threshold[1])}
            onChange={(_, d) =>
              updateScoreRule(step.fieldName, {
                thresholdRange: [
                  threshold[0],
                  Number(d.value),
                ],
              })
            }
            style={{ width: 60 }}
          />
        </div>

        <div style={{ width: col.gap }} />

        <div style={cellStyle(col.stop)}>
          <input
            type="checkbox"
            checked={step.stopOnMatch}
            onChange={e =>
              updateStep({
                ...step,
                stopOnMatch: e.target.checked,
              })
            }
          />
        </div>

        <div style={{ width: col.gap }} />

        {/* ACTION */}
        <div style={cellStyle(col.action)}>
          <Row>
            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ fontSize: 24, color: "#3498db" }}>↑</span>}
              onClick={() => moveUp(step.id)}
            />

            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ fontSize: 24, color: "#3498db" }}>↓</span>}
              onClick={() => moveDown(step.id)}
            />

            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ fontSize: 24, color: "#e74c3c" }}>✕</span>}
              onClick={() => deleteStep(step.id)}
            />
          </Row>
        </div>
      </Row>
    </div>
  );
}