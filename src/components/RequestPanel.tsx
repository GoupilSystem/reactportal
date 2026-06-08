import { Card, Text } from "@fluentui/react-components";
import { LookupPlanPanel } from "./LookupPlanPanel";
import { DataInputPanel } from "./DataInputPanel";
import type {
  DataInput,
  LookupPlan,
  RunMode,
} from "../types/LookupRequestTypes";
import { useEffect } from "react";


type Props = {
  dataInput: DataInput[];
  setDataInput: React.Dispatch<React.SetStateAction<DataInput[]>>;

  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;

  run: (mode: RunMode) => void;
  loading: boolean;

  runMode: RunMode;
  setRunMode: React.Dispatch<React.SetStateAction<RunMode>>;

  reviewThreshold: number;
  setReviewThreshold: React.Dispatch<React.SetStateAction<number>>;

  autoMatchThreshold: number;
  setAutoMatchThreshold: React.Dispatch<React.SetStateAction<number>>;
};

export function RequestPanel(props: Props) {
  
  return (
    <Card
      style={{
        padding: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TITLES ROW (shared alignment) */}
      <div style={{ display: "flex", gap: 36, marginBottom: 0 }}>
        <div style={{ flex: "0 0 350px" }}>
          <Text weight="semibold">
            Input ({props.dataInput.length})
          </Text>
        </div>

        <div style={{ flex: 1 }}>
          <Text weight="semibold">Lookup Plan</Text>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 24 }}>
          
          <div style={{ flex: "0 0 350px" }}>
            <DataInputPanel
              dataInput={props.dataInput}
              setDataInput={props.setDataInput}
            />
          </div>

          <LookupPlanPanel
            lookupPlan={props.lookupPlan}
            setLookupPlan={props.setLookupPlan}
            dataInput={props.dataInput}
            loading={props.loading}
            onRunNewLookup={() => props.run("NewLookup")}
            onRunVsLegacyLookup={() => props.run("VsLegacyLookup")}
            reviewThreshold={props.reviewThreshold}
            setReviewThreshold={props.setReviewThreshold}
            autoMatchThreshold={props.autoMatchThreshold}
            setAutoMatchThreshold={props.setAutoMatchThreshold}
          />

        </div>
      </div>
    </Card>
      
    
  );
}