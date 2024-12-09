import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClientProvider } from "react-query";
import queryClient from "./services/queryClient.ts";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <QueryClientProvider client={queryClient}>
    {/* <StrictMode> */}
      <App />
    {/* </StrictMode> */}
  </QueryClientProvider>
);
