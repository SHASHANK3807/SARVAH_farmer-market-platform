// components/farmer/TrendChart.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TrendChart({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  const { data, error } = useSWR(
    `/api/prices?crop=${crop}&district=${districtCap}&days=30`,
    fetcher
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex justify-between items-center">
          <span>{t("trendChart")} — {crop.toUpperCase()} ({districtCap})</span>
          <span className="text-xs font-normal text-muted-foreground">Last 30 Days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-red-500 py-6">Failed to load price trend.</p>
        ) : !data ? (
          <div className="h-[280px] animate-pulse bg-muted/40 rounded-lg" />
        ) : (
          <PriceTrendChart data={data.history} />
        )}
      </CardContent>
    </Card>
  );
}
