// app/[locale]/buyer/demands/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemandsByBuyer } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default async function MyDemandsPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  const demands = getDemandsByBuyer("b1"); // Rajan Agro Processors

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Active Demands</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Demands posted by Rajan Agro Processors across Maharashtra.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={`/${locale}/buyer/demands/new`}>+ Post New Demand</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {demands.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-muted-foreground">No active demands posted yet.</p>
          </div>
        ) : (
          demands.map((d) => (
            <Card key={d.id} className="border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize text-lg font-bold">
                      {d.crop} • {d.qtyTons} Metric Tons
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      📍 Delivery to: <span className="font-semibold text-foreground">{d.district}</span> • Posted {d.createdAt}
                    </p>
                  </div>
                  <Badge variant="outline" className="font-bold border-blue-300 text-blue-800 bg-blue-50">
                    Grade {d.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Target Price Band
                  </div>
                  <div className="text-xl font-black text-emerald-950">
                    {formatINR(d.priceMinPerQuintal)} – {formatINR(d.priceMaxPerQuintal)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/quintal</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Delivery window: within {d.deliveryWindowDays} days
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    ● Broadcasting Active
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${locale}/buyer/lots`}>View Matching Lots</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
