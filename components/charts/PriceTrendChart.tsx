// components/charts/PriceTrendChart.tsx
"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatINR } from "@/lib/utils";

export interface PricePoint {
  date: string;
  pricePerQuintal: number;
  [key: string]: unknown;
}

export function PriceTrendChart({ data }: { data: PricePoint[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        No trend data available
      </div>
    );
  }

  // Format date for X axis
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dateLabel" fontSize={11} stroke="#64748b" tickLine={false} />
          <YAxis
            tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
            fontSize={11}
            stroke="#64748b"
            tickLine={false}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            formatter={(value: unknown) => [formatINR(Number(value)), "Mandi Rate"]}
            labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
            contentStyle={{ borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Line
            type="monotone"
            dataKey="pricePerQuintal"
            stroke="#059669"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, fill: "#059669" }}
            name="Mandi Price (₹/q)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
