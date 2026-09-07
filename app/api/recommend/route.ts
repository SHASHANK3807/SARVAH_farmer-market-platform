// app/api/recommend/route.ts
import { NextResponse } from "next/server";
import { fetchPriceHistory } from "@/lib/data/agmarknet";
import { recommend } from "@/lib/recommendation/engine";
import type { Crop, District } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = (searchParams.get("crop") || "soybean") as Crop;
  const district = (searchParams.get("district") || "Latur") as District;
  const hasStorage = searchParams.get("hasStorage") !== "false";

  if (!crop || !district) {
    return NextResponse.json({ error: "crop and district required" }, { status: 400 });
  }

  // Normalize district casing
  const normalizedDistrict = (district.charAt(0).toUpperCase() + district.slice(1).toLowerCase()) as District;

  const history = await fetchPriceHistory(crop, normalizedDistrict, 60);
  const result = recommend({ crop, district: normalizedDistrict, history, hasStorage });
  return NextResponse.json(result);
}
