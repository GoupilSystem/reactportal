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

  const maxTime = Math.max(...sorted.map(s => s.timeMs), 1);

  const renderLane = (
    title: string,
    items: StepExecutionReport[],
    color: string
  ) => (
    <div style={{ marginTop: 12 }}>
      {/* SECTION TITLE */}
      <div
      style={{
        fontWeight: 700,
        fontSize: 13,
        marginBottom: 8,
      }}
    >
      {title}
    </div>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
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
            {/* DESCRIPTION */}
            <div style={{ fontSize: 12 }}>
              {step.type === "Search" ? (
                <>
                  <span style={{ fontWeight: 600 }}>
                    #{step.order}: {step.operation} - {step.fieldName}
                  </span>

                  {step.candidatesFound != null && (
                    <span style={{ opacity: 0.65 }}>
                      {" "}
                      • {step.candidatesFound} hits
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontWeight: 600 }}>
                  Computed: {step.candidatesFound ?? 0} hits
                </span>
              )}
            </div>

            {/* BAR */}
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

            {/* TIME */}
            <div
              style={{
                fontSize: 11,
                opacity: 0.7,
              }}
            >
              {step.timeMs}ms
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        background: "#fff",
        padding: 10,
      }}
    >
      {/* SINGLE CLICKABLE SUMMARY ROW */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          padding: "4px 6px",
          borderRadius: 6,
          background: open ? "#f8fafc" : "transparent",
        }}
      >
              
            <Text size={400}>
          <span style={{ fontWeight: 700 }}>
            Total: {total}ms
          </span>

          <span style={{ opacity: 0.8 }}>
            {" "}· Search: {totalSearch}ms
            {" "}· Score: {totalScore}ms
            {" "}· Lookup Steps: {steps.length - 1}
          </span>
        </Text>

        <div
          style={{
            fontSize: 18,
            opacity: 0.7,
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 120ms ease",
          }}
        >
          ›
        </div>
      </div>

            {/* EXPANDS INSIDE SAME FRAME */}
      {open && (
        <div style={{ marginTop: 10 }}>
          {renderLane("Search", searchSteps, "#4f8cff")}
          {renderLane("Score", scoreSteps, "#2ecc71")}
        </div>
      )}
            
    </div>
  );
}
