import { Card, Button } from "@fluentui/react-components";

import { ContactDataPanel } from "./ContactDataPanel";
import { LookupPlanPanel } from "./LookupPlanPanel";

import type { ContactData, LookupPlan } from "../types/LookupTypes";

type Props = {
  contactData: ContactData;
  setContactData: React.Dispatch<React.SetStateAction<ContactData>>;

  lookupPlan: LookupPlan;
  setLookupPlan: React.Dispatch<React.SetStateAction<LookupPlan>>;

  run: () => void;
  loading: boolean;
};

export function RequestPanel(props: Props) {

  const invalidSteps = props.lookupPlan.searchSteps?.some(step => {
    const fieldExists =
      Object.keys(props.contactData).includes(step.fieldName);
    return !step.fieldName || !step.type || !fieldExists;
  }) ?? false;
  
  const canRun =
  !invalidSteps &&
  (props.lookupPlan.searchSteps?.length ?? 0) > 0;

  return (
    <Card
      style={{
        padding: 16,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* SCROLLABLE AREA */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* LEFT */}
          <div style={{ flex: "0 0 350px" }}>
            <ContactDataPanel
              contactData={props.contactData}
              setContactData={props.setContactData}
            />
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <LookupPlanPanel
              lookupPlan={props.lookupPlan}
              setLookupPlan={props.setLookupPlan}
              contactData={props.contactData}
            />
          </div>
        </div>
      </div>

      {/* STICKY FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          position: "sticky",
          bottom: 0,
          height: 30
        }}
      >
        <Button
          appearance="primary"
          onClick={props.run}
          disabled={props.loading || !canRun}
        >
          {props.loading ? "Running..." : "Lookup"}
        </Button>
      </div>
    </Card>
  );
}