import { Text } from "@fluentui/react-components";
import { useEffect, useState } from "react";

import type { LookupResult } from "../types/LookupResultTypes";
import type { DataInput, ScoreRule } from "../types/LookupRequestTypes";
import { SingleResultPanel } from "./SingleResultPanel";

type ResultGridProps = {
  result: LookupResult;
  dataInput: DataInput[];
  scoreRules?: ScoreRule[];
  reviewThreshold: number;
  autoMatchThreshold: number;
};
export function ResultGrid({
  result,
  dataInput,
  scoreRules,
  reviewThreshold,
  autoMatchThreshold,
}: ResultGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [result]);

  const isVsLegacyLookup = result.runMode === "VsLegacyLookup";

  const gridColumns = isVsLegacyLookup
    ? "110px 160px 160px 130px 210px 80px 170px 110px"
    : "120px 180px 180px 200px 130px 120px";

  const getColor = (score: number) => {
    if (score >= autoMatchThreshold) return "#2ECC71"; // green
    if (score >= reviewThreshold) return "#F1C40F";    // yellow
    return "#E74C3C";                                   // red
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          gap: 8,
          padding: 10,
          fontWeight: 600,
          background: "#f3f2f1",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div>Top Score</div>
        <div>Full Name</div>
        <div>Email</div>
        <div>Mobile</div>
        <div>Street</div>
        <div>Postal</div>

        {isVsLegacyLookup && (
          <>
            <div>Legacy</div>
            <div>VS Legacy</div>
          </>
        )}
      </div>

      {/* ROWS */}
      {result.results.map((r, index) => {
        const input = dataInput[index];
        const isOpen = selectedIndex === index;

        const topCandidate = r.candidates?.[0];
        const topScore = topCandidate?.candidateScore?.score ?? 0;

        return (
          <div key={`${result.runMode}-${index}`}>
            <div
              onClick={() => setSelectedIndex(isOpen ? null : index)}
              style={{
                display: "grid",
                gridTemplateColumns: gridColumns,
                gap: 8,
                padding: 10,
                cursor: "pointer",
                background: isOpen ? "#f5f9ff" : "#fff",
                borderBottom: isOpen ? "none" : "1px solid #eee",
              }}
            >
              <Text weight="semibold">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: `2px solid ${getColor(topScore)}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {topScore}
                  </div>

                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>
              </Text>

              <div>{input?.fullName}</div>
              <div>{input?.email}</div>
              <div>{input?.mobilePhone}</div>
              <div>{input?.street}</div>
              <div>{input?.postalCode}</div>

              {isVsLegacyLookup && (
                <>
                  <div>-</div>
                  <div>-</div>
                </>
              )}
            </div>

            <div
              style={{
                maxHeight: isOpen ? "1000px" : "0",
                overflow: "hidden",
                transition: "max-height 250ms ease",
                background: "#fafafa",
              }}
            >
              <div style={{ padding: 12 }}>
                <SingleResultPanel result={r} scoreRules={scoreRules} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}