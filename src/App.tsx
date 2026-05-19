import { useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  Card,
  Button,
  Textarea,
  Text,
  makeStyles,
  Dropdown,
  Option 
} from "@fluentui/react-components";
import { matchContact } from "./api/contactApi";
import { ContactResultGrid } from "./components/ContactResultGrid";
import { motion, AnimatePresence } from "framer-motion";

const useStyles = makeStyles({
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    background: "#f5f6f8",
    padding: "20px",
    maxWidth: "100%",
    margin: "0 auto",
  },

  requestCard: {
    padding: "12px",
    paddingTop: "9px",
    paddingBottom: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },

  resultCard: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },

  textarea: {
    height: "100%",
    width: "100%",
  },

  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#f5f6f8",
    paddingBottom: "12px",
    backdropFilter: "blur(6px)",
  },

  panelRow: {
    display: "flex",
    gap: "12px",
    alignItems: "stretch",
  },

  jsonPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0
  },

  envDropdown: {
  minWidth: "100px !important",
  width: "100px !important",
}
});

export default function App() {
  const styles = useStyles();

  const [env, setEnv] = useState("PROD");

  const envOptions = [
    { key: "PROD", text: "PROD" },
    { key: "TEST", text: "TEST" },
    { key: "DEVTEST", text: "DEVTEST" },
    { key: "CONF", text: "CONF" },
  ];

  const [inputJson, setInputJson] = useState(`{
    "fullName": "Iselin Renée Lægreid",
    "email": "iselin@laegreid.net",
    "mobilePhone": "+4792809389",
    "street": "Harald Hårfagres gate 12 C",
    "postalCode": "0363"
  }`);

  const [configJson, setConfigJson] = useState(`{
    "searchRules": [
      { "fieldName": "Email", "operator": "Equal" },
      { "fieldName": "Email", "operator": "BeginsWith", "length": 5 },
      { "fieldName": "MobilePhone", "operator": "Equal" },
      { "fieldName": "MobilePhone", "operator": "EndsWith", "length": 8 },
      { "fieldName": "FullName", "operator": "Like", "pattern": "%{value}%" },
      { "fieldName": "Address", "operator": "Equal" }
    ],

    "scoringRules": [
      { "fieldName": "Email", "weight": 40, "thresholdRange": [50, 90] },
      { "fieldName": "MobilePhone", "weight": 30, "thresholdRange": [85, 100] },
      { "fieldName": "FullName", "weight": 15, "thresholdRange": [70, 100] },
      { "fieldName": "Address", "weight": 15, "thresholdRange": [70, 90] }
    ]
  }`);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    try {
      setLoading(true);

      const input = JSON.parse(inputJson);
      const config = JSON.parse(configJson);

      const payload = {
        ...input,
        environment: env,
        searchRules: config.searchRules,
        scoringRules: config.scoringRules
      };

      const response = await matchContact(payload);

      const newRun = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        inputName: input.fullName ?? input.email ?? "Unknown",
        result: response,
      };

      setResults(prev => [newRun, ...prev]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FluentProvider theme={webLightTheme}
      style={{
        backgroundColor: "#f5f6f8",
        minHeight: "100vh",
      }}
    >

      {/* TITLE (scrolls away) */}
      <div style={{
        minHeight: "1vh",
        background: "#f5f6f8",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text size={500} weight="semibold">
          Match Intelligence Center
        </Text>
      </div>

  {/* STICKY TOP */}
  <div className={styles.stickyHeader}>

    {/* REQUEST PANEL */}
    <div className={styles.page} style={{ paddingTop: 0 }}>
      <Card className={styles.requestCard}>
        
        <div className={styles.panelRow}>

          {/* LEFT */}
          <div className={styles.jsonPanel}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 50 }}>
              <Text size={300} weight="semibold" style={{ whiteSpace: "nowrap" }}>
                Data input vs
              </Text>

              <div style={{ width: 40 }}>
                <Dropdown
                  value={env}
                  selectedOptions={[env]}
                  onOptionSelect={(_, data) => {
                    if (data.optionValue) {
                      setEnv(data.optionValue);
                    }
                  }}
                >
                  {envOptions.map(e => (
                    <Option key={e.key} value={e.key}>
                      {e.text}
                    </Option>
                  ))}
                </Dropdown>
              </div>
            </div>

            <Textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className={styles.textarea}
              resize="vertical"
            />
          </div>

          {/* RIGHT */}
          <div className={styles.jsonPanel}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 50 }}>
              <Text size={300} weight="semibold">
                Dev config (prefetch + rules)
              </Text>
            </div>
            <Textarea
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              className={styles.textarea}
              resize="vertical"
            />
          </div>

        </div>

        <Button appearance="primary" onClick={run} disabled={loading}>
          {loading ? "Running..." : "Run Match"}
        </Button>

      </Card>
    </div>

  </div>

  {/* SCROLLING RESULTS */}
  <div className={styles.page}>
        <AnimatePresence mode="popLayout">
          {results.map((run) => (
            <motion.div
              key={run.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, // smooth slide
                opacity: { duration: 0.25 },
              }}
            >
              <Card className={styles.resultCard}>
                {/* HEADER */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap"
                }}>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Text weight="semibold">{run.inputName}</Text>

                    <Text size={200} style={{ opacity: 0.7 }}>
                      {new Date(run.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>

                  <div style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}>
                    <Text>Action: <b>{run.result.action}</b></Text>
                    <Text>Confidence: <b>{run.result.confidence}</b></Text>
                    <Text>Prefetched: <b>{run.result.candidateCount}</b></Text>
                    <Text style={{ opacity: 0.7 }}>
                      {run.result.prefetchExecutionTimeMs} ms
                    </Text>
                  </div>
                </div>

                <ContactResultGrid result={run.result} env={env} />
              </Card>
              
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </FluentProvider>
  );
}