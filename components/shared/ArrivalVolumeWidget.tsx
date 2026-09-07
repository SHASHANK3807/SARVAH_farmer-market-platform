// components/shared/ArrivalVolumeWidget.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function ArrivalVolumeWidget({ district }: { district: string }) {
  const t = useTranslations("farmer");
  const volumes: Record<string, number> = {
    Latur: 180, Pune: 220, Nashik: 145, Solapur: 165, Nagpur: 95,
  };
  const normalizedDistrict = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  const qty = volumes[normalizedDistrict] || 120;

  return (
    <Card className="bg-emerald-50/70 border-emerald-200">
      <CardContent className="py-3 px-4 flex items-center gap-3">
        <span className="text-xl">🚛</span>
        <p className="text-sm font-medium text-emerald-950">
          {t("arrivalsToday", { qty, district: normalizedDistrict })}
        </p>
      </CardContent>
    </Card>
  );
}
