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

export function LookupResultGrid({ result }: { result: any }) {
  const [showAll, setShowAll] = useState(false);

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
          overflow: "hidden"
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
          fontSize: 10,
          lineHeight: 1,
          opacity: 0.75,
          marginTop: 0,
          paddingTop: 0,
        }}
      >
        <span>Norm {percent}% · +{breakdown?.contributionToGlobalScore ?? 0}</span>
        <span>Abs {abs}%</span>
      </div>
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
                      : { paddingLeft: 16 }
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