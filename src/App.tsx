import { useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  Text,
  makeStyles
} from "@fluentui/react-components";

import { runLookup } from "./api/lookupApi";
import { RequestPanel } from "./components/RequestPanel";
import { defaultContactData, defaultLookupPlan } from "./defaults/DefaultData";
import type { ContactData, RunMode } from "./types/LookupRequestTypes";
import type { ResultTab } from "./types/LookupResultTypes";
import { ResultPanel } from "./components/ResultPanel";

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
  result: {
    display: "flex",
    flexDirection: "column",
    background: "#f5f6f8",
    padding: "10px",
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
    maxHeight: "40vh",
    overflowY: "auto",
  }
});

export default function App() {
  const styles = useStyles();

  const [contactData, setContactData] = useState<ContactData[]>(defaultContactData);
  const [lookupPlan, setLookupPlan] = useState(defaultLookupPlan);

  const [tabs, setTabs] = useState<ResultTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [requestHeight, setRequestHeight] = useState(300);
  const [runMode, setRunMode] = useState<RunMode>("Single");

  const startDrag = (e: React.MouseEvent) => {
  const startY = e.clientY;
  const startHeight = requestHeight;

  const onMove = (ev: MouseEvent) => {
    const delta = ev.clientY - startY;
    setRequestHeight(Math.max(150, startHeight + delta));
  };

  const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  async function run() {
    try {
      setLoading(true);
      
      const payload = {
        contactData,
        lookupPlan: {
          ...lookupPlan,
          searchSteps: lookupPlan.searchSteps.map(({ id, ...s }) => s),
        },
        runMode,
      };

      console.log("Lookup payload:\n", JSON.stringify(payload, null, 2));
      
      const response = await runLookup(payload);
      
      console.log("API result (raw):", response);
      
      setTabs(prev => {
        const newTab: ResultTab = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          title: `Lookup ${prev.length + 1}`,
          result: response,
        };

        setActiveTab(newTab.id);
        return [newTab, ...prev];
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <FluentProvider theme={webLightTheme}>

      {/* TITLE */}
      <div style={{
        padding: "10px",
        display: "flex",
        justifyContent: "center"
      }}>
        <Text size={500} weight="semibold">
          Match Intelligence Center
        </Text>
      </div>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
        <div
          style={{
            height: requestHeight,
            overflow: "auto",
          }}
        >
          <RequestPanel
            contactData={contactData}
            setContactData={setContactData}
            lookupPlan={lookupPlan}
            setLookupPlan={setLookupPlan}
            run={run}
            loading={loading}
            runMode={runMode}
            setRunMode={setRunMode}
          />
        </div>

        <div
          onMouseDown={startDrag}
          style={{
            height: 6,
            cursor: "row-resize",
            background: "#ddd",
          }}
        />

        {/* RESULTS */}
        <div style={{ flex: 1, overflow: "auto", background: "#f5f6f8" }}>
          <div className={styles.result}>
            <ResultPanel 
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* RESULTS
        <div style={{ flex: 1, overflow: "auto", background: "#f5f6f8" }}>
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
                      {run.result.runMode === "Single" ? (
                        <LookupResultGrid result={run.result.singleResult} />
                      ) : (
                        <DualLookupResultGrid result={run.result.dualResult} />
                      )}
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div> */}

      </div>

    </FluentProvider>
  );
}

{/* RESULTS
        <div style={{ flex: 1, overflow: "auto", background: "#f5f6f8" }}>
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

                    <LookupResultGrid result={run.result} />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div> */}