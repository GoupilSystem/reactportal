import { useState } from "react";
import { Text } from "@fluentui/react-components";

type StepExecutionReport = {
  order: number;
  fieldName: string;
  type: "Search" | "Score";
  operation: string;
  timeMs: number;
  candidatesFound?: number;
};

type Props = {
  steps: StepExecutionReport[];
};

export function ExecutionTimeline({ steps }: Props) {
  const [open, setOpen] = useState(false);

  const sorted = [...steps].sort((a, b) => a.order - b.order);

  const searchSteps = sorted.filter(s => s.type === "Search");
  const scoreSteps = sorted.filter(s => s.type === "Score");

  const totalSearch = searchSteps.reduce((a, b) => a + b.timeMs, 0);
  const totalScore = scoreSteps.reduce((a, b) => a + b.timeMs, 0);
  const total = totalSearch + totalScore;

  const displayedStepsCount = searchSteps.length;

  const maxTime = Math.max(...sorted.map(s => s.timeMs), 1);

  const renderLane = (title: string, items: StepExecutionReport[], color: string) => (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(step => {
          const widthPct = (step.timeMs / maxTime) * 100;

          return (
            <div
              key={`${step.type}-${step.order}-${step.fieldName}`}
              style={{
                display: "grid",
                gridTemplateColumns: "260px 1fr 60px",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 12 }}>
                #{step.order}: {step.operation} - {step.fieldName}:{" "}
                {step.candidatesFound} candidate
                {step.candidatesFound !== 1 ? "s" : ""}
              </div>

              <div
                style={{
                  height: 16,
                  background: "#eef1f5",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${widthPct}%`,
                    background: color,
                    transition: "width 0.2s ease",
                  }}
                />
              </div>

              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {step.timeMs}ms
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: 6,
          background: open ? "#f8fafc" : "transparent",
        }}
      >
        <Text weight="semibold">Total: {total}ms</Text>

        <Text style={{ fontSize: 12, opacity: 0.75 }}>
          · Search: {totalSearch}ms · Score: {totalScore}ms · Steps:{" "}
          {displayedStepsCount}
        </Text>

        <div>{open ? "▲" : "▼"}</div>
      </div>

      <div
        style={{
          maxHeight: open ? 1000 : 0,
          overflow: "hidden",
          transition: "max-height 220ms ease",
        }}
      >
        <div style={{ marginTop: 10 }}>
          {renderLane("Search", searchSteps, "#4f8cff")}
          {renderLane("Score", scoreSteps, "#2ecc71")}
        </div>
      </div>
    </div>
  );
}