// app/api/lots/route.ts
// GET /api/lots?crop=&district=  → all open lots, optionally filtered
// POST /api/lots                 → create a new lot

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenLots, createLot, getLotsByFarmer } from "@/lib/data/store";

const LotSchema = z.object({
  crop: z.enum(["soybean", "onion", "tur"]),
  qtyTons: z.number().positive().max(1000),
  grade: z.enum(["A", "B", "C"]),
  askingPricePerQuintal: z.number().positive().max(100000),
  qualityNotes: z.string().max(500).optional().default(""),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  farmerName: z.string().min(1).max(100),
  farmerId: z.string().min(1),
  isFpoPool: z.boolean().optional().default(false),
  fpoName: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") || undefined;
  const district = searchParams.get("district") || undefined;
  const farmerId = searchParams.get("farmerId") || undefined;

  if (farmerId) {
    return NextResponse.json(getLotsByFarmer(farmerId));
  }
  return NextResponse.json(getOpenLots({ crop, district }));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const lot = createLot(parsed.data);
  return NextResponse.json(lot, { status: 201 });
}
