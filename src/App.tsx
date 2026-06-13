import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import Sites from "@/pages/Sites";
import Incidents from "@/pages/Incidents";
import Remediation from "@/pages/Remediation";
import Security from "@/pages/Security";
import AgentObservatory from "@/pages/AgentObservatory";
import Analytics from "@/pages/Analytics";
import Executive from "@/pages/Executive";
import SettingsPage from "@/pages/Settings";
import DowntimePrevention from "@/pages/DowntimePrevention";
import RevenueProtection from "@/pages/RevenueProtection";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/remediation" element={<Remediation />} />
          <Route path="/security" element={<Security />} />
          <Route path="/agent-observatory" element={<AgentObservatory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/executive" element={<Executive />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/intelligence/downtime" element={<DowntimePrevention />} />
          <Route path="/intelligence/revenue" element={<RevenueProtection />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" richColors closeButton />
    </TooltipProvider>
  );
}
