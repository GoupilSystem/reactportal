import { useEffect, useState } from "react";
import {
  FluentProvider,
  webLightTheme,
  Text,
  makeStyles
} from "@fluentui/react-components";

import { runLookup } from "./api/lookupApi";
import { RequestPanel } from "./components/RequestPanel";
import { defaultDataInput, defaultLookupPlan } from "./defaults/DefaultData";
import type { DataInput, RunMode } from "./types/LookupRequestTypes";
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

  const [dataInput, setDataInput] = useState<DataInput[]>(defaultDataInput);
  const [lookupPlan, setLookupPlan] = useState(defaultLookupPlan);

  const [reviewThreshold, setReviewThreshold] = useState(50);
  const [autoMatchThreshold, setAutoMatchThreshold] = useState(80);

  const [tabs, setTabs] = useState<ResultTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [requestHeight, setRequestHeight] = useState(300);
  const [runMode, setRunMode] = useState<RunMode>("NewLookup");

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

  async function run(mode: RunMode) {
    try {
      setLoading(true);

      const payload = {
        dataInput,
        lookupPlan: {
          ...lookupPlan,
          reviewThreshold,
          autoMatchThreshold,
          searchSteps: lookupPlan.searchSteps.map(({ id, ...s }) => s),
        },
        runMode: mode,
      };

      console.log("Lookup payload:\n", JSON.stringify(payload, null, 2));

      const response = await runLookup(payload);

      console.log("Lookup response:\n", JSON.stringify(response, null, 2));
      
      setTabs(prev => {
        const id = crypto.randomUUID();

        const newTab: ResultTab = {
          id,
          timestamp: new Date().toISOString(),
          title: `Lookup ${prev.length + 1}`,
          result: response
        };

        setActiveTab(id);

        return [newTab, ...prev];
      });

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      console.log("LookupPlan received in App:", lookupPlan);}, [lookupPlan]);

  return (
    <FluentProvider theme={webLightTheme}>

      {/* TITLE */}
      <div style={{
        padding: 5,
        paddingTop: 10,
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
            dataInput={dataInput}
            setDataInput={setDataInput}
            lookupPlan={lookupPlan}
            setLookupPlan={setLookupPlan}
            run={run}
            loading={loading}
            runMode={runMode}
            setRunMode={setRunMode}
            reviewThreshold={reviewThreshold}
            setReviewThreshold={setReviewThreshold}
            autoMatchThreshold={autoMatchThreshold}
            setAutoMatchThreshold={setAutoMatchThreshold}
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
              dataInput={dataInput}
              scoreRules={lookupPlan.scoreRules}
              reviewThreshold={lookupPlan.reviewThreshold}
              autoMatchThreshold={lookupPlan.autoMatchThreshold}
            />
          </div>
        </div>

      </div>

    </FluentProvider>
  );
}