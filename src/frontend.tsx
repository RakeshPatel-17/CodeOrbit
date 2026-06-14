import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import App from "./App";
import "./index.css";

// 📊 Initialize PostHog (Product Analytics)
if (typeof window !== "undefined") {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY || (typeof process !== "undefined" && process.env ? process.env.VITE_POSTHOG_KEY : undefined);
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || (typeof process !== "undefined" && process.env ? process.env.VITE_POSTHOG_HOST : undefined) || "https://us.i.posthog.com";
  
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  }
}

// 🛡️ Initialize Sentry (Error & Crash Reporting)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN || (typeof process !== "undefined" && process.env ? process.env.VITE_SENTRY_DSN : undefined);
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
