import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Safe cross-runtime environment extraction with hardcoded local fallback
const getPublishableKey = () => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  }
  if (typeof process !== "undefined" && process.env && process.env.VITE_CLERK_PUBLISHABLE_KEY) {
    return process.env.VITE_CLERK_PUBLISHABLE_KEY;
  }
  
  // Local development hardcoded fallback asset
  return "pk_test_your_actual_clerk_key_here";
};

const PUBLISHABLE_KEY = getPublishableKey();

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY.includes("pk_test_ZWFnZXIta29kaWFrLTY0LmNsZXJrLmFjY291bnRzLmRldiQ")) {
  throw new Error("Missing valid Clerk Publishable Key string in frontend entry point.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
