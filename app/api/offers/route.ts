// app/api/offers/route.ts
// GET /api/offers?lotId=  → all offers for a lot
// POST /api/offers         → create a new offer

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOffersForLot, createOffer } from "@/lib/data/store";

const OfferSchema = z.object({
  lotId: z.string(),
  buyerId: z.string(),
  pricePerQuintal: z.number().positive().max(100000),
  qtyTons: z.number().positive().max(1000),
  message: z.string().max(500).optional().default(""),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lotId = searchParams.get("lotId");
  if (!lotId) {
    return NextResponse.json({ error: "lotId required" }, { status: 400 });
  }
  return NextResponse.json(getOffersForLot(lotId));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = OfferSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const offer = createOffer(parsed.data);
  return NextResponse.json(offer, { status: 201 });
}
