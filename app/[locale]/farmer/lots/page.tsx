// app/[locale]/farmer/lots/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLotsByFarmer } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { LotBadge } from "@/components/lot/LotBadge";
import type { Grade } from "@/lib/types";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

async function FarmerLotsPageContent({ locale, farmerId }: { locale: string, farmerId: string }) {
  const lots = getLotsByFarmer(farmerId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Created Lots</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your open lots and view their status.
          </p>
        </div>
        <Link
          href={`/${locale}/farmer/lots/new`}
          className="inline-flex items-center text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          + Create Lot
        </Link>
      </div>

      {lots.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <span className="text-4xl mb-2 block">🌾</span>
          <p className="font-semibold text-foreground">You haven&apos;t created any lots yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Click the button above to post your first lot.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lots.map((lot) => (
            <Link key={lot.id} href={`/${locale}/lots/${lot.id}`} className="group">
              <Card className="h-full hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="capitalize text-lg font-bold group-hover:text-emerald-700 transition-colors">
                          {lot.crop} • {lot.qtyTons} Tons
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lot.status === "open" ? "🟢 Open" : "🔴 Closed"}
                        </p>
                      </div>
                      <LotBadge grade={lot.grade as Grade} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-black text-emerald-950">
                        {formatINR(lot.askingPricePerQuintal)}
                      </span>
                      <span className="text-xs text-muted-foreground">/quintal</span>
                    </div>

                    {lot.isFpoPool && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
                        🤝 FPO Pool
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="px-6 py-3 border-t bg-muted/20 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Posted {lot.createdAt}</span>
                  <span className="font-semibold text-emerald-700 group-hover:underline">
                    View Details →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function FarmerLotsPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const session = await getSession();
  
  if (!session || session.user.role !== "farmer") {
    redirect(`/${locale}/login?role=farmer`);
  }

  return (
    <ErrorBoundary>
      <FarmerLotsPageContent locale={locale} farmerId={session.user.id} />
    </ErrorBoundary>
  );
}
