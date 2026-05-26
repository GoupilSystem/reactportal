import { useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  Card,
  Text,
  makeStyles
} from "@fluentui/react-components";

import { runLookup } from "./api/contactLookupApi";
import { ContactResultGrid } from "./components/ContactResultGrid";
import { RequestPanel } from "./components/RequestPanel";

import { motion, AnimatePresence } from "framer-motion";

import { defaultContactData, defaultLookupPlan } from "./defaults/DefaultData";

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
  resultCard: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  stickyHeader: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#f5f6f8",
    paddingBottom: "12px",
    backdropFilter: "blur(6px)",
  },
});

export default function App() {
  const styles = useStyles();

  const [contactData, setContactData] = useState(defaultContactData);
  const [lookupPlan, setLookupPlan] = useState(defaultLookupPlan);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    try {
      setLoading(true);

      // No need for id in the api, just used for add/delete operations in UI
      const payload = {
        contactData,
        lookupPlan: {
          ...lookupPlan,
          searchSteps: lookupPlan.searchSteps.map(({ id, ...s }) => s),
        },
      };

      console.log("Lookup payload:\n", JSON.stringify(payload, null, 2));

      const response = await runLookup(payload);

      setResults(prev => [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          inputName:
            contactData.fullName ||
            contactData.email ||
            "Unknown",
          result: response,
        },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FluentProvider theme={webLightTheme}>

      {/* TITLE */}
      <div style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center"
      }}>
        <Text size={500} weight="semibold">
          Match Intelligence Center
        </Text>
      </div>

      {/* REQUEST PANEL */}
      <div className={styles.stickyHeader}>
        <RequestPanel
          contactData={contactData}
          setContactData={setContactData}
          lookupPlan={lookupPlan}
          setLookupPlan={setLookupPlan}
          run={run}
          loading={loading}
        />
      </div>

      {/* RESULTS */}
      <div className={styles.page}>
        <AnimatePresence mode="popLayout">
          {results.map(run => (
            <motion.div
              key={run.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Card className={styles.resultCard}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text weight="semibold">{run.inputName}</Text>
                  <Text size={200} style={{ opacity: 0.7 }}>
                    {new Date(run.timestamp).toLocaleTimeString()}
                  </Text>
                </div>

                <ContactResultGrid result={run.result} />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </FluentProvider>
  );
}