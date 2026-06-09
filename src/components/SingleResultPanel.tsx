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
import type { LookupStep } from "../types/LookupRequestTypes";
import { ExecutionTimeline } from "./ExecutionTimeline";

type SingleResultProps = {
  result: SingleResult;
  lookupSteps?: LookupStep[];
};

export function SingleResultPanel({
  result,
  lookupSteps
}: SingleResultProps) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    console.log("Single Result values:", result);
  }, [result]);

  const items = result.candidates ?? [];
  const execution = result.singleResultTimeReport;
  const visibleItems = showAll ? items : items.slice(0, 5);

  const getContactUrl = (id: string) =>
    `https://kf.crm4.dynamics.com/main.aspx?etn=contact&id=${id}&pagetype=entityrecord`;

  const getStep = (fieldName: string) =>
    lookupSteps?.find(s =>
      s.fieldName.toLowerCase() === fieldName.toLowerCase()
    );
  
  const getFieldScore = (item: any, fieldName: string) =>
    item.fieldScores?.find(
      (x: any) => x.fieldName.toLowerCase() === fieldName.toLowerCase()
    );
  
  const renderField = (
    value?: string,
    fieldScore?: any,
    fieldName?: string
  ) => {
    if (!value) return null;

    const percent = Math.round((fieldScore?.normalizedSimilarity ?? 0) * 100);

    let color = "#e74c3c";
    if (fieldScore?.normalizedSimilarity >= 1) color = "#2ecc71";
    else if (fieldScore?.normalizedSimilarity >= 0.5) color = "#f1c40f";

    const pts = fieldScore?.contributionToCandidateScore ?? 0;

    const step = fieldName ? getStep(fieldName) : undefined;
    const rule = step?.scoreRule;

    const min = rule?.thresholdRange?.[0];
    const max = rule?.thresholdRange?.[1];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "8px 8px",
          boxSizing: "border-box",
        }}
      >
        {/* VALUE */}
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
          {value}
        </div>

        {/* METRICS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20px 10px 1fr",
            columnGap: 1,
            alignItems: "center",
          }}
        >
          {/* LEFT: SCORE */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 1, height: "6px" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {pts}
            </span>
            <span style={{ fontSize: 9, color: "#777" }}>pts</span>
          </div>

          <div />

          {/* RIGHT: BAR + SIMS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ROW 1: min | bar | max */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 1, height: "12px" }}>

              <div style={{ fontSize: 10, color: "#777", textAlign: "right" }}>
                {min}
              </div>

              <div
                style={{
                  flex: 1,
                  height: 6,
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

              <div style={{ fontSize: 10, color: "#777" }}>
                {max}
              </div>

            </div>

            {/* ROW 2: empty | similarity | empty */}
            <div style={{ display: "flex", alignItems: "flex-start", height: "6px" }}>

              <div style={{ width: 30 }} />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems:"flex-start",
                  fontSize: 12,
                  color: "#777",
                }}
              >
                {percent}%
              </div>

              <div style={{ width: 30 }} />

            </div>

          </div>
        </div>
      </div>
    );
  };

  const columns = [
    createTableColumn<any>({
        columnId: "score",
        renderHeaderCell: () => "Total Score",
        renderCell: item => {
          
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div
              style={{
                width: 28,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {item.candidateScore?.score ?? 0}
            </div>

            <div
              style={{
                fontSize: 11,
                color: "#777",
                lineHeight: 1,
              }}
            >
              pts
            </div>
          </div>
        );
      },
    }),

    createTableColumn<any>({
      columnId: "fuzzyScore",
      renderHeaderCell: () => "Fuzzy",
      renderCell: item =>
        item.candidateScore.fuzzyScore != null
          ? `${item.candidateScore.fuzzyScore.toFixed(2)} (${item.candidateScore.fuzzySourceField ?? "?"})`
          : "-",
    }),

    createTableColumn<any>({
      columnId: "ssn",
      renderHeaderCell: () => "Nr",
      renderCell: item =>
        renderField(
          item.isAccount ? item.organizationNumber : item.ssn,
          getFieldScore(item, item.isAccount ? "OrganizationNumber" : "SSN"),
          item.isAccount ? "OrganizationNumber" : "SSN"
        ),
    }),

    createTableColumn<any>({
      columnId: "email",
      renderHeaderCell: () => "Email",
      renderCell: item => 
        renderField(item.email, getFieldScore(item, "email"), "email"),
    }),

    createTableColumn<any>({
      columnId: "phone",
      renderHeaderCell: () => "Phone",
      renderCell: item =>
        renderField(
          item.isAccount ? item.telephone : item.mobilePhone,
          getFieldScore(item, item.isAccount ? "Telephone" : "MobilePhone"),
          item.isAccount ? "Telephone" : "MobilePhone"
        ),
    }),

    createTableColumn<any>({
      columnId: "name",
      renderHeaderCell: () => "Name",
      renderCell: item =>
        renderField(item.isAccount ? item.name : item.fullName, 
          getFieldScore(item, item.isAccount ? "name" : "fullName"), 
          item.isAccount ? "name" : "fullname")
    }),

    createTableColumn<any>({
      columnId: "street",
      renderHeaderCell: () => "Street",
      renderCell: item =>
        renderField(item.street, getFieldScore(item, "street"), "street"),
    }),

    createTableColumn<any>({
      columnId: "postalCode",
      renderHeaderCell: () => "Postal Code",
      renderCell: item =>
        renderField(item.postalCode, getFieldScore(item, "postalCode"), "postalCode"),
    }),

    createTableColumn<any>({
      columnId: "candidateId",
      renderHeaderCell: () => "",
      renderCell: item =>
        item.candidateId ? (
          <a
            href={getContactUrl(item.candidateId)}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#0078d4" }}
          >
            url
          </a>
        ) : null,
    }),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* EXECUTION TIMELINE */}
      {execution && (
        <ExecutionTimeline steps={execution.stepTimeReports ?? []} />
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
      <div style={{ maxHeight: 400, overflowY: "auto", overflowX: "auto" }}>
        <div style={{ minWidth: "max-content" }}>
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
                        ? { width: 140, minWidth: 140, maxWidth: 140, paddingLeft: 40 }
                        : columnId === "email"
                        ? { width: 180, minWidth: 180, maxWidth: 180 }
                        : columnId === "phone"
                        ? { width: 140, minWidth: 140, maxWidth: 140 }
                        : columnId === "street"
                        ? { width: 220, minWidth: 220, maxWidth: 220 }
                        : columnId === "candidateId"
                        ? { width: 20, minWidth: 20, maxWidth: 20 }
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
                        ? { width: 140, minWidth: 140, maxWidth: 140 }
                        : columnId === "email"
                        ? { width: 180, minWidth: 180, maxWidth: 180 }
                        : columnId === "phone"
                        ? { width: 140, minWidth: 140, maxWidth: 140 }
                        : columnId === "street"
                        ? { width: 220, minWidth: 220, maxWidth: 220 }
                        : columnId === "candidateId"
                        ? { width: 20, minWidth: 20, maxWidth: 20 }
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
    </div>
  );
}