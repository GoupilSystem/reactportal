import { Card, Button } from "@fluentui/react-components";
import { ContactDataPanel } from "./ContactDataPanel";
import { LookupPlanPanel } from "./LookupPlanPanel";

import type {
  ContactData,
  LookupPlan,
  RunMode,
} from "../types/LookupRequestTypes";

type Props = {
  contactData: ContactData[];
  setContactData: React.Dispatch<React.SetStateAction<ContactData[]>>;

  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;

  run: (mode: RunMode) => void;
  loading: boolean;

  runMode: RunMode;
  setRunMode: React.Dispatch<React.SetStateAction<RunMode>>;
};

export function RequestPanel(props: Props) {
  
  const steps = props.lookupPlan.searchSteps ?? [];

  const hasValidPlan =
    steps.length > 0 &&
    steps.every(step => Boolean(step.fieldName && step.type));

  const hasContacts = (props.contactData?.length ?? 0) > 0;

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
      {/* BODY */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 24 }}>
          
          {/* LEFT: FULL BATCH EDITOR */}
          <div style={{ flex: "0 0 350px" }}>
            <ContactDataPanel
              contactData={props.contactData}
              setContactData={props.setContactData}
            />
          </div>

          {/* RIGHT: LOOKUP PLAN */}
          <div style={{ flex: 1 }}>
            <LookupPlanPanel
              lookupPlan={props.lookupPlan}
              setLookupPlan={props.setLookupPlan}
              contactData={props.contactData[0]} // optional: first sample contact
            />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div
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
      </div>
    </Card>
  );
}