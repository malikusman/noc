import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ddosTrafficSeries } from "@/data/securityThreats";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

export function TrafficSpikeChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={ddosTrafficSeries} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
        <defs>
          <linearGradient id="attackGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="time" tick={AXIS_TICK} interval={3} tickLine={false} axisLine={false} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}T` : `${v}G`)}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          formatter={(v: number, n: string) => [
            v >= 1000 ? `${(v / 1000).toFixed(2)} Tbps` : `${v} Gbps`,
            n,
          ]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="normal"
          name="Normal Traffic"
          stroke="#4f46e5"
          strokeWidth={2}
          fill="url(#normalGrad)"
        />
        <Area
          type="monotone"
          dataKey="attack"
          name="Attack Traffic"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#attackGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
