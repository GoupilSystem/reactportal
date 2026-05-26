import type { SearchStep, ScoreRule } from "../types/LookupTypes";
import type { ContactData } from "../types/LookupTypes";
import { Select, Input, Button, Text } from "@fluentui/react-components";

type Props = {
  step: SearchStep;
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
              <Text size={200}>Level</Text>
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
            <div style={cellStyle(col.rule2)} />
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

        <div style={cellStyle(col.field)}>
          <Select
            value={step.fieldName}
            onChange={(_, d) =>
              updateStep({
                ...step,
                fieldName: d.value as keyof ContactData,
              })
            }
          >
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
              value={step.queryRule?.operator ?? "Equal"}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  queryRule: {
                    ...step.queryRule,
                    operator: d.value as any,
                  },
                })
              }
            >
              <option value="Equal">Equal</option>
              <option value="GreaterEqual">GreaterEqual</option>
              <option value="BeginsWith">BeginsWith</option>
              <option value="EndsWith">EndsWith</option>
              <option value="Like">Like</option>
            </Select>
          ) : (
            <Input
              type="number"
              value={String(step.luceneRule?.level ?? 1)}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  luceneRule: {
                    level: Number(d.value),
                    top: step.luceneRule?.top ?? 100,
                  },
                })
              }
              style={{ width: 60 }}
            />
          )}
        </div>

        <div style={cellStyle(col.rule2)}>
          {step.type === "Lucene" && (
            <Input
              type="number"
              value={String(step.luceneRule?.top ?? 100)}
              onChange={(_, d) =>
                updateStep({
                  ...step,
                  luceneRule: {
                    level: step.luceneRule?.level ?? 1,
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
              icon={<span style={{ color: "#2ecc71" }}>＋</span>}
              onClick={() => addStep(step.order)}
            />

            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ color: "#3498db" }}>↑</span>}
              onClick={() => moveUp(step.id)}
            />

            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ color: "#3498db" }}>↓</span>}
              onClick={() => moveDown(step.id)}
            />

            <Button
              size="small"
              appearance="subtle"
              style={{ minWidth: 12, width: 12, padding: 0 }}
              icon={<span style={{ color: "#e74c3c" }}>✕</span>}
              onClick={() => deleteStep(step.id)}
            />
          </Row>
        </div>
      </Row>
    </div>
  );
}