import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot for React 18
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import Store from "./redux/store";

// Create the root element using createRoot for React 18
const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);

reportWebVitals();
