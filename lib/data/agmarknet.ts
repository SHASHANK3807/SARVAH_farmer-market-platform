// lib/data/agmarknet.ts
// Mock of Agmarknet data fetcher with robust seed data fallback.

import { seedPrices } from "./seed-loader";
import type { PricePoint } from "@/lib/types";

export async function fetchLatestPrice(
  crop: string,
  district: string
): Promise<PricePoint | null> {
  const filtered = seedPrices.filter(
    (p) =>
      p.crop.toLowerCase() === crop.toLowerCase() &&
      p.district.toLowerCase() === district.toLowerCase()
  );
  if (filtered.length === 0) return null;
  return filtered.sort((a, b) => b.date.localeCompare(a.date))[0];
}

export async function fetchPriceHistory(
  crop: string,
  district: string,
  days: number = 30
): Promise<PricePoint[]> {
  const filtered = seedPrices
    .filter(
      (p) =>
        p.crop.toLowerCase() === crop.toLowerCase() &&
        p.district.toLowerCase() === district.toLowerCase()
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);
  return filtered;
}

export async function fetchAllMandisLatestPrices(
  crop: string
): Promise<PricePoint[]> {
  const mandis = ["Latur", "Pune", "Nashik", "Solapur", "Nagpur"];
  const results: PricePoint[] = [];
  for (const district of mandis) {
    const latest = await fetchLatestPrice(crop, district);
    if (latest) results.push(latest);
  }
  return results;
}
