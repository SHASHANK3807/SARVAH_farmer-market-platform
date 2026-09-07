// scripts/generate-seed.ts
// Run with: npx tsx scripts/generate-seed.ts
// This generates all seed JSON files in /data folder.

import * as fs from "fs";
import * as path from "path";
import type { Crop, District, PricePoint, Buyer, DemandPost, Lot } from "../lib/types";

const CROPS: Crop[] = ["soybean", "onion", "tur"];
const DISTRICTS: District[] = ["Latur", "Pune", "Nashik", "Solapur", "Nagpur"];

// Base prices (mid-August 2026, INR per quintal)
const BASE_PRICES: Record<Crop, number> = {
  soybean: 4200,
  onion: 3500,
  tur: 5800,
};

// District modifiers (some mandis pay more/less)
const DISTRICT_MOD: Record<District, number> = {
  Latur: 0.96,    // primary soybean hub
  Pune: 1.05,     // premium consumption center
  Nashik: 1.02,   // onion hub
  Solapur: 0.98,
  Nagpur: 1.07,   // high industrial demand
};

// Crop seasonality (prices spike in certain months)
function seasonality(date: Date, crop: Crop): number {
  const month = date.getMonth(); // 0-11
  if (crop === "onion" && (month === 7 || month === 8)) return 1.15; // Aug-Sep onion scarcity
  if (crop === "tur" && (month === 10 || month === 11)) return 0.90;  // Oct-Nov harvest
  if (crop === "soybean" && (month === 8 || month === 9)) return 1.05; // Sep-Oct lean
  return 1.0;
}

// Generate 60 days of prices
function generatePrices(): PricePoint[] {
  const points: PricePoint[] = [];
  const today = new Date("2026-09-06"); // Fixed date for repeatable demo
  for (let d = 60; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    for (const crop of CROPS) {
      for (const district of DISTRICTS) {
        const base = BASE_PRICES[crop] * DISTRICT_MOD[district];
        const seasonal = seasonality(date, crop);
        const drift = 1 + (d / 60 - 0.5) * 0.08;
        const noise = 0.98 + ((d * 13 + crop.length * 7) % 5) * 0.01;
        const price = Math.round(base * seasonal * drift * noise);
        points.push({
          date: date.toISOString().split("T")[0],
          crop,
          district,
          pricePerQuintal: price,
        });
      }
    }
  }
  return points;
}

function generateBuyers(): Buyer[] {
  return [
    {
      id: "b1",
      name: "Rajan Traders",
      organization: "Rajan Agro Processors Pvt Ltd",
      district: "Pune",
      verified: true,
      fpo: false,
      trustScore: 92,
      criteriaNotes: "APMC licensed, 12 years trading, settled 500+ transactions on time",
    },
    {
      id: "b2",
      name: "Latur Kisan FPO",
      organization: "Latur Farmer Producer Company",
      district: "Latur",
      verified: true,
      fpo: true,
      trustScore: 88,
      criteriaNotes: "FPO registered under MACP/SMART, 450+ farmer members with collective bulk aggregation",
    },
    {
      id: "b3",
      name: "Nashik Wholesale Co.",
      organization: "Nashik Onion & Grain Traders",
      district: "Nashik",
      verified: false,
      fpo: false,
      trustScore: 65,
      criteriaNotes: "New buyer, verified GSTIN, trade history under review",
    },
    {
      id: "b4",
      name: "Solapur Spices & Agro",
      organization: "Solapur Spice Trading",
      district: "Solapur",
      verified: false,
      fpo: false,
      trustScore: 58,
      criteriaNotes: "Limited transaction history on platform",
    },
    {
      id: "b5",
      name: "Vidarbha Dal & Oil Mills",
      organization: "Vidarbha Mills Pvt Ltd",
      district: "Nagpur",
      verified: true,
      fpo: false,
      trustScore: 95,
      criteriaNotes: "Large institutional processor, instant digital settlement, Grade A/FAQ only",
    },
  ];
}

function generateDemandPosts(): DemandPost[] {
  return [
    {
      id: "d1",
      buyerId: "b1",
      crop: "soybean",
      district: "Latur",
      qtyTons: 10,
      priceMinPerQuintal: 4300,
      priceMaxPerQuintal: 4500,
      grade: "A",
      deliveryWindowDays: 7,
      createdAt: "2026-09-04",
      status: "open",
    },
    {
      id: "d2",
      buyerId: "b2",
      crop: "soybean",
      district: "Latur",
      qtyTons: 25,
      priceMinPerQuintal: 4350,
      priceMaxPerQuintal: 4550,
      grade: "A",
      deliveryWindowDays: 10,
      createdAt: "2026-09-05",
      status: "open",
    },
    {
      id: "d3",
      buyerId: "b3",
      crop: "onion",
      district: "Nashik",
      qtyTons: 8,
      priceMinPerQuintal: 3800,
      priceMaxPerQuintal: 4000,
      grade: "A",
      deliveryWindowDays: 5,
      createdAt: "2026-09-03",
      status: "open",
    },
    {
      id: "d4",
      buyerId: "b5",
      crop: "tur",
      district: "Nagpur",
      qtyTons: 15,
      priceMinPerQuintal: 5600,
      priceMaxPerQuintal: 5800,
      grade: "A",
      deliveryWindowDays: 14,
      createdAt: "2026-09-05",
      status: "open",
    },
    {
      id: "d5",
      buyerId: "b4",
      crop: "soybean",
      district: "Latur",
      qtyTons: 20,
      priceMinPerQuintal: 4100,
      priceMaxPerQuintal: 4300,
      grade: "B",
      deliveryWindowDays: 7,
      createdAt: "2026-09-02",
      status: "open",
    },
  ];
}

function generateLots(): Lot[] {
  return [
    {
      id: "L1",
      crop: "soybean",
      qtyTons: 10,
      grade: "A",
      askingPricePerQuintal: 4400,
      qualityNotes: "Moisture < 9.5%, machine cleaned, no discoloration",
      district: "Latur",
      farmerName: "Priya Patil",
      farmerId: "f1",
      createdAt: "2026-09-05",
      status: "open",
      isFpoPool: true,
      fpoName: "Latur Kisan FPO",
    },
    {
      id: "L2",
      crop: "onion",
      qtyTons: 5,
      grade: "B",
      askingPricePerQuintal: 3800,
      qualityNotes: "Medium size bulbs, dry skins, sorted yesterday",
      district: "Pune",
      farmerName: "Suresh Deshmukh",
      farmerId: "f2",
      createdAt: "2026-09-04",
      status: "open",
      isFpoPool: false,
    },
    {
      id: "L3",
      crop: "tur",
      qtyTons: 8,
      grade: "A",
      askingPricePerQuintal: 5700,
      qualityNotes: "Premium red tur, organic certified, minimal broken grain",
      district: "Nagpur",
      farmerName: "Anil Wankhede",
      farmerId: "f3",
      createdAt: "2026-09-05",
      status: "open",
      isFpoPool: false,
    },
  ];
}

function generateOffers() {
  return [
    {
      id: "O1",
      lotId: "L1",
      buyerId: "b1",
      pricePerQuintal: 4350,
      qtyTons: 10,
      message: "Ready for immediate truck dispatch to Pune. Settlement in 24 hours.",
      createdAt: "2026-09-05",
      status: "pending",
    },
  ];
}

function generateTransactions() {
  return [];
}

// Write to disk
const dataDir = path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(
  path.join(dataDir, "prices.seed.json"),
  JSON.stringify(generatePrices(), null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "buyers.seed.json"),
  JSON.stringify(generateBuyers(), null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "demand-posts.seed.json"),
  JSON.stringify(generateDemandPosts(), null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "lots.seed.json"),
  JSON.stringify(generateLots(), null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "offers.seed.json"),
  JSON.stringify(generateOffers(), null, 2)
);
fs.writeFileSync(
  path.join(dataDir, "transactions.seed.json"),
  JSON.stringify(generateTransactions(), null, 2)
);

console.log("✅ Seed data generated in", dataDir);
