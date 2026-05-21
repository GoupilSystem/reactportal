import { useState } from "react";
import { Card, Button, Text, Dropdown, Option, Textarea } from "@fluentui/react-components";

export function JsonRequestPanel({
  env,
  setEnv,
  envOptions,
  inputJson,
  setInputJson,
  configJson,
  setConfigJson,
  run,
  loading
}: any) {
  const [open, setOpen] = useState(true);

  return (
    <Card>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text weight="semibold">JSON Request Panel</Text>

        <Button appearance="subtle" size="small" onClick={() => setOpen(v => !v)}>
          {open ? "−" : "+"}
        </Button>
      </div>

      {!open ? (
        <Text style={{ opacity: 0.6, marginTop: 6 }}>
          collapsed
        </Text>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>

            <div style={{ flex: 1 }}>
              <Text size={300}>Data input</Text>

              <Dropdown
                value={env}
                selectedOptions={[env]}
                onOptionSelect={(_, d) => d.optionValue && setEnv(d.optionValue)}
              >
                {envOptions.map((e: any) => (
                  <Option key={e.key} value={e.key}>
                    {e.text}
                  </Option>
                ))}
              </Dropdown>

              <Textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
              />
            </div>

            <div style={{ flex: 1 }}>
              <Text size={300}>Match config</Text>

              <Textarea
                value={configJson}
                onChange={(e) => setConfigJson(e.target.value)}
              />
            </div>

          </div>

          <Button appearance="primary" onClick={run} disabled={loading}>
            {loading ? "Running..." : "Run Match"}
          </Button>
        </>
      )}

    </Card>
  );
}