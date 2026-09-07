// components/farmer/RecommendationCard.tsx
"use client";
import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations, useLocale } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ACTION_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  SELL_NOW: {
    bg: "bg-emerald-50/80",
    border: "border-emerald-300",
    text: "text-emerald-950",
    badge: "bg-emerald-600 text-white",
  },
  WAIT_3_DAYS: {
    bg: "bg-amber-50/80",
    border: "border-amber-300",
    text: "text-amber-950",
    badge: "bg-amber-500 text-white",
  },
  WAIT_2_WEEKS: {
    bg: "bg-blue-50/80",
    border: "border-blue-300",
    text: "text-blue-950",
    badge: "bg-blue-600 text-white",
  },
  HOLD: {
    bg: "bg-slate-50",
    border: "border-slate-300",
    text: "text-slate-900",
    badge: "bg-slate-600 text-white",
  },
};

export function RecommendationCard({ crop, district }: { crop: string; district: string }) {
  const tRec = useTranslations("recommendation");
  const locale = useLocale();
  const [hasStorage, setHasStorage] = useState(true);

  const districtCap = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  const { data, error } = useSWR(
    `/api/recommend?crop=${crop}&district=${districtCap}&hasStorage=${hasStorage}`,
    fetcher
  );

  if (error || !data) {
    return <Card><CardContent className="h-48 animate-pulse" /></Card>;
  }

  const style = ACTION_STYLES[data.action] || ACTION_STYLES.HOLD;
  const reasoningList = (locale === "mr" && data.reasoningMr?.length > 0)
    ? data.reasoningMr
    : data.reasoning || [];

  return (
    <Card className={`${style.bg} ${style.border} border shadow-sm flex flex-col justify-between`}>
      <div>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {tRec("reasoningHeading")} (Decision Intelligence)
          </CardTitle>
          <Badge className={`${style.badge} font-bold tracking-wide text-xs px-2.5 py-0.5`}>
            {Math.round(data.confidence * 100)}% {tRec("confidence")}
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-2xl sm:text-3xl font-black ${style.text}`}>
              {tRec(data.action)}
            </span>
            {data.percentile !== undefined && (
              <span className="text-xs bg-white/80 px-2 py-1 rounded border border-muted font-medium text-muted-foreground">
                Top {100 - data.percentile}% percentile
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
            {reasoningList.map((r: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold mt-0.5">•</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      <div className="px-6 pb-4 pt-2 border-t border-black/5 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
          <input
            type="checkbox"
            checked={hasStorage}
            onChange={(e) => setHasStorage(e.target.checked)}
            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
          />
          <span>{locale === "mr" ? "साठवणूक / गोदाम उपलब्ध आहे" : "I have on-farm storage / warehouse"}</span>
        </label>
        <span className="text-[11px] text-muted-foreground">
          {!hasStorage ? "⚠️ Distress prevention active" : "Standard holding advice"}
        </span>
      </div>
    </Card>
  );
}
