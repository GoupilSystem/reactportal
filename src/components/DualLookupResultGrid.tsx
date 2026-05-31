import type { DualLookupResult } from "../types/LookupResultTypes";

type Props = {
  result: DualLookupResult;
};

export function DualLookupResultGrid({ result }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      
      {/* HEADER */}
      <div style={{ fontWeight: 700 }}>
        Dual Mode Result
      </div>

      {/* DIFF SUMMARY */}
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {result.diff.improved && "✔ Improved result"}
        {result.diff.regression && "⚠ Regression detected"}
        {result.diff.same && "≈ No change"}
      </div>

      {/* SIDE BY SIDE */}
      <div style={{ display: "flex", gap: 16 }}>

        {/* OLD */}
        <div style={{ flex: 1, border: "1px solid #eee", padding: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Old</div>
          <div>Candidates: {result.old.candidateCount}</div>
          <div>Time: {result.old.execution.totalTimeMs}ms</div>
        </div>

        {/* NEW */}
        <div style={{ flex: 1, border: "1px solid #eee", padding: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>New</div>
          <div>Candidates: {result.old.candidateCount}</div>
          <div>Time: {result.old.execution.totalTimeMs}ms</div>
        </div>

      </div>
    </div>
  );
}