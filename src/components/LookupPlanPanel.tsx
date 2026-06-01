import { useState, useMemo } from "react";
import { Text, Textarea, Switch, Button } from "@fluentui/react-components";

import type { LookupPlan, SearchStep, ScoreRule } from "../types/LookupRequestTypes";
import type { DataInput } from "../types/LookupRequestTypes";
import { SearchStepRow } from "./SearchStepRow";
import { ThresholdBar } from "./ThresholdBar";

type Props = {
  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;
  dataInput: DataInput;

  onRunSingle: () => void;
  onRunDual: () => void;

  loading: boolean;

  reviewThreshold: number;
  setReviewThreshold: React.Dispatch<React.SetStateAction<number>>;

  autoMatchThreshold: number;
  setAutoMatchThreshold: React.Dispatch<React.SetStateAction<number>>;
};

export function LookupPlanPanel({
  lookupPlan,
  setLookupPlan,
  dataInput,
  onRunSingle,
  onRunDual,
  loading,
  reviewThreshold,
  setReviewThreshold,
  autoMatchThreshold,
  setAutoMatchThreshold,
}: Props) {
  
  const steps = useMemo(
    () => [...lookupPlan.searchSteps].sort((a, b) => a.order - b.order),
    [lookupPlan.searchSteps]
  );

  const hasValidPlan =
    steps.length > 0 &&
    steps.every(step => Boolean(step.fieldName && step.type));

  const hasContacts = !!dataInput;

  const canRun = hasValidPlan && hasContacts;

  const contactFields = useMemo(() => {
    return Object.keys(dataInput).map(key => ({
      key: key as keyof DataInput,
      label: key,
    }));
  }, [dataInput]);

  // Shared score state per fieldName
  const scoreRuleMap = useMemo(() => {
    const map = new Map<string, ScoreRule>();
    for (const r of lookupPlan.scoreRules ?? []) {
      map.set(r.fieldName, r);
    }
    return map;
  }, [lookupPlan.scoreRules]);

  function updateScoreRule(
    fieldName: keyof DataInput,
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
        queryRule: { operator: "Equal", length: 0 },
        luceneRule: { deviation: 0, top: 15 },
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

      return {
        ...prev,
        searchSteps: [...steps].sort((a, b) => a.order - b.order),
      };
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
    field: 150,
    type: 100,
    rule1: 60,
    rule2: 60,
    gap: 20,
    weight: 60,
    min: 60,
    max: 60,
    stop: 20,
    action: 40,
  };

  const cellStyle = (width: number): React.CSSProperties => ({
    width,
    minWidth: width,
    textAlign: "center",
  });

  const headerStyle = (w: number) => ({
    ...cellStyle(w)
  });

  const Row = ({ children }: any) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 24 }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* TOP PANEL */}
      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* HEADER ROW */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 👈 KEY FIX
            gap: 200,
          }}
        >
          {/* LEFT: THRESHOLD */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <ThresholdBar
              review={reviewThreshold}
              autoMatch={autoMatchThreshold}
              onChange={(r, a) => {
                setReviewThreshold(r);
                setAutoMatchThreshold(a);
              }}
            />
          </div>

          {/* RIGHT: BUTTONS */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Button
              appearance="primary"
              onClick={onRunSingle}
              disabled={loading || !canRun}
            >
              Fuzzy
            </Button>

            <Button
              onClick={onRunDual}
              disabled={loading || !canRun}
            >
              Fuzzy vs Legacy
            </Button>
          </div>
        </div>

      </div>

      {/* SEPARATOR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 12, height: 24 }}>
        <Text weight="semibold">Steps</Text>
      </div>

      <div
        style={{
          padding: 12,
          paddingTop: 4, 
          background: "#fff",
          overflowX: "auto",
        }}
      >
        
        <div style={{ width: "100%" }}>
          {/* HEADER */}
          <Row>
            <div style={headerStyle(col.order)}>#</div>
            <div style={headerStyle(col.field)}>Field</div>
            <div style={headerStyle(col.type)}>Search Type</div>
            <div style={cellStyle(col.gap)} />

            <div style={{ ...headerStyle(col.rule1 + col.rule2 + 8), textAlign: "center" }}>
              Search Rules
            </div>

            <div style={cellStyle(col.gap)} />

            <div style={{ ...headerStyle(col.weight + col.min + col.max + 16), textAlign: "center" }}>
              Score Rules
            </div>

            <div style={cellStyle(col.gap)} />
            <div style={headerStyle(col.stop)}>Return</div>
            <div style={cellStyle(col.gap)} />
            <div style={headerStyle(col.action)}>Actions</div>
          </Row>

          {/* ROWS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...steps, null].map((step, index) => (
            <SearchStepRow
              key={step?.id ?? "add-row"}
              step={step}
              stepsLength={steps.length}
              isAddRow={index === steps.length}
              scoreRule={step ? scoreRuleMap.get(step.fieldName) : undefined}
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
        
      </div>
    </div>

    </div>
  );
}