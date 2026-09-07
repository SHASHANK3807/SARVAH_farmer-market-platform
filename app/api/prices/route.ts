// app/api/prices/route.ts
// GET /api/prices?crop=&district=&days=30
// Returns price history for a crop+district combo.

import { NextResponse } from "next/server";
import { fetchPriceHistory } from "@/lib/data/agmarknet";
import { seedPrices } from "@/lib/data/seed-loader";
import type { Crop, District } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = (searchParams.get("crop") || "soybean") as Crop;
  const district = (searchParams.get("district") || "Latur") as District;
  const days = parseInt(searchParams.get("days") || "30", 10);

  if (!crop || !district) {
    return NextResponse.json({ error: "crop and district required" }, { status: 400 });
  }

  const normalizedDistrict = (district.charAt(0).toUpperCase() + district.slice(1).toLowerCase()) as District;

  const history = await fetchPriceHistory(crop, normalizedDistrict, days);
  const latest = history.at(-1) ?? null;
  const yesterday = history.at(-2) ?? null;
  const changeVsYesterday = latest && yesterday
    ? latest.pricePerQuintal - yesterday.pricePerQuintal
    : 0;

  // Return "other mandis" so farmer can compare side-by-side
  const otherMandis = seedPrices
    .filter((p) => p.crop.toLowerCase() === crop.toLowerCase())
    .filter((p) => p.district.toLowerCase() !== normalizedDistrict.toLowerCase())
    .reduce<Record<string, { price: number; date: string }>>((acc, p) => {
      if (!acc[p.district] || acc[p.district].date < p.date) {
        acc[p.district] = { price: p.pricePerQuintal, date: p.date };
      }
      return acc;
    }, {});

  return NextResponse.json({
    history,
    latest,
    changeVsYesterday,
    otherMandis,
  });
}
