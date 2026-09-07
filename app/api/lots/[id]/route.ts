// app/api/lots/[id]/route.ts
// GET /api/lots/[id]  → single lot detail with offers + distance info

import { NextResponse } from "next/server";
import { getLot, getOffersForLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { getDistanceInfo } from "@/lib/distance";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  const lot = getLot(id);
  if (!lot) {
    return NextResponse.json({ error: "lot not found" }, { status: 404 });
  }

  const offers = getOffersForLot(lot.id);

  // Attach buyer info to offers
  const offersWithBuyers = offers.map((o) => {
    const buyer = seedBuyers.find((b) => b.id === o.buyerId);
    return { ...o, buyer };
  });

  // Distance: from farmer's district to a hypothetical "Latur" buyer
  const distance = getDistanceInfo(lot.district, "Latur", lot.askingPricePerQuintal);

  return NextResponse.json({
    ...lot,
    offers: offersWithBuyers,
    distance,
  });
}
