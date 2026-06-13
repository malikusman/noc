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
import { networkHealthTrend } from "@/data/analytics";
import { GRID_STROKE, AXIS_TICK, tooltipStyle, tooltipLabelStyle } from "./chartTheme";

export function NetworkHealthChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={networkHealthTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
        <XAxis dataKey="day" tick={AXIS_TICK} interval={4} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="left"
          domain={[96, 100]}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          unit="%"
          width={44}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          unit="m"
          width={40}
        />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="availability"
          name="Availability %"
          stroke="#4f46e5"
          strokeWidth={2}
          fill="url(#availGrad)"
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="mttr"
          name="MTTR (min)"
          stroke="#f59e0b"
          strokeWidth={2}
          fillOpacity={0}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
