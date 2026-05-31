import { useEffect, useState } from "react";
import {
  Text,
  Textarea,
  Switch,
} from "@fluentui/react-components";

import type { ContactData } from "../types/LookupRequestTypes";

type Props = {
  contactData: ContactData[];
  setContactData: React.Dispatch<React.SetStateAction<ContactData[]>>;
};

export function ContactDataPanel(props: Props) {
  const [jsonMode, setJsonMode] = useState(true);
  const [jsonText, setJsonText] = useState("");

  // sync full batch → JSON editor
  useEffect(() => {
    if (jsonMode) {
      setJsonText(JSON.stringify(props.contactData, null, 2));
    }
  }, [props.contactData, jsonMode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
      
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 12,
          height: 24,
        }}
      >
        <Text weight="semibold">
          Input ({props.contactData.length} contacts)
        </Text>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text size={200}>JSON</Text>
          <Switch
            checked={jsonMode}
            onChange={(_, d) => setJsonMode(d.checked)}
          />
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex" }}>
        {jsonMode ? (
          <Textarea
            value={jsonText}
            onChange={(e) => {
              const v = e.target.value;
              setJsonText(v);

              try {
                const parsed: ContactData[] = JSON.parse(v);
                props.setContactData(parsed);
              } catch {
                // ignore invalid JSON while typing
              }
            }}
            style={{ flex: 1, height: "100%", minHeight: 0 }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 8,
              overflow: "auto",
            }}
          >
            {props.contactData.map((c, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Text weight="semibold">
                  Contact #{i + 1}
                </Text>

                <pre style={{ marginTop: 6, fontSize: 12 }}>
                  {JSON.stringify(c, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}