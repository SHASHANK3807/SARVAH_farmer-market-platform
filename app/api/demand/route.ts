// app/api/demand/route.ts
// GET /api/demand?crop=&district=  → matching demand posts
// GET /api/demand?buyerId=         → all demands by a buyer
// POST /api/demand                 → create a new demand post

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getMatchingDemands, getDemandsByBuyer, createDemand,
} from "@/lib/data/store";
import type { Crop, District } from "@/lib/types";

const DemandSchema = z.object({
  buyerId: z.string(),
  crop: z.enum(["soybean", "onion", "tur"]),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  qtyTons: z.number().positive().max(1000),
  priceMinPerQuintal: z.number().positive().max(100000),
  priceMaxPerQuintal: z.number().positive().max(100000),
  grade: z.enum(["A", "B", "C"]),
  deliveryWindowDays: z.number().int().positive().max(60),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") as Crop | null;
  const district = searchParams.get("district") as District | null;
  const buyerId = searchParams.get("buyerId");

  if (buyerId) {
    return NextResponse.json(getDemandsByBuyer(buyerId));
  }
  if (crop && district) {
    return NextResponse.json(getMatchingDemands(crop, district));
  }
  return NextResponse.json({ error: "crop+district or buyerId required" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = DemandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const demand = createDemand(parsed.data);
  return NextResponse.json(demand, { status: 201 });
}
