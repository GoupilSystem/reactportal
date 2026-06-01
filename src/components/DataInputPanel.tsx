import { useEffect, useState } from "react";
import {
  Text,
  Textarea,
  Switch,
} from "@fluentui/react-components";

import type { DataInput } from "../types/LookupRequestTypes";

type Props = {
  dataInput: DataInput[];
  setDataInput: React.Dispatch<React.SetStateAction<DataInput[]>>;
};

export function DataInputPanel(props: Props) {
  const [jsonMode, setJsonMode] = useState(true);
  const [jsonText, setJsonText] = useState("");

  // sync full batch → JSON editor
  useEffect(() => {
      setJsonText(JSON.stringify(props.dataInput, null, 2));
    }, [props.dataInput, jsonMode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
      
      {/* BODY */}
      <div style={{ flex: 1, display: "flex" }}>
        <Textarea
          value={jsonText}
          onChange={(e) => {
            const v = e.target.value;
            setJsonText(v);

            try {
              const parsed: DataInput[] = JSON.parse(v);
              props.setDataInput(parsed);
            } catch {
              // ignore invalid JSON while typing
            }
          }}
          style={{ flex: 1, height: "100%", minHeight: 0 }}
        />
      </div>
    </div>
  );
}