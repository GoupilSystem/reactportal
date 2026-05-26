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
  return (
    <Card style={{ padding: 14 }}>

      <div style={{ display: "flex", gap: 30, alignItems: "stretch" }}>

        {/* LEFT - CONTACT */}
        <div style={{ flex: "0 0 350px" }}>
          <ContactDataPanel
            contactData={props.contactData}
            setContactData={props.setContactData}
          />
        </div>

        {/* RIGHT - LOOKUP PLAN */}
        <LookupPlanPanel
          lookupPlan={props.lookupPlan}
          setLookupPlan={props.setLookupPlan}
        />

      </div>

      {/* RUN */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <Button appearance="primary" onClick={props.run} disabled={props.loading}>
          {props.loading ? "Running..." : "Run Match"}
        </Button>
      </div>

    </Card>
  );
}