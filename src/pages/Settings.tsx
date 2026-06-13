import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Plug } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";

const channels = ["Email", "SMS", "Slack", "PagerDuty", "ServiceNow"];

const integrations = [
  { name: "Huawei OSS", status: "Connected" },
  { name: "Nokia NetAct", status: "Connected" },
  { name: "Ericsson OSS", status: "Connected" },
  { name: "ServiceNow", status: "Connected" },
  { name: "Jira", status: "Connected" },
  { name: "PagerDuty", status: "Connected" },
];

const team = [
  { name: "Ahmed Al-Rashid", role: "NOC Lead", shift: "Day", prefs: "Email · PagerDuty" },
  { name: "Fatima Al-Sayed", role: "NOC Engineer", shift: "Day", prefs: "Slack · SMS" },
  { name: "Omar Khan", role: "NOC Engineer", shift: "Night", prefs: "PagerDuty" },
  { name: "Layla Hassan", role: "Security Analyst", shift: "Day", prefs: "Email · Slack" },
  { name: "Yusuf Mansour", role: "Transport Lead", shift: "Night", prefs: "Email" },
];

export default function Settings() {
  const [confidence, setConfidence] = useState(85);
  const [alertThreshold, setAlertThreshold] = useState(60);
  const [channelOn, setChannelOn] = useState<Record<string, boolean>>({
    Email: true,
    SMS: true,
    Slack: true,
    PagerDuty: true,
    ServiceNow: false,
  });
  const [policy, setPolicy] = useState({
    autoLowRisk: true,
    autoRestart: true,
    approveDispatch: true,
    approveConfig: true,
  });

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Settings" subtitle="Configure alerting, autonomous-action policy, agent trust, and integrations. (Non-persistent demo state.)" />

      {/* Alert thresholds */}
      <Card>
        <CardHeader><CardTitle>Alert Thresholds</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Minimum severity score to alert</Label>
              <span className="text-sm font-medium text-indigo-600">{alertThreshold}</span>
            </div>
            <Slider value={[alertThreshold]} onValueChange={(v) => setAlertThreshold(v[0])} max={100} step={1} />
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <Label className="text-xs uppercase tracking-wide text-slate-400">Notification Channels</Label>
            {channels.map((c) => (
              <div key={c} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{c}</span>
                <Switch checked={channelOn[c]} onCheckedChange={(v) => setChannelOn((s) => ({ ...s, [c]: v }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Autonomous policy */}
      <Card>
        <CardHeader><CardTitle>Autonomous Actions Policy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <PolicyToggle label="Allow Auto-Execute for Low-Risk Actions (Confidence ≥ 95%)" checked={policy.autoLowRisk} onChange={(v) => setPolicy((p) => ({ ...p, autoLowRisk: v }))} />
          <PolicyToggle label="Allow Auto-Restart (Config drift, link flaps)" checked={policy.autoRestart} onChange={(v) => setPolicy((p) => ({ ...p, autoRestart: v }))} />
          <PolicyToggle label="Require Human Approval for Field Dispatch" checked={policy.approveDispatch} onChange={(v) => setPolicy((p) => ({ ...p, approveDispatch: v }))} />
          <PolicyToggle label="Require Human Approval for Config Changes" checked={policy.approveConfig} onChange={(v) => setPolicy((p) => ({ ...p, approveConfig: v }))} />
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <Label>Approval Timeout</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="rounded-lg bg-violet-50 px-3 py-2 text-xs italic text-violet-700">
            Scorpius operates as a restricted agent system. These settings define the boundary between autonomous and human-led actions.
          </p>
        </CardContent>
      </Card>

      {/* Agent trust */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-violet-600" /> Agent Trust Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <Label>Confidence threshold for autonomous action</Label>
            <span className="text-sm font-medium text-indigo-600">{confidence}%</span>
          </div>
          <Slider value={[confidence]} onValueChange={(v) => setConfidence(v[0])} max={100} step={1} />
          <p className="mt-2 text-xs text-slate-500">
            Below {confidence}% confidence, human approval is always required before any action is taken.
          </p>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Plug className="h-4 w-4 text-indigo-600" /> Integrations</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{i.name}</p>
                <StatusBadge status="Resolved" className="mt-1 scale-90" />
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success(`${i.name} — connection OK`, { description: "Test connection succeeded." })}>
                Test Connection
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader><CardTitle>Team</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2">Name</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Shift</th>
                <th className="px-3 py-2">Notifications</th>
              </tr>
            </thead>
            <tbody>
              {team.map((t) => (
                <tr key={t.name} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-2.5 font-medium text-slate-700">{t.name}</td>
                  <td className="px-3 py-2.5 text-slate-600">{t.role}</td>
                  <td className="px-3 py-2.5"><Badge variant={t.shift === "Night" ? "secondary" : "info"} className="scale-90">{t.shift}</Badge></td>
                  <td className="px-3 py-2.5 text-slate-500">{t.prefs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* System info */}
      <Card>
        <CardHeader><CardTitle>System Info</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-2 text-sm sm:grid-cols-4">
          <Info label="Version" value="Scorpius 4.2.1" />
          <Info label="Environment" value="Demo / Sandbox" />
          <Info label="Sites Monitored" value="847" />
          <Info label="Agent Framework" value="Scorpius A2A 2.0" />
        </CardContent>
      </Card>
    </div>
  );
}

function PolicyToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-700">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}
