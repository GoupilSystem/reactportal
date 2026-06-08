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
import type { ScoreRule } from "../types/LookupRequestTypes";

type SingleResultProps = {
  result: SingleResult;
  scoreRules?: ScoreRule[];
};

export function SingleResultPanel({ result, scoreRules }: SingleResultProps) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [result]); // resets only when result object changes (new run/tab content)
  
  const items = result.candidates ?? [];
  const execution = result.singleResultTimeReport;

  const visibleItems = showAll ? items : items.slice(0, 5);

  const getContactUrl = (id: string) =>
    `https://kf.crm4.dynamics.com/main.aspx?etn=contact&id=${id}&pagetype=entityrecord`;

  const getScoreRule = (fieldName: string) => {
    return scoreRules?.find(r => r.fieldName === fieldName);
  };  

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

    const rule = fieldName ? getScoreRule(fieldName) : undefined;

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
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
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
      renderHeaderCell: () => "SSN",
      renderCell: item => 
        renderField(item.ssn, getFieldScore(item, "SSN"), "SSN"),
    }),

    createTableColumn<any>({
      columnId: "email",
      renderHeaderCell: () => "Email",
      renderCell: item => 
        renderField(item.email, getFieldScore(item, "email"), "email"),
    }),

    createTableColumn<any>({
      columnId: "phone",
      renderHeaderCell: () => "Mobile",
      renderCell: item =>
        renderField(item.mobilePhone, getFieldScore(item, "mobilePhone"), "mobilePhone"),
    }),

    createTableColumn<any>({
      columnId: "fullName",
      renderHeaderCell: () => "Full Name",
      renderCell: item =>
        renderField(item.fullName, getFieldScore(item, "fullName"), "fullName"),
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
        renderField(item.postalCode, item.breakdown?.postalCode, "postalCode"),
    }),

    createTableColumn<any>({
      columnId: "candidateId",
      renderHeaderCell: () => "Contact",
      renderCell: item =>
        item.candidateId ? (
          <a
            href={getContactUrl(item.candidateId)}
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
                      : columnId === "candidateId"
                      ? { width: 80, minWidth: 80, maxWidth: 80 }
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
                      : columnId === "candidateId"
                      ? { width: 80, minWidth: 80, maxWidth: 80 }
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