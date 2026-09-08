import { NextResponse } from "next/server";
import { fetchArrivalVolume } from "@/lib/data/agmarknet";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") || "soybean";
  const district = searchParams.get("district") || "Latur";
  const volume = await fetchArrivalVolume(crop, district);
  return NextResponse.json({ crop, district, volumeTons: volume, date: new Date().toISOString().split("T")[0] });
}
