// app/[locale]/buyer/lots/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOpenLots } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { OfferModal } from "@/components/buyer/OfferModal";
import { LotBadge } from "@/components/lot/LotBadge";
import { getDistanceInfo } from "@/lib/distance";
import type { Grade, District } from "@/lib/types";

import { ErrorBoundary } from "@/components/ErrorBoundary";

function BuyerBrowseLotsContent({ lots }: { lots: ReturnType<typeof getOpenLots> }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse Farmer & FPO Lots</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Make digital counter-offers directly to farmers and pooled FPO hubs across Maharashtra.
        </p>
      </div>

      {lots.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-card">
          <span className="text-4xl mb-2 block">🌾</span>
          <p className="font-semibold text-foreground">No lots available</p>
          <p className="text-xs text-muted-foreground mt-1">Check back later or post a demand</p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {lots.map((lot) => {
          // Calculate distance from lot district to Rajan's base in Pune
          const distance = getDistanceInfo(lot.district as District, "Pune", lot.askingPricePerQuintal);

          return (
            <Card key={lot.id} className="border shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize text-lg font-bold">
                        {lot.crop} • {lot.qtyTons} Tons
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 Farm Location: <span className="font-semibold text-foreground">{lot.district}</span> • {lot.farmerName}
                      </p>
                    </div>
                    <LotBadge grade={lot.grade as Grade} />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-2xl font-black text-emerald-950">
                        {formatINR(lot.askingPricePerQuintal)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">/quintal</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">Farmer&apos;s asking rate</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-foreground">
                        {distance.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Freight ~₹{distance.estimatedTransportCostPerQuintal}/q
                      </span>
                    </div>
                  </div>

                  {lot.isFpoPool && (
                    <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                      <span className="font-bold">🤝 FPO Aggregated Pool ({lot.fpoName})</span>
                      <span className="text-[10px] font-semibold bg-blue-100 px-2 py-0.5 rounded">
                        Bulk Certified
                      </span>
                    </div>
                  )}

                  {lot.qualityNotes && (
                    <p className="text-xs bg-muted/30 p-2 rounded border text-muted-foreground">
                      &quot;{lot.qualityNotes}&quot;
                    </p>
                  )}
                </CardContent>
              </div>

              <div className="p-4 border-t bg-muted/10">
                <OfferModal lot={lot} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default async function BuyerBrowseLots() {
  const lots = getOpenLots();
  return (
    <ErrorBoundary>
      <BuyerBrowseLotsContent lots={lots} />
    </ErrorBoundary>
  );
}
