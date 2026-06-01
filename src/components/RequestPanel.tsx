import { Card, Text } from "@fluentui/react-components";
import { LookupPlanPanel } from "./LookupPlanPanel";
import { DataInputPanel } from "./DataInputPanel";
import type {
  DataInput,
  LookupPlan,
  RunMode,
} from "../types/LookupRequestTypes";


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
  
  const steps = props.lookupPlan.searchSteps ?? [];

  const hasValidPlan =
    steps.length > 0 &&
    steps.every(step => Boolean(step.fieldName && step.type));

  const hasContacts = (props.dataInput?.length ?? 0) > 0;

  const canRun = hasValidPlan && hasContacts;

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

          <div style={{ flex: 1 }}>
            <LookupPlanPanel
              lookupPlan={props.lookupPlan}
              setLookupPlan={props.setLookupPlan}
              dataInput={props.dataInput[0]}
              loading={props.loading}
              onRunSingle={() => props.run("Single")}
              onRunDual={() => props.run("Dual")}
              reviewThreshold={props.reviewThreshold}
              setReviewThreshold={props.setReviewThreshold}
              autoMatchThreshold={props.autoMatchThreshold}
              setAutoMatchThreshold={props.setAutoMatchThreshold}
            />
          </div>

        </div>
      </div>
    </Card>

      
    
  );
}

{/* FOOTER */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          position: "sticky",
          bottom: 0,
          height: 40,
          alignItems: "center",
        }}
      >
        <Button
          appearance="primary"
          onClick={() => props.run("Single")}
          disabled={props.loading || !canRun}
        >
          Fuzzy
        </Button>

        <Button
          appearance="primary"
          onClick={() => props.run("Dual")}
          disabled={props.loading || !canRun}
        >
          Fuzzy VS Legacy
        </Button>
      </div> */}