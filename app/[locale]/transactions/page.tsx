// app/[locale]/transactions/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTransactions, getLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const txs = getAllTransactions();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="border-b pb-4 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            Immutable Audit Trail • Smart India Hackathon #26132
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Transaction Ledger & Deal Records
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transparent records of settled farm-gate and FPO transactions.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-2xl font-black text-emerald-700">{txs.length}</span>
          <span className="text-xs text-muted-foreground block font-medium">Deals Closed</span>
        </div>
      </div>

      <div className="space-y-4">
        {txs.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card">
            <span className="text-3xl mb-2 block">🤝</span>
            <p className="font-semibold text-foreground">No transactions recorded yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Browse lots in the Buyer Portal and submit an offer to generate a digital transaction!
            </p>
            <div className="mt-4">
              <Link
                href={`/${locale}/buyer/lots`}
                className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100"
              >
                Browse Lots →
              </Link>
            </div>
          </div>
        ) : (
          txs.map((tx) => {
            const lot = getLot(tx.lotId);
            const buyer = seedBuyers.find((b) => b.id === tx.buyerId);

            return (
              <Link key={tx.id} href={`/${locale}/transactions/${tx.id}`}>
                <Card className="hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer border bg-card">
                  <CardHeader className="pb-2 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CardTitle className="capitalize text-lg font-bold">
                          {lot?.crop || "Crop"} ({tx.qtyTons} Tons)
                        </CardTitle>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                          Grade {lot?.grade || "A"}
                        </Badge>
                      </div>
                      <span className="text-xl font-black text-emerald-950">
                        {formatINR(tx.totalAmount)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div>
                      Farmer: <span className="font-semibold text-foreground">{lot?.farmerName || "Priya Patil"} ({lot?.district || "Latur"})</span> • Buyer: <span className="font-semibold text-foreground">{buyer?.name || "Rajan Traders"} ({buyer?.organization})</span>
                    </div>
                    <div>
                      Rate: <span className="font-bold text-foreground">{formatINR(tx.finalPricePerQuintal)}/q</span> • Settled on {formatDate(tx.closedAt, locale as "en" | "mr")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
