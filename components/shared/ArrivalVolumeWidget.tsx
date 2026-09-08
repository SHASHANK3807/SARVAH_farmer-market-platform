// components/shared/ArrivalVolumeWidget.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ArrivalVolumeWidget({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  const { data } = useSWR(`/api/arrivals?crop=${crop}&district=${districtCap}`, fetcher);

  if (!data) return <Card><CardContent className="h-16 animate-pulse" /></Card>;

  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <CardContent className="pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🚛</span>
          <span className="font-bold text-emerald-900">{data.volumeTons.toLocaleString("en-IN")} tons</span>
          <span className="text-muted-foreground">arrived at {districtCap} today</span>
        </div>
        <p className="text-xs text-emerald-700 mt-1">
          {t("arrivalsToday", { qty: data.volumeTons, district: districtCap })}
        </p>
      </CardContent>
    </Card>
  );
}
