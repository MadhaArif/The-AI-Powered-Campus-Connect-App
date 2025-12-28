import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Polyfill global for simple-peer
import { Buffer } from 'buffer';
window.global = window;
window.process = window.process || { env: {} };
window.Buffer = window.Buffer || Buffer;

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </AppContextProvider>
);
