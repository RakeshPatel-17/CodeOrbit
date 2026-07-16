import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import Donations from "./pages/Donations";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-blue-700 tracking-tight">TDMS</h1>
          <p className="text-xs text-slate-500">BAPS Nadiad</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/" className="px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium transition-colors">Dashboard</Link>
          <Link to="/donors" className="px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium transition-colors">Donors</Link>
          <Link to="/donations" className="px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium transition-colors">Donations</Link>
        </nav>
        <div className="p-4 border-t border-slate-200 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium text-slate-600">My Account</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public / Auth */}
          <Route path="/sign-in/*" element={<div className="min-h-screen flex items-center justify-center bg-slate-50"><SignIn routing="path" path="/sign-in" /></div>} />
          
          {/* Protected Routes */}
          <Route path="/*" element={
            <>
              <SignedIn>
                <ProtectedLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/donors" element={<Donors />} />
                    <Route path="/donations" element={<Donations />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ProtectedLayout>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } />
        </Routes>
        <Toaster />
      </ToastProvider>
    </BrowserRouter>
  );
}
