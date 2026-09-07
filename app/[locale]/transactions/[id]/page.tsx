// app/[locale]/transactions/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTransactions, getLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }> | { locale: string; id: string };
}) {
  const { locale, id } = await Promise.resolve(params);
  const tx = getAllTransactions().find((t) => t.id === id);
  if (!tx) notFound();

  const lot = getLot(tx.lotId);
  const buyer = seedBuyers.find((b) => b.id === tx.buyerId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <Link href={`/${locale}/transactions`} className="text-sm font-semibold text-emerald-700 hover:underline">
        ← Back to All Transactions
      </Link>

      <Card className="shadow-sm border bg-card">
        <CardHeader className="border-b pb-4 bg-muted/20">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Deal Record
              </span>
              <CardTitle className="text-2xl font-black mt-2">
                Transaction #{tx.id}
              </CardTitle>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Settlement Timestamp</span>
              <p className="text-sm font-semibold">{formatDate(tx.closedAt, locale as "en" | "mr")}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <span className="text-xs font-bold uppercase text-muted-foreground">Crop & Volume</span>
              <p className="font-bold text-base capitalize mt-0.5">
                {lot?.crop} ({tx.qtyTons} Metric Tons)
              </p>
              <p className="text-xs text-muted-foreground">Quality Grade {lot?.grade || "A"}</p>
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-muted-foreground">Agreed Mandi Price</span>
              <p className="font-black text-xl text-emerald-950 mt-0.5">
                {formatINR(tx.finalPricePerQuintal)}
                <span className="text-xs font-normal text-muted-foreground">/quintal</span>
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b">
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground uppercase">Seller (Farmer)</span>
              <p className="font-bold text-sm text-foreground mt-1">{lot?.farmerName || "Priya Patil"}</p>
              <p className="text-xs text-muted-foreground">District: {lot?.district || "Latur"}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="text-xs font-bold text-muted-foreground uppercase">Buyer</span>
              <p className="font-bold text-sm text-foreground mt-1">{buyer?.name || "Rajan Traders"}</p>
              <p className="text-xs text-muted-foreground">{buyer?.organization} • {buyer?.district}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase text-emerald-900">Total Contract Value</span>
              <p className="text-xs text-emerald-800">Direct payment tracking under PS #26132</p>
            </div>
            <div className="text-2xl font-black text-emerald-950">
              {formatINR(tx.totalAmount)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
