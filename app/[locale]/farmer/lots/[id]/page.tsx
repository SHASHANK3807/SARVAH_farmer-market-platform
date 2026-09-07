// app/[locale]/farmer/lots/[id]/page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import { LotBadge } from "@/components/lot/LotBadge";
import type { Lot, Offer, Buyer, Grade } from "@/lib/types";
import Link from "next/link";

interface LotDetail extends Lot {
  offers: (Offer & { buyer?: Buyer })[];
  distance: { km: number; warning: boolean; label: string };
}

export default function FarmerLotDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [lot, setLot] = useState<LotDetail | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/lots/${resolvedParams.id}`)
      .then((r) => r.json())
      .then(setLot);
  }, [resolvedParams.id]);

  const acceptOffer = async (offerId: string) => {
    if (!confirm("Accept this digital offer? The lot will be closed and entered into the transaction audit record.")) return;
    setAccepting(offerId);
    const res = await fetch(`/api/offers/${offerId}/accept`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/${resolvedParams.locale}/transactions/${data.transaction.id}`);
    } else {
      alert("Failed to accept offer");
    }
    setAccepting(null);
  };

  if (!lot) return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground animate-pulse">Loading lot details…</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <Link href={`/${resolvedParams.locale}/farmer?crop=${lot.crop}&district=${lot.district}`} className="text-sm font-semibold text-emerald-700 hover:underline">
          ← Back to Farmer Dashboard
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
                <CardTitle className="capitalize text-2xl font-bold">
                  {lot.crop} ({lot.qtyTons} Metric Tons)
                </CardTitle>
                <LotBadge grade={lot.grade as Grade} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                📍 {lot.district} • Posted on {lot.createdAt}
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
        <CardContent className="pt-4 space-y-3">
          {lot.isFpoPool && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 font-semibold">
              🤝 Pooled under {lot.fpoName || "Latur Kisan FPO"} (+₹150/q Bulk Premium)
            </div>
          )}
          {lot.qualityNotes && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Quality Specification:</span>
              <p className="text-sm mt-0.5">{lot.qualityNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-lg font-bold">
            Offers Received ({lot.offers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {!lot.offers || lot.offers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No digital offers received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {lot.offers.map((offer) => (
                <div key={offer.id} className="border rounded-xl p-4 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-base">
                      <span>{offer.buyer?.name || "Verified Buyer"}</span>
                      {offer.buyer?.verified && <VerifiedBuyerBadge />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Offer: <span className="font-bold text-foreground text-sm">{formatINR(offer.pricePerQuintal)}/quintal</span> for {offer.qtyTons} tons
                    </p>
                    {offer.message && (
                      <p className="text-xs italic text-muted-foreground mt-1">
                        &quot;{offer.message}&quot;
                      </p>
                    )}
                  </div>

                  <div>
                    {offer.status === "pending" && lot.status === "open" ? (
                      <Button
                        onClick={() => acceptOffer(offer.id)}
                        disabled={accepting === offer.id}
                        className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-white"
                      >
                        {accepting === offer.id ? "Accepting…" : "Accept Offer & Close Deal"}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="font-bold">
                        {offer.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
