import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import App from "./App";
import "./index.css";

// Safe cross-runtime environment variable helper
const getEnv = (key: string): string | undefined => {
  // 1. Try process.env first (inlined by Bun build --env=inline)
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key] !== undefined) return process.env[key];
  }
  
  // 2. Try import.meta.env safely using a dynamic key lookup
  try {
    const metaEnv = (import.meta as any)["env"];
    if (metaEnv && metaEnv[key] !== undefined) {
      return metaEnv[key];
    }
  } catch (e) {
    // import.meta is not accessible
  }
  
  return undefined;
};

// 📊 Initialize PostHog (Product Analytics)
if (typeof window !== "undefined") {
  const posthogKey = getEnv("VITE_POSTHOG_KEY");
  const posthogHost = getEnv("VITE_POSTHOG_HOST") || "https://us.i.posthog.com";
  
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  }
}

// 🛡️ Initialize Sentry (Error & Crash Reporting)
const sentryDsn = getEnv("VITE_SENTRY_DSN");
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// Safe publishable key extraction with fallback
const getPublishableKey = () => {
  return (
    getEnv("VITE_CLERK_PUBLISHABLE_KEY") ||
    getEnv("BUN_PUBLIC_CLERK_PUBLISHABLE_KEY") ||
    "pk_test_ZWFnZXIta29kaWFrLTY0LmNsZXJrLmFjY291bnRzLmRldiQ"
  );
};

const PUBLISHABLE_KEY = getPublishableKey();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
