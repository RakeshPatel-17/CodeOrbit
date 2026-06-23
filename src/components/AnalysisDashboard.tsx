import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const occupancyData = [
  { name: "Mon", entry: 840, exit: 810 },
  { name: "Tue", entry: 920, exit: 890 },
  { name: "Wed", entry: 870, exit: 865 },
  { name: "Thu", entry: 1100, exit: 1050 },
  { name: "Fri", entry: 1250, exit: 1300 },
  { name: "Sat", entry: 950, exit: 980 },
  { name: "Sun", entry: 720, exit: 750 },
];

const maintenanceData = [
  { name: "The Grand", open: 12, resolved: 45 },
  { name: "Vista Towers", open: 8, resolved: 32 },
  { name: "Parkside", open: 15, resolved: 60 },
  { name: "Oasis Lofts", open: 3, resolved: 21 },
];

export function AnalysisDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      {/* Metric Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        <MetricCard title="Average Stay Time" value="14.2 hrs" subtitle="Based on Gate Logs" trend="+2.4% vs last week" trendColor="#16a34a" />
        <MetricCard title="Maintenance Resolution" value="94.2%" subtitle="SLA Compliance" trend="High Efficiency" trendColor="#16a34a" />
        <MetricCard title="Resident Satisfaction" value="4.8/5" subtitle="Recent Surveys" trend="Optimal" trendColor="#16a34a" />
        <MetricCard title="Vacant Units" value="26" subtitle="Across Portfolio" trend="-2 this week" trendColor="#16a34a" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        {/* Occupancy Traffic (Area Chart) */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#0f172a" }}>Weekly Gate Access Traffic</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={occupancyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEntry" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="entry" name="Gate Entries" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEntry)" />
                <Area type="monotone" dataKey="exit" name="Gate Exits" stroke="#10b981" fillOpacity={1} fill="url(#colorExit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Metrics (Bar Chart) */}
        <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.5rem", color: "#0f172a" }}>Maintenance by Property</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="open" name="Open Requests" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#6366f1" radius={[4, 4, 0, 0]} />
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
