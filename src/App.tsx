import { useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  Card,
  Text,
  makeStyles
} from "@fluentui/react-components";
import { matchContact } from "./api/contactApi";
import { ContactResultGrid } from "./components/ContactResultGrid";
import { RequestPanel } from "./components/RequestPanel";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchUI } from "./types/SearchUI";

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

  const [socialSecurityNumber, setSocialSecurityNumber] = useState("25059241837");
  const [fullName, setFullName] = useState("Iselin Renée Lægreid");
  const [email, setEmail] = useState("iselin@laegreid.net");
  const [mobilePhone, setMobilePhone] = useState("+4792809389");
  const [street, setStreet] = useState("Harald Hårfagres gate 12 C");
  const [postalCode, setPostalCode] = useState("0363");

  const inputJson = JSON.stringify(
  {
    socialSecurityNumber,
    fullName,
    email,
    mobilePhone,
    street,
    postalCode,
  },
  null,
  2
);

  const [search, setSearch] = useState<SearchUI>({
    mode: "lucerne",
    lucerneFactor: 1,
  });
  
  const [configJson, setConfigJson] = useState(`{
    "searchRules": [
      { "fieldName": "SocialSecurityNumber", "operator": "Equal" },
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
      search: {
        mode: search.mode === "lucerne" ? 0 : 1,
        lucerneFactor: search.lucerneFactor,
        querySearchRules: config.searchRules,
      },
      scoringRules: config.scoringRules,
    };
    console.log(payload);
    const response = await matchContact(payload);

    const newRun = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      inputName: input.fullName ?? input.email ?? "Unknown",
      result: response,
    };

    setResults((prev) => [newRun, ...prev]);
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

  <div className={styles.stickyHeader}>
    <RequestPanel
      socialSecurityNumber={socialSecurityNumber}
      setSocialSecurityNumber={setSocialSecurityNumber}
      fullName={fullName}
      setFullName={setFullName}
      email={email}
      setEmail={setEmail}
      mobilePhone={mobilePhone}
      setMobilePhone={setMobilePhone}
      street={street}
      setStreet={setStreet}
      postalCode={postalCode}
      setPostalCode={setPostalCode}

      configJson={configJson}
      setConfigJson={setConfigJson}

      search={search}
      setSearch={setSearch}

      run={run}
      loading={loading}
    />
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