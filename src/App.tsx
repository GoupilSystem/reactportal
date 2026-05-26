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


import { defaultLookupConfig } from "./defaults/Defaults";

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

  // CONTACT
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("25059241837");
  const [fullName, setFullName] = useState("Iselin Renée Lægreid");
  const [email, setEmail] = useState("iselin@laegreid.net");
  const [mobilePhone, setMobilePhone] = useState("+4792809389");
  const [street, setStreet] = useState("Harald Hårfagres gate 12 C");
  const [postalCode, setPostalCode] = useState("0363");

  const [lookupConfig, setLookupConfig] = useState(defaultLookupConfig);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  async function run() {
    try {
      setLoading(true);

      const payload = {
        contactData: {
          socialSecurityNumber,
          fullName,
          email,
          mobilePhone,
          street,
          postalCode,
        },
        lookupConfig: {
          ...lookupConfig,
          lookupRules: lookupConfig.lookupRules.filter(r => r.enabled),
        }
      };

      console.log("Lookup payload (pretty):\n", JSON.stringify(payload, null, 2));

      const response = await runLookup(payload);

      setResults(prev => [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          inputName: fullName || email || "Unknown",
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
          lookupConfig={lookupConfig}
          setLookupConfig={setLookupConfig}
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