import type { DataInput, LookupStep } from "../types/LookupRequestTypes";
import type { ResultTab } from "../types/LookupResultTypes";
import { ResultGrid } from "./ResultGrid";

type ResultPanelProps = {
  tabs: ResultTab[];
  activeTab: string | null;
  setActiveTab: (id: string) => void;
  dataInput: DataInput[];
  lookupSteps?: LookupStep[];
  reviewThreshold: number;
  autoMatchThreshold: number;
};

export function ResultPanel({
  tabs,
  activeTab,
  setActiveTab,
  dataInput,
  lookupSteps,
  reviewThreshold,
  autoMatchThreshold
}: ResultPanelProps) {
  const active = tabs.find(t => t.id === activeTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {/* TAB BAR */}
      <div
        style={{
          display: "flex",
          gap: 6,
          borderBottom: "1px solid #e1e1e1",
          paddingBottom: 4,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 12,
                color: isActive ? "#0078d4" : "#444",
                borderBottom: isActive
                  ? "2px solid #0078d4"
                  : "2px solid transparent",
                transition: "all 0.15s ease",
                userSelect: "none",
              }}
            >
              {tab.title ?? `Payload ${index + 1}`}
            </div>
          );
        })}
      </div>

      {/* ACTIVE CONTENT */}
      <div style={{ marginTop: 6 }}>
         {active && (
          <ResultGrid
            key={active.id}
            result={active.result}
            dataInput={dataInput}
            lookupSteps={lookupSteps}
            reviewThreshold={reviewThreshold}
            autoMatchThreshold={autoMatchThreshold}
          />
        )}
      </div>

    </div>
  );
}