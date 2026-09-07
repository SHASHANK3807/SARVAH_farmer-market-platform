// app/api/offers/[id]/accept/route.ts
// POST /api/offers/[id]/accept
// Accepts an offer, closes the lot, creates a transaction record.

import { NextResponse } from "next/server";
import { acceptOffer } from "@/lib/data/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  const result = acceptOffer(id);
  if (!result) {
    return NextResponse.json({ error: "offer not found" }, { status: 404 });
  }
  return NextResponse.json({
    offer: result.offer,
    transaction: result.transaction,
    lot: result.lot,
  });
}
