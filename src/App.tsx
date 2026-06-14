import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      {/* Protected Enterprise Workspace */}
      <SignedIn>
        <DashboardLayout />
      </SignedIn>

      {/* Public Authentication Gate */}
      <SignedOut>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div style={{ background: "#ffffff", padding: "2.5rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", textAlign: "center", maxWidth: "400px", width: "100%" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.05em", marginBottom: "0.5rem" }}>CodeOrbit Hub</h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "2rem" }}>Please sign in to access your multi-tenant environment workspace.</p>
            <SignInButton mode="modal">
              <button style={{ background: "#2563eb", color: "#ffffff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", width: "100%", transition: "background 0.2s" }}>
                Sign In to Workspace
              </button>
            </SignInButton>
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

