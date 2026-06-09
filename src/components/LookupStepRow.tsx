import { useEffect } from "react";
import { type LookupStep, type ScoreRule, queryOperators } from "../types/LookupRequestTypes";
import type { DataInput, QueryOperator } from "../types/LookupRequestTypes";
import { Select, Input, Button, Text } from "@fluentui/react-components";

type Props = {
  step: LookupStep | null;
  stepsLength: number;
  isAddRow: boolean;

  col: any;
  fields: { key: keyof DataInput; label: string; group: string }[];

  updateStep: (s: LookupStep) => void;
  addStep: (order: number) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  deleteStep: (id: string) => void;

  cellStyle: (w: number) => React.CSSProperties;
  Row: React.FC<{ children: React.ReactNode }>;
};

export function LookupStepRow({
  step,
  stepsLength,
  isAddRow,
  col,
  fields,
  updateStep,
  addStep,
  moveUp,
  moveDown,
  deleteStep,
  cellStyle,
  Row,
}: Props) {
  const score = step?.scoreRule ?? { weight: 0, thresholdRange: [0, 100] as [number, number] };

  const isValid = fields.some(f => f.key === step?.fieldName);
  const selectValue = step?.fieldName && isValid ? step.fieldName : "";

  if (isAddRow || !step) {
    return (
      <div style={{ height: 40, paddingTop: 20 }}>
        <Row>
          <div style={{ ...cellStyle(col.addStep), padding: 20, paddingLeft: 28 }}>
            <Button
              appearance="subtle"
              onClick={() => addStep(stepsLength)}
              style={{
                width: 36,
                height: 36,
                minWidth: 36,
                padding: 0,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#86e8af",
              }}
              icon={
                <span style={{ paddingBottom: 6, fontSize: 36, lineHeight: 1 }}>
                  +
                </span>
              }
            />
          </div>
        </Row>
      </div>
    );
  }

  useEffect(() => {
    console.log("Fields in Row:", fields);
  }, [fields]);
  
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
              <Text size={100}>Top</Text>
            </div>
          </>
        ) : (
          <>
            <div style={cellStyle(col.rule1)}>
              <Text size={100}>Operator</Text>
            </div>
            <div style={cellStyle(col.rule2)}>
              <Text size={100}>Length</Text>
            </div>
          </>
        )}

        <div style={cellStyle(col.gap)} />

        <div style={cellStyle(col.weight)}>
          <Text size={100}>Max Pts</Text>
        </div>

        <div style={cellStyle(col.min)}>
          <Text size={100}>Min</Text>
        </div>

        <div style={cellStyle(col.max)}>
          <Text size={100}>Max</Text>
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
            onChange={(e) =>
              updateStep({
                ...step,
                fieldName: e.target.value as keyof DataInput,
              })
            }
            style={{ width: 150 }}
          >
            <optgroup label="Contact">
              {fields
                .filter(f => f.group === "Contact")
                .map(f => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Account">
              {fields
                .filter(f => f.group === "Account")
                .map(f => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
            </optgroup>

            <optgroup label="Shared">
              {fields
                .filter(f => f.group === "Shared")
                .map(f => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
            </optgroup>
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
            value={String(score.weight)}
            onChange={(_, d) =>
              updateStep({
                ...step,
                scoreRule: { ...score, weight: Number(d.value) },
              })
            }
            style={{ width: 60 }}
          />
        </div>

        <div style={cellStyle(col.min)}>
          <Input
            type="number"
            value={String(score.thresholdRange[0])}
            onChange={(_, d) =>
              updateStep({
                ...step,
                scoreRule: {
                  ...score,
                  thresholdRange: [score.thresholdRange[1], Number(d.value)],
                },
              })
            }
            style={{ width: 60 }}
          />
        </div>

        <div style={cellStyle(col.max)}>
          <Input
            type="number"
            value={String(score.thresholdRange[1])}
            onChange={(_, d) =>
              updateStep({
                ...step,
                scoreRule: {
                  ...score,
                  thresholdRange: [score.thresholdRange[0], Number(d.value)],
                },
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