import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

// Generates 24h signal + power series for a site detail drawer.
function buildSeries(seed: number, healthy: boolean) {
  const out: { hour: string; signal: number; power: number }[] = [];
  for (let h = 0; h < 24; h++) {
    const dip = !healthy && h >= 16 ? 22 : 0;
    out.push({
      hour: `${h.toString().padStart(2, "0")}h`,
      signal: Math.round(-72 + Math.sin((h + seed) / 3) * 4 - dip / 3),
      power: Math.round((healthy ? 53.5 : 52) + Math.cos((h + seed) / 4) * 0.6 - (dip ? 2.4 : 0)),
    });
  }
  return out;
}

export function SiteSignalChart({ seed = 1, healthy = true }: { seed?: number; healthy?: boolean }) {
  const data = buildSeries(seed, healthy);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="hour" tick={AXIS_TICK} interval={5} tickLine={false} axisLine={false} />
        <YAxis yAxisId="l" tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <YAxis yAxisId="r" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line yAxisId="l" type="monotone" dataKey="signal" name="Signal (dBm)" stroke="#4f46e5" strokeWidth={2} dot={false} />
        <Line yAxisId="r" type="monotone" dataKey="power" name="Power (V)" stroke="#10b981" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
