import ReactDOM from "react-dom/client";
import App from "./App";

import { FluentProvider, webLightTheme } from "@fluentui/react-components";

import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>
);