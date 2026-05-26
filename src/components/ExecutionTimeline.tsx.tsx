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
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  const maxTime = Math.max(...sorted.map(s => s.timeMs), 1);

  const searchSteps = sorted.filter(s => s.type === "Search");
  const scoreSteps = sorted.filter(s => s.type === "Score");

  const renderLane = (title: string, items: StepExecutionReport[]) => (
    <div style={{ marginBottom: 14 }}>
      <Text weight="semibold" size={200}>
        {title}
      </Text>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 6,
        }}
      >
        {items.map(step => {
          const widthPct = (step.timeMs / maxTime) * 100;

          const color =
            step.type === "Search"
              ? "#4f8cff"
              : "#2ecc71";

          return (
            <div
              key={`${step.type}-${step.order}-${step.fieldName}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* label */}
              <div style={{ width: 180, fontSize: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  #{step.order} {step.fieldName}
                </div>
                <div style={{ opacity: 0.6 }}>
                  {step.operation}
                  {step.candidatesFound != null
                    ? ` • ${step.candidatesFound} hits`
                    : ""}
                </div>
              </div>

              {/* bar */}
              <div
                style={{
                  height: 18,
                  width: `${widthPct}%`,
                  background: color,
                  borderRadius: 6,
                  transition: "width 200ms ease",
                }}
              />

              {/* time */}
              <div style={{ width: 70, fontSize: 12, opacity: 0.7 }}>
                {step.timeMs}ms
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const totalSearch = searchSteps.reduce((a, b) => a + b.timeMs, 0);
  const totalScore = scoreSteps.reduce((a, b) => a + b.timeMs, 0);

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 12,
        background: "#fff",
      }}
    >
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text weight="semibold">Execution Timeline</Text>

        <Text size={200} style={{ opacity: 0.7 }}>
          Search: {totalSearch}ms • Score: {totalScore}ms
        </Text>
      </div>

      <div style={{ height: 10 }} />

      {/* LAYERS */}
      {renderLane("Search Steps", searchSteps)}
      {renderLane("Score Steps", scoreSteps)}
    </div>
  );
}