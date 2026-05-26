import { useState } from "react";
import {
  Text,
  Textarea,
  Input,
  Switch,
  Field,
} from "@fluentui/react-components";

import type { ContactData } from "../types/LookupTypes";

type Props = {
  contactData: ContactData;
  setContactData: React.Dispatch<React.SetStateAction<ContactData>>;
};

export function ContactDataPanel(props: Props) {
  const [jsonMode, setJsonMode] = useState(true);

  const inputJson = JSON.stringify(props.contactData, null, 2);

  function updateField<K extends keyof ContactData>(
    key: K,
    value: ContactData[K]
  ) {
    props.setContactData(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text weight="semibold">Contact Data</Text>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size={200}>JSON</Text>
          <Switch checked={jsonMode} onChange={(_, d) => setJsonMode(d.checked)} />
        </div>
      </div>

      {/* BODY */}
      {jsonMode ? (
        <Textarea
          value={inputJson}
          onChange={(e) => {
            try {
              const v = JSON.parse(e.target.value);
              props.setContactData(v);
            } catch {}
          }}
          style={{ minHeight: 320 }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <Field label="Social security number">
            <Input
              value={props.contactData.socialSecurityNumber ?? ""}
              onChange={(e) =>
                updateField("socialSecurityNumber", e.target.value)
              }
            />
          </Field>

          <Field label="Full name">
            <Input
              value={props.contactData.fullName ?? ""}
              onChange={(e) => updateField("fullName", e.target.value)}
            />
          </Field>

          <Field label="Email">
            <Input
              value={props.contactData.email ?? ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Field>

          <Field label="Mobile phone">
            <Input
              value={props.contactData.mobilePhone ?? ""}
              onChange={(e) => updateField("mobilePhone", e.target.value)}
            />
          </Field>

          <Field label="Street">
            <Input
              value={props.contactData.street ?? ""}
              onChange={(e) => updateField("street", e.target.value)}
            />
          </Field>

          <Field label="Postal code">
            <Input
              value={props.contactData.postalCode ?? ""}
              onChange={(e) => updateField("postalCode", e.target.value)}
            />
          </Field>

        </div>
      )}
    </div>
  );
}