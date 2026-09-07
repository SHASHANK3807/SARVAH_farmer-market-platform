// lib/distance.ts
// Basic distance and transport realization heuristic for Maharashtra districts.

import type { District, DistanceInfo } from "@/lib/types";

const DISTANCE_MATRIX: Record<District, Record<District, number>> = {
  Latur:   { Latur: 0,   Pune: 180, Nashik: 250, Solapur: 150, Nagpur: 350 },
  Pune:    { Latur: 180, Pune: 0,   Nashik: 150, Solapur: 200, Nagpur: 300 },
  Nashik:  { Latur: 250, Pune: 150, Nashik: 0,   Solapur: 250, Nagpur: 400 },
  Solapur: { Latur: 150, Pune: 200, Nashik: 250, Solapur: 0,   Nagpur: 350 },
  Nagpur:  { Latur: 350, Pune: 300, Nashik: 400, Solapur: 350, Nagpur: 0 },
};

export function getDistanceInfo(
  from: District,
  to: District,
  mandiPrice?: number
): DistanceInfo {
  const km = DISTANCE_MATRIX[from]?.[to] ?? 100;
  const freightRatePerKmPerQuintal = 0.8; // avg ₹0.80 per quintal per km in MH freight
  const transportCost = Math.round(km * freightRatePerKmPerQuintal);

  return {
    km,
    warning: km > 50,
    label: km > 50 ? `⚠️ Far (~${km} km) — freight ~₹${transportCost}/q` : `~${km} km (local)`,
    estimatedTransportCostPerQuintal: transportCost,
    netRealizationPerQuintal: mandiPrice ? Math.max(0, mandiPrice - transportCost) : undefined,
  };
}
