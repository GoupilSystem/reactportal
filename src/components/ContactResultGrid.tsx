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

export function ContactResultGrid({
  result,
  env,
}: {
  result: any;
  env: string;
}) {
  const [showAll, setShowAll] = useState(false);

  const items = result?.candidates ?? [];
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

        // 🔑 THIS is the important part
        height: "100%",
        width: "100%",
        alignSelf: "stretch",

        background: bg,
        borderRadius: "4px",

        padding: "6px 8px",
        boxSizing: "border-box",
      }}
    >
      <span>{value}</span>

      {breakdown && (
        <span style={{ fontSize: 11, opacity: 0.75 }}>
            Contribution: <b>{breakdown.contributionToGlobalScore} pts</b>{" "}
            (normalized similarity {(breakdown.normalizedSimilarity * 100)?.toFixed(0)}%
            {" × weight "}
            {breakdown.weight})
        </span>
      )}

    </div>
  );
};

  const renderAddress = (street: string, postal: string, breakdown?: any) => {
    const value = `${street ?? ""} ${postal ?? ""}`.trim();

    return renderField(value, breakdown);
    };

  const columns = [
    createTableColumn<any>({
      columnId: "score",
      renderHeaderCell: () => "Score",
      renderCell: (item) => (
        <b>{item.score}</b>
      ),
    }),

    createTableColumn<any>({
      columnId: "email",
      renderHeaderCell: () => "Email",
      renderCell: (item) =>
        renderField(item.email, item.breakdown?.email),
    }),

    createTableColumn<any>({
      columnId: "phone",
      renderHeaderCell: () => "Mobile",
      renderCell: (item) =>
        renderField(item.mobilePhone, item.breakdown?.mobilePhone),
    }),

    createTableColumn<any>({
      columnId: "fullName",
      renderHeaderCell: () => "Full Name",
      renderCell: (item) =>
        renderField(item.fullName, item.breakdown?.fullName),
    }),

    createTableColumn<any>({
        columnId: "address",
        renderHeaderCell: () => "Address",
        renderCell: (item) =>
            renderAddress(
            item.street,
            item.postalCode,
            item.breakdown?.address
            ),
        }),

    createTableColumn<any>({
        columnId: "contactId",
        renderHeaderCell: () => "Contact Id",
        renderCell: (item) => (
            <a
            href={getContactUrl(env, item.contactId)}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0078d4", textDecoration: "underline" }}
            >
            {item.contactId}
            </a>
        ),
        }),
  ];

  const columnSizingOptions = {
  score: {
    minWidth: 40,
    idealWidth: 40,
  },
};

    const getContactUrl = (env: string, id: string) => {
    const base =
        env === "PROD"
        ? "https://kf.crm4.dynamics.com"
        : env === "TEST"
        ? "https://kf-test.crm4.dynamics.com"
        : env === "DEVTEST"
        ? "https://kf-devtest.crm4.dynamics.com"
        : "https://kf-conf.crm4.dynamics.com";

    return `${base}/main.aspx?etn=contact&id=${id}&pagetype=entityrecord`;
    };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* STICKY TOOLBAR */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "white",
          padding: "4px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          onClick={() => setShowAll(v => !v)}
          style={{
            cursor: "pointer",
            fontSize: "12px",
            opacity: 0.8,
            userSelect: "none",
          }}
        >
          {showAll ? "− Show top 5" : `+ Show all (${items.length})`}
        </div>
      </div>

      {/* GRID */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <DataGrid
          items={visibleItems}
          columns={columns}
          sortable
          style={{ width: "100%" }}
          columnSizingOptions={columnSizingOptions}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell }) => (
                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>

          <DataGridBody<any>>
            {({ item, rowId }) => (
              <DataGridRow key={rowId} style={{ alignItems: "stretch" }}>
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      </div>
    </div>
  );
}