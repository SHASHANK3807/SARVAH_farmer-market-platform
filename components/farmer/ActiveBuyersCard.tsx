// components/farmer/ActiveBuyersCard.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import { formatINR } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { DemandPost, Buyer } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ActiveBuyersCard({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const tBadges = useTranslations("badges");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();

  // Fetch demands and buyers in parallel
  const { data: demands, error: demandsErr } = useSWR(
    `/api/demand?crop=${crop}&district=${districtCap}`,
    fetcher
  );
  const { data: buyers } = useSWR("/api/buyers", fetcher);

  if (demandsErr || !demands) {
    return <Card><CardContent className="h-40 animate-pulse" /></Card>;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold text-foreground">
            {t("activeBuyers")}
          </CardTitle>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            {demands.length} active matching
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {demands.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{t("noBuyers")}</p>
        ) : (
          <div className="space-y-3">
            {demands.map((d: DemandPost) => {
              const buyer = (buyers as Buyer[] | undefined)?.find((b: Buyer) => b.id === d.buyerId);
              return (
                <div
                  key={d.id}
                  className="border rounded-lg p-3 hover:border-emerald-400 transition-colors bg-card/60"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {buyer?.name || "Verified Trader"}
                        {buyer?.verified && <VerifiedBuyerBadge />}
                        {buyer?.fpo && (
                          <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                            {tBadges("fpo")}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {buyer?.organization} • {d.qtyTons} MT required • Grade {d.grade}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-900">
                        {formatINR(d.priceMinPerQuintal)} – {formatINR(d.priceMaxPerQuintal)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">per quintal</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
