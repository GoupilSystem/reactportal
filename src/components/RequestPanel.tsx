import { Card, Button } from "@fluentui/react-components";

import { ContactDataPanel } from "./ContactDataPanel";
import { LookupConfigPanel } from "./LookupConfigPanel";

import type { LookupConfig } from "../types/LookupConfig";

type Props = {
  // Contact
  socialSecurityNumber: string;
  setSocialSecurityNumber: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  mobilePhone: string;
  setMobilePhone: (v: string) => void;
  street: string;
  setStreet: (v: string) => void;
  postalCode: string;
  setPostalCode: (v: string) => void;

  // NEW SINGLE SOURCE OF TRUTH
  lookupConfig: LookupConfig;
  setLookupConfig: React.Dispatch<React.SetStateAction<LookupConfig>>;

  run: () => void;
  loading: boolean;
};

export function RequestPanel(props: Props) {
  return (
    <Card style={{ padding: 14 }}>

      <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>

        {/* LEFT */}
        <div style={{ flex: "0 0 450px" }}>
          <ContactDataPanel
            socialSecurityNumber={props.socialSecurityNumber}
            setSocialSecurityNumber={props.setSocialSecurityNumber}
            fullName={props.fullName}
            setFullName={props.setFullName}
            email={props.email}
            setEmail={props.setEmail}
            mobilePhone={props.mobilePhone}
            setMobilePhone={props.setMobilePhone}
            street={props.street}
            setStreet={props.setStreet}
            postalCode={props.postalCode}
            setPostalCode={props.setPostalCode}
          />
        </div>

        {/* RIGHT */}
        <LookupConfigPanel
          lookupConfig={props.lookupConfig}
          setLookupConfig={props.setLookupConfig}
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