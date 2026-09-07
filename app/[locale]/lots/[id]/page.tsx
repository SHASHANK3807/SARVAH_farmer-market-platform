// app/[locale]/lots/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLot, getOffersForLot } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { getDistanceInfo } from "@/lib/distance";
import { seedBuyers } from "@/lib/data/seed-loader";
import { LotBadge } from "@/components/lot/LotBadge";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import Link from "next/link";
import type { Grade, District } from "@/lib/types";

export default async function LotDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }> | { locale: string; id: string };
}) {
  const { locale, id } = await Promise.resolve(params);
  const lot = getLot(id);
  if (!lot) notFound();

  const offers = getOffersForLot(lot.id);
  const distance = getDistanceInfo(lot.district as District, "Pune", lot.askingPricePerQuintal);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href={`/${locale}/lots`} className="text-sm font-semibold text-emerald-700 hover:underline">
          ← Back to all lots
        </Link>
        <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded ${lot.status === "open" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
          Status: {lot.status}
        </span>
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="capitalize text-2xl font-black text-emerald-950">
                  {lot.crop} ({lot.qtyTons} Metric Tons)
                </CardTitle>
                <LotBadge grade={lot.grade as Grade} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Farmer: <span className="font-semibold text-foreground">{lot.farmerName}</span> • District: <span className="font-semibold text-foreground">{lot.district}</span> • Posted: {lot.createdAt}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-emerald-900">
                {formatINR(lot.askingPricePerQuintal)}
              </div>
              <span className="text-xs text-muted-foreground">asking price / quintal</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {lot.isFpoPool && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-blue-900">🤝 FPO Aggregated Pool</span>
                <p className="text-xs text-blue-800">
                  Managed by {lot.fpoName || "Latur Kisan FPO"} — Pooled volume for direct processor sourcing.
                </p>
              </div>
              <span className="text-xs font-bold bg-blue-200 text-blue-900 px-2 py-1 rounded">
                +₹150/q Premium
              </span>
            </div>
          )}

          {lot.qualityNotes && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Quality Specifications</h3>
              <p className="text-sm bg-muted/30 p-3 rounded-lg border">{lot.qualityNotes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Transport & Distance (to Pune APMC)</h3>
              <p className="text-sm font-semibold">{distance.label}</p>
              <p className="text-xs text-muted-foreground">Est. freight: ₹{distance.estimatedTransportCostPerQuintal}/quintal</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Expected Realization</h3>
              <p className="text-sm font-bold text-emerald-900">
                {formatINR(lot.askingPricePerQuintal * lot.qtyTons * 10)}
              </p>
              <p className="text-xs text-muted-foreground">Across {lot.qtyTons * 10} quintals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">Received Digital Offers ({offers.length})</CardTitle>
            {lot.status === "open" && (
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href={`/${locale}/buyer/lots`}>Place Offer as Buyer</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {offers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No offers received yet. Buyers browsing the marketplace can bid on this lot.
            </p>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => {
                const buyer = seedBuyers.find((b) => b.id === offer.buyerId);
                return (
                  <div key={offer.id} className="border rounded-xl p-4 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-base">
                        <span>{buyer?.name || "Buyer"}</span>
                        {buyer?.verified && <VerifiedBuyerBadge />}
                        <span className="text-xs text-muted-foreground font-normal">({buyer?.organization})</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Offer: <span className="font-bold text-foreground">{formatINR(offer.pricePerQuintal)}/q</span> for {offer.qtyTons} tons • Submitted {offer.createdAt}
                      </p>
                      {offer.message && (
                        <p className="text-xs italic text-muted-foreground mt-1">
                          &quot;{offer.message}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {offer.status === "accepted" ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full">
                          ✓ Offer Accepted
                        </span>
                      ) : lot.status === "open" ? (
                        <form action={`/api/offers/${offer.id}/accept`} method="POST">
                          <input type="hidden" name="locale" value={locale} />
                          <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                            Accept Offer
                          </Button>
                        </form>
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">Lot Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
