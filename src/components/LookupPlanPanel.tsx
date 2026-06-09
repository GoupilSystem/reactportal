import { useState, useMemo, useEffect } from "react";
import { Text, Textarea, Switch, Button } from "@fluentui/react-components";

import type { LookupPlan, LookupStep } from "../types/LookupRequestTypes";
import type { DataInput } from "../types/LookupRequestTypes";
import { LookupStepRow } from "./LookupStepRow";
import { ThresholdBar } from "./ThresholdBar";
import { buildFieldOptions } from "../utils/Helper";

type Props = {
  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;
  dataInput: DataInput[];

  onRunNewLookup: () => void;
  onRunVsLegacyLookup: () => void;

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
  onRunNewLookup,
  onRunVsLegacyLookup,
  loading,
  reviewThreshold,
  setReviewThreshold,
  autoMatchThreshold,
  setAutoMatchThreshold,
}: Props) {
  const steps = useMemo(
    () => [...lookupPlan.lookupSteps].sort((a, b) => a.order - b.order),
    [lookupPlan.lookupSteps]
  );


  const hasValidPlan =
    steps.length > 0 &&
    steps.every(step => Boolean(step.fieldName && step.type));

  const hasContacts = !!dataInput;

  const canRun = hasValidPlan && hasContacts;

  const fields = useMemo(
    () => buildFieldOptions(dataInput),
    [dataInput]
  );

  function addStep(afterOrder: number) {
    setLookupPlan(prev => {
      const field: keyof DataInput = "email";

      const newStep: LookupStep = {
        id: crypto.randomUUID(),
        order: afterOrder + 1,
        fieldName: field,
        type: "Query",
        queryRule: { operator: "Equal", length: 0 },
        luceneRule: { deviation: 1, top: 15 },
        stopOnMatch: false,
        scoreRule: {
          weight: 30,
          thresholdRange: [70, 100],
        },
      };

      const updatedSteps = [
        ...prev.lookupSteps.map(s =>
          s.order > afterOrder ? { ...s, order: s.order + 1 } : s
        ),
        newStep,
      ].sort((a, b) => a.order - b.order);

      return {
        ...prev,
        lookupSteps: updatedSteps
      };
    });
  }

  function moveUp(id: string) {
    setLookupPlan(prev => {
      const steps = [...prev.lookupSteps].sort((a, b) => a.order - b.order);

      const index = steps.findIndex(s => s.id === id);
      if (index <= 0) return prev;

      [steps[index - 1].order, steps[index].order] = [
        steps[index].order,
        steps[index - 1].order,
      ];

      return {
        ...prev,
        lookupSteps: [...steps].sort((a, b) => a.order - b.order),
      };
    });
  }

  function moveDown(id: string) {
    setLookupPlan(prev => {
      const steps = [...prev.lookupSteps].sort((a, b) => a.order - b.order);

      const index = steps.findIndex(s => s.id === id);
      if (index >= steps.length - 1) return prev;

      [steps[index + 1].order, steps[index].order] = [
        steps[index].order,
        steps[index + 1].order,
      ];

      return { ...prev, lookupSteps: [...steps] };
    });
  }

  function updateStep(updated: LookupStep) {
    setLookupPlan(prev => ({
      ...prev,
      lookupSteps: prev.lookupSteps.map(s =>
        s.id === updated.id ? updated : s
      ),
    }));
  }

  function deleteStep(id: string) {
    setLookupPlan(prev => {
      const remainingSteps = prev.lookupSteps
        .filter(s => s.id !== id)
        .map((s, i) => ({ ...s, order: i + 1 }));

      return {
        ...prev,
        lookupSteps: remainingSteps,
      };
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
    addStep: 60 
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
            justifyContent: "space-between",
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
              onClick={onRunNewLookup}
              disabled={loading || !canRun}
            >
              Fuzzy
            </Button>

            <Button
              onClick={onRunVsLegacyLookup}
              disabled={loading || !canRun}
            >
              Fuzzy VS Legacy
            </Button>
          </div>
        </div>

      </div>

      {/* SEPARATOR */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 12, height: 4 }}>
        <Text weight="semibold">Steps</Text>
      </div>

      <div
        style={{
          padding: 10,
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
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[...steps, null].map((step, index) => (
            <LookupStepRow
              key={step?.id ?? "add-row"}
              step={step}
              stepsLength={steps.length}
              isAddRow={index === steps.length}
              col={col}
              fields={fields}
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