// app/[locale]/buyer/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDemands, getOpenLots } from "@/lib/data/store";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";

export default async function BuyerLanding({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const myDemands = getAllDemands().filter((d) => d.buyerId === "b1"); // Rajan Traders
  const openLots = getOpenLots();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              Buyer Portal
            </h1>
            <VerifiedBuyerBadge />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as <span className="font-semibold text-foreground">Rajan Agro Processors (Pune)</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/${locale}/buyer/demands/new`}>+ Post New Demand</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/buyer/lots`}>Browse Open Lots ({openLots.length})</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border shadow-sm hover:border-blue-400 transition-colors">
          <CardHeader>
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-2">
              📢
            </div>
            <CardTitle className="text-lg">Post Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Broadcast crop quality requirements, delivery window, and target price bands directly to farmers and FPOs.
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href={`/${locale}/buyer/demands/new`}>+ Create Demand</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:border-emerald-400 transition-colors">
          <CardHeader>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-2">
              🌾
            </div>
            <CardTitle className="text-lg">Browse Crop Lots</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore {openLots.length} available farm-gate lots and pooled FPO truckloads with distance freight estimates.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/buyer/lots`}>View Lots ({openLots.length})</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:border-purple-400 transition-colors">
          <CardHeader>
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-2">
              📋
            </div>
            <CardTitle className="text-lg">My Active Demands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your {myDemands.length} active demand specifications broadcast across Maharashtra APMC regions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/buyer/demands`}>View Demands ({myDemands.length})</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
