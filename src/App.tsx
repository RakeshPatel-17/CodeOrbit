import React from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { AnalysisDashboard } from "./components/AnalysisDashboard";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      {/* Protected Enterprise Workspace */}
      <SignedIn>
        <DashboardLayout />
      </SignedIn>

      {/* Public Authentication Gate */}
      <SignedOut>
        <div className="auth-container">
          <div className="auth-wrapper">
            {/* Left Side: Product Showcase (Hidden on Mobile) */}
            <div className="auth-left" style={{ color: "#ffffff" }}>
              <span style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "#60a5fa", letterSpacing: "0.15em", marginBottom: "1rem", display: "block" }}>Enterprise SaaS Stack</span>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: "2rem" }}>
                A secure environment for isolated cloud pipelines.
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <FeatureItem title="Multi-Tenant Routing" desc="Completely isolated workspaces using row-level tenancy schemas." />
                <FeatureItem title="Serverless Data Cache" desc="In-memory Redis query caching for ultra-low latencies." />
                <FeatureItem title="E2E Pipeline Testing" desc="Automatic pre-commit verification and Playwright integration tests." />
              </div>
            </div>

            {/* Right Side: Auth Glassmorphic Panel */}
            <div className="auth-right">
              <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "3rem 2.5rem", borderRadius: "16px", textAlign: "center", maxWidth: "420px", width: "100%", boxSizing: "border-box", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3)" }}>
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "inline-flex", padding: "0.75rem", background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)", borderRadius: "12px", marginBottom: "1.25rem", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)" }}>
                    <span style={{ fontSize: "1.5rem", color: "#ffffff", fontWeight: "bold" }}>CO</span>
                  </div>
                  <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>CodeOrbit Console</h1>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: "1.5" }}>Access your secure, isolated multi-tenant developer workspace.</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SignInButton mode="modal">
                    <button style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#ffffff", border: "none", padding: "0.875rem 1.5rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", width: "100%", boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)", transition: "background 0.2s" }}>
                      Sign In to Workspace
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button style={{ background: "transparent", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "0.875rem 1.5rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", width: "100%", transition: "background 0.2s" }}>
                      Create Developer Account
                    </button>
                  </SignUpButton>
                </div>

                <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Powered by Bun, ElysiaJS, and Neon Postgres</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

function DashboardLayout() {
  const { user } = useUser();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* High-Density Sidebar */}
      <aside style={{ width: "260px", background: "#0f172a", color: "#94a3b8", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b" }}>
        <div style={{ padding: "1.25rem", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}>CodeOrbit Console</span>
        </div>
        <nav style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", background: "#1e293b", color: "#ffffff", fontWeight: 500, cursor: "pointer", fontSize: "0.875rem" }}>Dashboard Overview</div>
          <div style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem" }}>System Logistics</div>
          <div style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem" }}>Database Metrics</div>
          <div style={{ padding: "0.5rem 0.75rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem" }}>Access Control</div>
        </nav>
        <div style={{ padding: "1rem", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <UserButton afterSignOutUrl="/" />
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: 500, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user?.fullName || "Developer"}</span>
            <span style={{ fontSize: "0.75rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
      </aside>

      {/* Master Workspace Content Arena */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <header style={{ height: "60px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>System Control Center</h2>
        </header>
        <div style={{ padding: "2rem", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <Card title="Active Cluster" value="AWS US East 1" status="Operational" statusColor="#16a34a" />
            <Card title="Database Status" value="Connected" status="Synchronized (Dev Branch)" statusColor="#16a34a" />
            <Card title="Tenant Routing" value="Isolated Pipeline" status="Active" statusColor="#16a34a" />
          </div>

          {/* Dynamic Data Analysis Dashboard */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-0.02em" }}>Workspace Analysis & Logistics</h3>
            <AnalysisDashboard />
          </div>

          <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>Workspace Architecture Overview</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: "1.5" }}>
              Welcome to CodeOrbit. Your developer execution container is fully structured with Bun and synchronized directly to your environment branches.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value, status, statusColor }: { title: string, value: string, status: string, statusColor: string }) {
  return (
    <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
      <span style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "#64748b", letterSpacing: "0.05em" }}>{title}</span>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.5rem 0 0.25rem 0", letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", fontWeight: 500, color: statusColor }}>{status}</div>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div style={{ background: "rgba(96, 165, 250, 0.1)", color: "#60a5fa", padding: "0.25rem 0.5rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.875rem" }}>✓</div>
      <div style={{ textAlign: "left" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#ffffff", margin: "0 0 0.25rem 0" }}>{title}</h4>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  );
}

