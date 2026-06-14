import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const activityData = [
  { name: "Mon", users: 400, requests: 2400 },
  { name: "Tue", users: 300, requests: 1398 },
  { name: "Wed", users: 200, requests: 9800 },
  { name: "Thu", users: 278, requests: 3908 },
  { name: "Fri", users: 189, requests: 4800 },
  { name: "Sat", users: 239, requests: 3800 },
  { name: "Sun", users: 349, requests: 4300 },
];

const databaseData = [
  { name: "Workspace A", storageMB: 120, queries: 4000 },
  { name: "Workspace B", storageMB: 240, queries: 3000 },
  { name: "Workspace C", storageMB: 80, queries: 2000 },
  { name: "Workspace D", storageMB: 310, queries: 2780 },
];

export function AnalysisDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      {/* Metric Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        <MetricCard title="Total Cache Invocations" value="12,482" subtitle="Upstash Redis Cache" trend="+12.4% vs last week" trendColor="#16a34a" />
        <MetricCard title="Cache Hit Rate" value="94.2%" subtitle="Redis Serverless" trend="High Efficiency" trendColor="#16a34a" />
        <MetricCard title="Elysia API Latency" value="14ms" subtitle="Serverless Function Edge" trend="Optimal" trendColor="#16a34a" />
        <MetricCard title="Neon Active Connections" value="8" subtitle="Pooler Active" trend="Healthy" trendColor="#16a34a" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Workspace Traffic (Area Chart) */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#0f172a" }}>Workspace Traffic & Activity</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Database Metrics (Bar Chart) */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#0f172a" }}>Tenant Database Allocations</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={databaseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="storageMB" name="Storage (MB)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="queries" name="Queries" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendColor: string;
}

function MetricCard({ title, value, subtitle, trend, trendColor }: MetricCardProps) {
  return (
    <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</span>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0.5rem 0 0.25rem 0", letterSpacing: "-0.03em" }}>{value}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
        <span>{subtitle}</span>
        <span style={{ fontWeight: 600, color: trendColor }}>{trend}</span>
      </div>
    </div>
  );
}
