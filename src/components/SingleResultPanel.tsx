import {
  DataGrid,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  createTableColumn
} from "@fluentui/react-components";
import { useEffect, useState } from "react";

import type { SingleResult } from "../types/LookupResultTypes";
import { ExecutionTimeline } from "./ExecutionTimeline";

type Props = {
  result: SingleResult;
};

export function SingleResultPanel({ result }: Props) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [result]); // resets only when result object changes (new run/tab content)

  const items = result.candidates ?? [];
  const execution = result.execution;

  const visibleItems = showAll ? items : items.slice(0, 5);

  const getContactUrl = (id: string) =>
    `https://kf.crm4.dynamics.com/main.aspx?etn=contact&id=${id}&pagetype=entityrecord`;

  // 🔥 FULL RESTORED FIELD RENDERING (old UX)
  const renderField = (value?: string, breakdown?: any) => {
    if (!value) return null;

    let bg: string | undefined;

    const percent = Math.round((breakdown?.normalizedSimilarity ?? 0) * 100);
    const abs = Math.round(breakdown?.absoluteSimilarity ?? 0);

    let color = "#e74c3c";
    if (breakdown?.normalizedSimilarity >= 1) color = "#2ecc71";
    else if (breakdown?.normalizedSimilarity >= 0.5) color = "#f1c40f";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "6px 8px",
          boxSizing: "border-box",
          borderRadius: 4,
          background: bg,
        }}
      >
        {/* VALUE */}
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          {value}
        </div>

        {/* BAR */}
        <div
          style={{
            height: 6,
            width: "100%",
            background: "#eee",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              background: color,
              transition: "width 0.2s ease",
            }}
          />
        </div>

        {/* METRICS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 10,
            opacity: 0.85,
          }}
        >
          <span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              {breakdown?.contributionToGlobalScore ?? 0}pts
            </span>
            {" "}· Norm {percent}%
          </span>

          <span>Abs {abs}%</span>
        </div>
      </div>
    );
  };

  const columns = [
    createTableColumn<any>({
        columnId: "score",
        renderHeaderCell: () => "Score",
        renderCell: item => {
          const action = item.scoring?.action;

          const color =
            action === "AutoMatch"
              ? "#2ECC71"
              : action === "Review"
              ? "#F1C40F"
              : "#E74C3C";

        return (
          <div
            style={{
              width: 28,
              height: 26,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {item.scoring?.score ?? 0}
          </div>
        );
      },
    }),

    createTableColumn<any>({
      columnId: "fuzzyScore",
      renderHeaderCell: () => "Fuzzy",
      renderCell: item =>
        item.scoring.fuzzyScore != null
          ? `${item.scoring.fuzzyScore.toFixed(2)} (${item.scoring.fuzzySourceField ?? "?"})`
          : "-",
    }),

    createTableColumn<any>({
      columnId: "ssn",
      renderHeaderCell: () => "SSN",
      renderCell: item => renderField(item.ssn, item.breakdown?.ssn),
    }),

    createTableColumn<any>({
      columnId: "email",
      renderHeaderCell: () => "Email",
      renderCell: item => renderField(item.email, item.breakdown?.email),
    }),

    createTableColumn<any>({
      columnId: "phone",
      renderHeaderCell: () => "Mobile",
      renderCell: item =>
        renderField(item.mobilePhone, item.breakdown?.mobilePhone),
    }),

    createTableColumn<any>({
      columnId: "fullName",
      renderHeaderCell: () => "Full Name",
      renderCell: item =>
        renderField(item.fullName, item.breakdown?.fullName),
    }),

    createTableColumn<any>({
      columnId: "street",
      renderHeaderCell: () => "Street",
      renderCell: item =>
        renderField(item.street, item.breakdown?.street),
    }),

    createTableColumn<any>({
      columnId: "postalCode",
      renderHeaderCell: () => "Postal Code",
      renderCell: item =>
        renderField(item.postalCode, item.breakdown?.postalCode),
    }),

    createTableColumn<any>({
      columnId: "contactId",
      renderHeaderCell: () => "Contact",
      renderCell: item =>
        item.contactId ? (
          <a
            href={getContactUrl(item.contactId)}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0078d4" }}
          >
            open
          </a>
        ) : null,
    }),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* EXECUTION TIMELINE */}
      {execution && (
        <ExecutionTimeline steps={execution.steps ?? []} />
      )}

      {/* TOOLBAR */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "white",
          padding: "4px 0",
          borderBottom: "1px solid #eee",
          cursor: "pointer",
          fontSize: 12,
        }}
        onClick={() => setShowAll(v => !v)}
      >
        {showAll ? "− Show top 5" : `+ Show all (${items.length})`}
      </div>

      {/* GRID */}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        <DataGrid items={visibleItems} columns={columns} sortable>
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell, columnId }) => (
                <DataGridHeaderCell
                  style={
                    columnId === "score"
                      ? { width: 60, minWidth: 60, maxWidth: 60 }
                      : columnId === "fuzzyScore"
                      ? { width: 80, minWidth: 80, maxWidth: 80 }
                      : columnId === "ssn"
                      ? { width: 60, minWidth: 60, maxWidth: 60 }
                      : { paddingLeft: 20 }
                  }
                >
                  {renderHeaderCell()}
                </DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>

          <DataGridBody<any>>
            {({ item, rowId }) => (
              <DataGridRow key={rowId} style={{ alignItems: "stretch" }}>
                {({ renderCell, columnId }) => (
                  <DataGridCell
                    style={
                    columnId === "score"
                      ? { width: 60, minWidth: 60, maxWidth: 60 }
                      : columnId === "fuzzyScore"
                      ? { width: 80, minWidth: 80, maxWidth: 80 }
                      : columnId === "ssn"
                      ? { width: 60, minWidth: 60, maxWidth: 60 }
                      : {}
                  }
                  >
                    {renderCell(item)}
                  </DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    </div>
  );
}