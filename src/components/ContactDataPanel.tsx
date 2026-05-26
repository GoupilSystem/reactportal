import { useState } from "react";
import {
  Text,
  Textarea,
  Input,
  Switch,
  Field,
} from "@fluentui/react-components";

type ContactDataPanelProps = {
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
};

export function ContactDataPanel(props: ContactDataPanelProps) {
  const [jsonMode, setJsonMode] = useState(true);

  const inputJson = JSON.stringify(
    {
      socialSecurityNumber: props.socialSecurityNumber,
      fullName: props.fullName,
      email: props.email,
      mobilePhone: props.mobilePhone,
      street: props.street,
      postalCode: props.postalCode,
    },
    null,
    2
  );

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

              props.setSocialSecurityNumber(v.socialSecurityNumber ?? "");
              props.setFullName(v.fullName ?? "");
              props.setEmail(v.email ?? "");
              props.setMobilePhone(v.mobilePhone ?? "");
              props.setStreet(v.street ?? "");
              props.setPostalCode(v.postalCode ?? "");
            } catch {}
          }}
          style={{ minHeight: 320 }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <Field label="Social security number">
            <Input value={props.socialSecurityNumber} onChange={(e) => props.setSocialSecurityNumber(e.target.value)} />
          </Field>

          <Field label="Full name">
            <Input value={props.fullName} onChange={(e) => props.setFullName(e.target.value)} />
          </Field>

          <Field label="Email">
            <Input value={props.email} onChange={(e) => props.setEmail(e.target.value)} />
          </Field>

          <Field label="Mobile phone">
            <Input value={props.mobilePhone} onChange={(e) => props.setMobilePhone(e.target.value)} />
          </Field>

          <Field label="Street">
            <Input value={props.street} onChange={(e) => props.setStreet(e.target.value)} />
          </Field>

          <Field label="Postal code">
            <Input value={props.postalCode} onChange={(e) => props.setPostalCode(e.target.value)} />
          </Field>

        </div>
      )}
    </div>
  );
}