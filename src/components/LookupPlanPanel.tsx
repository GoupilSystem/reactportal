import { useState, useMemo } from "react";
import { Text, Textarea, Switch } from "@fluentui/react-components";

import type { LookupPlan, SearchStep, ScoreRule } from "../types/LookupTypes";
import type { ContactData } from "../types/LookupTypes";
import { SearchStepRow } from "./SearchStepRow";

const contactFields: { key: keyof ContactData; label: string }[] = [
  { key: "socialSecurityNumber", label: "SSN" },
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "mobilePhone", label: "Mobile Phone" },
  { key: "street", label: "Street" },
  { key: "postalCode", label: "Postal Code" },
];

type Props = {
  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;
};

export function LookupPlanPanel({ lookupPlan, setLookupPlan }: Props) {
  const [jsonMode, setJsonMode] = useState(false);

  const viewJson = JSON.stringify(lookupPlan, null, 2);

  const steps = useMemo(
    () => [...lookupPlan.searchSteps].sort((a, b) => a.order - b.order),
    [lookupPlan.searchSteps]
  );

  // Shared score state per fieldName
  const scoreRuleMap = useMemo(() => {
    const map = new Map<string, ScoreRule>();
    for (const r of lookupPlan.scoreRules ?? []) {
      map.set(r.fieldName, r);
    }
    return map;
  }, [lookupPlan.scoreRules]);

  function updateScoreRule(
    fieldName: keyof ContactData,
    patch: Partial<ScoreRule>
  ) {
    setLookupPlan(prev => {
      const existing = prev.scoreRules ?? [];

      const updated = existing.some(r => r.fieldName === fieldName)
        ? existing.map(r =>
            r.fieldName === fieldName ? { ...r, ...patch } : r
          )
        : [
            ...existing,
            {
              fieldName,
              weight: patch.weight ?? 0,
              thresholdRange: patch.thresholdRange ?? [0, 100],
            } as ScoreRule,
          ];

      return { ...prev, scoreRules: updated };
    });
  }

  function addStep(afterOrder: number) {
    setLookupPlan(prev => {
      const newStep: SearchStep = {
        id: crypto.randomUUID(),
        order: afterOrder + 1,
        fieldName: "email",
        type: "Query",
        queryRule: { operator: "Equal" },
        stopOnMatch: false,
      };

      const steps = [
        ...prev.searchSteps.map(s =>
          s.order > afterOrder ? { ...s, order: s.order + 1 } : s
        ),
        newStep,
      ].sort((a, b) => a.order - b.order);

      return { ...prev, searchSteps: steps };
    });
  }

  function moveUp(id: string) {
    setLookupPlan(prev => {
      const steps = [...prev.searchSteps].sort((a, b) => a.order - b.order);

      const index = steps.findIndex(s => s.id === id);
      if (index <= 0) return prev;

      [steps[index - 1].order, steps[index].order] = [
        steps[index].order,
        steps[index - 1].order,
      ];

      return { ...prev, searchSteps: [...steps] };
    });
  }

  function moveDown(id: string) {
    setLookupPlan(prev => {
      const steps = [...prev.searchSteps].sort((a, b) => a.order - b.order);

      const index = steps.findIndex(s => s.id === id);
      if (index >= steps.length - 1) return prev;

      [steps[index + 1].order, steps[index].order] = [
        steps[index].order,
        steps[index + 1].order,
      ];

      return { ...prev, searchSteps: [...steps] };
    });
  }

  function updateStep(updated: SearchStep) {
    setLookupPlan(prev => ({
      ...prev,
      searchSteps: prev.searchSteps.map(s =>
        s.id === updated.id ? updated : s
      ),
    }));
  }

  function deleteStep(id: string) {
    setLookupPlan(prev => {
      const steps = prev.searchSteps
        .filter(s => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 }));

      return { ...prev, searchSteps: steps };
    });
  }

  const col = {
    order: 20,
    field: 100,
    type: 100,
    rule1: 60,
    rule2: 60,
    gap: 20,
    weight: 60,
    min: 60,
    max: 60,
    stop: 20,
    action: 60,
  };

  const cellStyle = (width: number): React.CSSProperties => ({
    width,
    minWidth: width,
    textAlign: "center",
  });

  const Row = ({ children }: any) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Row>
        <Text weight="semibold">Lookup Plan</Text>

        <div style={{ marginLeft: "auto" }}>
          <Row>
            <Text size={200}>JSON</Text>
            <Switch
              checked={jsonMode}
              onChange={(_, d) => setJsonMode(d.checked)}
            />
          </Row>
        </div>
      </Row>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          background: "#fff",
          overflowX: "auto",
        }}
      >
        {!jsonMode && (
          <div style={{ minWidth: 1200 }}>
            {/* HEADER */}
            <Row>
              <div style={cellStyle(col.order)}>#</div>
              <div style={cellStyle(col.field)}>Field</div>
              <div style={cellStyle(col.type)}>Search Type</div>
              <div style={cellStyle(col.gap)} />

              <div
                style={{
                  width: col.rule1 + col.rule2 + 8,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Search Rules
              </div>

              <div style={cellStyle(col.gap)} />

              <div
                style={{
                  width: col.weight + col.min + col.max + 16,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Score Rules
              </div>

              <div style={cellStyle(col.gap)} />
              <div style={cellStyle(col.stop)}>Stop</div>
              <div style={cellStyle(col.gap)} />
              <div style={cellStyle(col.action)}>Actions</div>
            </Row>

            {/* ROWS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {steps.map(step => (
                <SearchStepRow
                  key={step.id}
                  step={step}
                  scoreRule={scoreRuleMap.get(step.fieldName)}
                  updateScoreRule={updateScoreRule}
                  col={col}
                  contactFields={contactFields}
                  updateStep={updateStep}
                  addStep={addStep}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  deleteStep={deleteStep}
                  cellStyle={cellStyle}
                  Row={Row}
                />
              ))}
            </div>
          </div>
        )}

        {jsonMode && (
          <Textarea
            value={viewJson}
            onChange={e => {
              try {
                setLookupPlan(JSON.parse(e.target.value));
              } catch {}
            }}
            style={{ width: "100%", minHeight: 320 }}
          />
        )}
      </div>
    </div>
  );
}