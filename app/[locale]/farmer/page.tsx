// app/[locale]/farmer/page.tsx
"use client";
import { Suspense, useEffect } from "react";
import { useQueryState } from "nuqs";
import { CropDistrictSelector } from "@/components/farmer/CropDistrictSelector";
import { PriceCard } from "@/components/farmer/PriceCard";
import { TrendChart } from "@/components/farmer/TrendChart";
import { RecommendationCard } from "@/components/farmer/RecommendationCard";
import { ActiveBuyersCard } from "@/components/farmer/ActiveBuyersCard";
import { ArrivalVolumeWidget } from "@/components/shared/ArrivalVolumeWidget";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function FarmerDashboardContent() {
  const t = useTranslations("farmer");
  const locale = useLocale();
  const router = useRouter();
  const [crop] = useQueryState("crop", { defaultValue: "soybean" });

  const { data, isLoading } = useSWR<{ user: User | null }>("/api/auth/me", fetcher);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading...</div>;
  }

  useEffect(() => {
    if (!isLoading && (!data?.user || data.user.role !== "farmer")) {
      router.push(`/${locale}/login?role=farmer`);
    }
  }, [isLoading, data, locale, router]);

  if (!data?.user || data.user.role !== "farmer") {
    return null;
  }

  const user = data.user;
  const activeCrop = crop || "soybean";
  const activeDistrict = user.district.toLowerCase();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950">
              Welcome, {user.name}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              Farmer
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("tagline")}
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-sm font-semibold">
            <Link href={`/${locale}/farmer/lots/new?crop=${activeCrop}&district=${activeDistrict}`}>
              {t("createLotBtn")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/farmer/lots`}>
              {locale === "mr" ? "माझे लॉट्स" : "My Lots"}
            </Link>
          </Button>
        </div>
      </div>

      <CropDistrictSelector />

      <ArrivalVolumeWidget crop={activeCrop} district={activeDistrict} />

      <div className="grid gap-6 md:grid-cols-2">
        <PriceCard crop={activeCrop} district={activeDistrict} />
        <RecommendationCard crop={activeCrop} district={activeDistrict} />
      </div>

      <TrendChart crop={activeCrop} district={activeDistrict} />

      <ActiveBuyersCard crop={activeCrop} district={activeDistrict} />
    </div>
  );
}

import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function FarmerDashboard() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Loading Farmer Dashboard…</div>}>
      <ErrorBoundary>
        <FarmerDashboardContent />
      </ErrorBoundary>
    </Suspense>
  );
}
