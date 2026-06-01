import { Text } from "@fluentui/react-components";
import { useEffect, useState } from "react";

import type { LookupResult } from "../types/LookupResultTypes";
import { SingleResultPanel } from "./SingleResultPanel";

type Props = {
  result: LookupResult;
};

export function ResultGrid({ result }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [result]);
  
  const isDual = result.runMode === "Dual";

  const gridColumns = isDual
    ? "110px 160px 160px 130px 210px 80px 170px 110px"
    : "120px 180px 180px 200px 130px 120px";

  const getColor = (action?: string) =>
    action === "AutoMatch"
      ? "#2ECC71"
      : action === "Review"
      ? "#F1C40F"
      : "#E74C3C";

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

        {isDual && (
          <>
            <div>Legacy</div>
            <div>Diff</div>
          </>
        )}
      </div>

      {/* ROWS */}
      {result.results.map((r, index) => {
        const dataInput = r.dataInput;
        const isOpen = selectedIndex === index;

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
                transition: "background 0.2s",
              }}
            >
              <Text weight="semibold">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: `2px solid ${getColor(r.action)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {r.confidence}
                </div>

              <span>{isOpen ? "▲" : "▼"}</span>
            </div>
            </Text>
              <div>{dataInput?.fullName}</div>
              <div>{dataInput?.email}</div>
              <div>{dataInput?.mobilePhone}</div>
              <div>{dataInput?.street}</div>
              <div>{dataInput?.postalCode}</div>

              {isDual && (
                <>
                  <div>
                    {r.legacyLookupSummary?.statusText ?? "-"}
                  </div>

                  <div>
                    {r.vsLegacyDiff?.improved
                      ? "Improved"
                      : r.vsLegacyDiff?.regression
                      ? "Regression"
                      : "Same"}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                maxHeight: isOpen ? "1000px" : "0",
                overflow: "hidden",
                transition: "max-height 250ms ease",
                background: "#fafafa",
                borderBottom: isOpen ? "1px solid #eee" : "none",
              }}
            >
              <div style={{ padding: 12 }}>
                <SingleResultPanel result={r} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}