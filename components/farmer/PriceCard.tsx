// components/farmer/PriceCard.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getDistanceInfo } from "@/lib/distance";
import type { District } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PriceCard({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const districtCap = (district.charAt(0).toUpperCase() + district.slice(1).toLowerCase()) as District;
  const { data, error } = useSWR(
    `/api/prices?crop=${crop}&district=${districtCap}&days=30`,
    fetcher
  );

  if (error) return <Card><CardContent className="py-6 text-red-500">Error loading price</CardContent></Card>;
  if (!data) return <Card><CardContent className="animate-pulse h-48" /></Card>;

  const { latest, changeVsYesterday, otherMandis } = data;
  const changeColor = changeVsYesterday > 0 ? "text-emerald-600" : changeVsYesterday < 0 ? "text-red-600" : "text-gray-600";

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
          <span>{districtCap} APMC • {crop.toUpperCase()}</span>
          <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Agmarknet Verified</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3 mb-1">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-950">
            {formatINR(latest?.pricePerQuintal ?? 0)}
          </div>
          <span className="text-xs text-muted-foreground font-medium">/quintal</span>
        </div>

        <div className={`text-sm font-semibold flex items-center gap-1 ${changeColor} mb-4`}>
          <span>{changeVsYesterday > 0 ? "▲ +" : changeVsYesterday < 0 ? "▼ " : "— "}</span>
          <span>{formatINR(Math.abs(changeVsYesterday))}</span>
          <span className="font-normal text-muted-foreground">{t("vsYesterday")}</span>
        </div>

        <div className="pt-3 border-t">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
            <span>Nearby Mandi Comparison</span>
            <span>Net Realization (after freight)</span>
          </div>
          <div className="space-y-1.5">
            {Object.entries((otherMandis || {}) as Record<string, { price: number; diff?: number }>).map(([m, info]) => {
              const distance = getDistanceInfo(districtCap, m as District, info.price);
              return (
                <div key={m} className="flex justify-between items-center text-xs sm:text-sm py-1 border-b last:border-0 border-muted/50">
                  <div>
                    <span className="font-medium text-foreground">{m}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">({distance.label})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-900">
                      {formatINR(distance.netRealizationPerQuintal ?? info.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      (Gross: {formatINR(info.price)})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
