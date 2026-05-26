import {
  DataGrid,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  createTableColumn,
} from "@fluentui/react-components";
import { useState } from "react";
import { ExecutionTimeline } from "./ExecutionTimeline.tsx";

export function ContactResultGrid({ result }: { result: any }) {
  const [showAll, setShowAll] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const items = result?.candidates ?? [];
  const execution = result?.execution;

  const visibleItems = showAll ? items : items.slice(0, 5);

  const renderField = (value: string, breakdown?: any) => {
    if (!value) return null;

    let bg: string | undefined;

    const level = breakdown?.level;
    if (level === "Strong") bg = "#dff6dd";
    else if (level === "Medium") bg = "#fff4ce";
    else if (level === "Weak") bg = "#fde7e9";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "6px 8px",
          boxSizing: "border-box",
          borderRadius: 4,
          background: bg,
        }}
      >
        <span>{value}</span>

        {breakdown && (
          <span style={{ fontSize: 11, opacity: 0.75 }}>
            +{breakdown.contributionToGlobalScore} pts (
            {(breakdown.normalizedSimilarity * 100)?.toFixed(0)}% ×{" "}
            {breakdown.weight})
          </span>
        )}
      </div>
    );
  };

  const columns = [
    createTableColumn<any>({
      columnId: "score",
      renderHeaderCell: () => "Score",
      renderCell: item => <b>{item.score}</b>,
    }),

    createTableColumn<any>({
      columnId: "fuzzyScore",
      renderHeaderCell: () => "Fuzzy",
      renderCell: item => (
        <span>{item.fuzzyScore?.toFixed(2)}</span>
      ),
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
      renderCell: item => renderField(item.fullName, item.breakdown?.fullName),
    }),

    createTableColumn<any>({
      columnId: "address",
      renderHeaderCell: () => "Address",
      renderCell: item =>
        renderField(
          `${item.street ?? ""} ${item.postalCode ?? ""}`.trim(),
          item.breakdown?.address
        ),
    }),

    createTableColumn<any>({
      columnId: "contactId",
      renderHeaderCell: () => "Contact",
      renderCell: item => (
        <a
          href={getContactUrl("PROD", item.contactId)}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#0078d4" }}
        >
          {item.contactId}
        </a>
      ),
    }),
  ];

  const getContactUrl = (env: string, id: string) => {
    const base =
      env === "PROD"
        ? "https://kf.crm4.dynamics.com"
        : "https://kf-conf.crm4.dynamics.com";

    return `${base}/main.aspx?etn=contact&id=${id}&pagetype=entityrecord`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* EXECUTION SUMMARY */}
      {execution && (
        <>
          <div
            style={{
              fontSize: 12,
              opacity: 0.8,
              padding: "6px 8px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => setShowTimeline(v => !v)}
          >
            <span>
              Total: {execution.totalTimeMs}ms · Search: {execution.searchTimeMs}ms ·
              Score: {execution.scoreTimeMs}ms · Steps:{" "}
              {execution.steps?.length ?? 0}
            </span>

            <span style={{ opacity: 0.6 }}>
              {showTimeline ? "− hide timeline" : "+ show timeline"}
            </span>
          </div>

          {/* COLLAPSIBLE TIMELINE */}
          {showTimeline && (
            <ExecutionTimeline steps={execution.steps ?? []} />
          )}
        </>
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
        <DataGrid items={visibleItems} columns={columns} sortable >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell, columnId }) => (
                <DataGridHeaderCell
                  style={
                    columnId === "score"
                      ? { width: 60, minWidth: 60, maxWidth: 60 }
                      : columnId === "fuzzyScore"
                      ? { width: 70, minWidth: 70, maxWidth: 70 }
                      : {}
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
                        ? { width: 70, minWidth: 70, maxWidth: 70 }
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