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
    ? "160px 250px 250px 150px 200px 120px"
    : "160px 250px 250px 150px";

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
        <div>Full Name</div>
        <div>Email</div>
        <div>Mobile</div>
        <div>Best Match</div>

        {isDual && (
          <>
            <div>Legacy</div>
            <div>Diff</div>
          </>
        )}
      </div>

      {/* ROWS */}
      {result.results.map((r, index) => {
        const contact = r.contactData;
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
              <div>{contact?.fullName}</div>
              <div>{contact?.email}</div>
              <div>{contact?.mobilePhone}</div>

              <Text weight="semibold">
                {r.confidence}% {isOpen ? "▲" : "▼"}
              </Text>

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