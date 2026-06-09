import { Text } from "@fluentui/react-components";
import { useEffect, useState } from "react";

import type { LookupResult } from "../types/LookupResultTypes";
import type { DataInput, LookupStep } from "../types/LookupRequestTypes";
import { SingleResultPanel } from "./SingleResultPanel";

export function ResultGrid({
  result,
  dataInput,
  lookupSteps,
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
    if (score >= autoMatchThreshold) return "#2ECC71";
    if (score >= reviewThreshold) return "#F1C40F";
    return "#E74C3C";
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
        <div>Name</div>
        <div>Email</div>
        <div>Phone</div>
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
        const input = dataInput?.[index]; // safe fallback
        const isOpen = selectedIndex === index;

        const topCandidate = r.candidates?.[0];
        const topScore = topCandidate?.candidateScore?.score ?? 0;

        const name =
          input?.organizationNumber
            ? input?.name ?? "-"
            : input?.fullName ?? "-";

        const phone =
          input?.organizationNumber
            ? input?.telephone ?? "-"
            : input?.mobilePhone ?? "-";

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

              <div>{name}</div>
              <div>{input?.email ?? "-"}</div>
              <div>{phone}</div>
              <div>{input?.street ?? "-"}</div>
              <div>{input?.postalCode ?? "-"}</div>

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
                <SingleResultPanel result={r} lookupSteps={lookupSteps} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}