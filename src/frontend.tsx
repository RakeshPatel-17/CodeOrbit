import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Safe cross-runtime environment extraction with hardcoded local fallback
const getPublishableKey = () => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    if (import.meta.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return import.meta.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY;
    }
    if (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
      return import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    }
  }
  if (typeof process !== "undefined" && process.env) {
    if (process.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      return process.env.BUN_PUBLIC_CLERK_PUBLISHABLE_KEY;
    }
    if (process.env.VITE_CLERK_PUBLISHABLE_KEY) {
      return process.env.VITE_CLERK_PUBLISHABLE_KEY;
    }
  }
  
  // Local development hardcoded fallback asset
  return "pk_test_ZWFnZXIta29kaWFrLTY0LmNsZXJrLmFjY291bnRzLmRldiQ";
};

const PUBLISHABLE_KEY = getPublishableKey();

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing valid Clerk Publishable Key string in frontend entry point. Please set BUN_PUBLIC_CLERK_PUBLISHABLE_KEY or VITE_CLERK_PUBLISHABLE_KEY in your environment.");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
