// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import React from "react";

import App from "./App.jsx";
import "./index.css";

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://56ad4d8b419908adbb636c6e82ca0ef3@o4509570787966976.ingest.de.sentry.io/4509570789212240",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

const rootElement = document.getElementById("root");

// createRoot(document.getElementById("root")).render(
// <StrictMode>
{
  /* <App /> */
}
{
  /* </StrictMode> */
}
// );

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
