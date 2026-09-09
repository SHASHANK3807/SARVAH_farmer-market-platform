// lib/types.ts
// All TypeScript types for Sarvah. This is the single source of truth.

export type District = "Latur" | "Pune" | "Nashik" | "Solapur" | "Nagpur";
export type Crop = "soybean" | "onion" | "tur";
export type Grade = "A" | "B" | "C";
export type Locale = "en" | "mr";

export interface User {
  id: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: "farmer" | "buyer";
  district: District;
  createdAt: string;
}

export type RecommendationAction = "SELL_NOW" | "WAIT_3_DAYS" | "WAIT_2_WEEKS" | "HOLD";

export interface PricePoint {
  date: string;          // ISO date "2026-08-01"
  crop: Crop;
  district: District;
  pricePerQuintal: number;  // INR per quintal
}

export interface Buyer {
  id: string;
  name: string;
  organization: string;
  district: District;
  verified: boolean;        // mocked
  fpo: boolean;             // is FPO?
  trustScore: number;       // 0-100, mocked
  criteriaNotes: string;    // for tooltip
}

export interface DemandPost {
  id: string;
  buyerId: string;
  crop: Crop;
  district: District;
  qtyTons: number;
  priceMinPerQuintal: number;
  priceMaxPerQuintal: number;
  grade: Grade;
  deliveryWindowDays: number;  // days from now
  createdAt: string;
  status: "open" | "fulfilled" | "closed";
}

export interface Lot {
  id: string;
  crop: Crop;
  qtyTons: number;
  grade: Grade;
  askingPricePerQuintal: number;
  qualityNotes: string;
  district: District;       // farmer's district
  farmerName: string;       // mocked
  farmerId: string;         // mocked
  createdAt: string;
  status: "open" | "closed";
  isFpoPool?: boolean;      // FPO aggregated pool indicator
  fpoName?: string;         // e.g. "Latur Kisan Producer Co."
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  pricePerQuintal: number;
  qtyTons: number;
  message: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Transaction {
  id: string;
  lotId: string;
  offerId: string;
  buyerId: string;
  farmerId: string;
  finalPricePerQuintal: number;
  qtyTons: number;
  totalAmount: number;
  closedAt: string;
}

export interface RecommendationResult {
  action: RecommendationAction;
  confidence: number;       // 0-1
  reasoning: string[];      // English sentences
  reasoningMr: string[];    // Marathi sentences
  currentPrice: number;
  percentile: number;       // 0-100
  trend7d: "up" | "down" | "flat";
  seasonalityHint: string;
  storageWarning?: boolean;
}

export interface DistanceInfo {
  km: number;
  warning: boolean;         // > 50 km
  label: string;            // "~150 km" or "⚠️ Far — consider transport"
  estimatedTransportCostPerQuintal: number; // e.g. Math.round(km * 0.8)
  netRealizationPerQuintal?: number;        // Mandi Price - Transport Cost
}