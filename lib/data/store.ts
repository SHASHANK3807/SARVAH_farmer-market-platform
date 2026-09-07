// lib/data/store.ts
// JSON file CRUD. Reads from seed JSON, writes to runtime JSON (in-memory + fs).

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import type { Lot, Offer, Transaction, DemandPost } from "@/lib/types";
import {
  seedLots, seedOffers, seedTransactions, seedDemands,
} from "./seed-loader";

const DATA_DIR = path.join(process.cwd(), "data");
const LOTS_FILE = path.join(DATA_DIR, "lots.runtime.json");
const OFFERS_FILE = path.join(DATA_DIR, "offers.runtime.json");
const TX_FILE = path.join(DATA_DIR, "transactions.runtime.json");
const DEMANDS_FILE = path.join(DATA_DIR, "demand-posts.runtime.json");

// In-memory cache
let lotsCache: Lot[] | null = null;
let offersCache: Offer[] | null = null;
let txCache: Transaction[] | null = null;
let demandsCache: DemandPost[] | null = null;

function load<T>(file: string, seed: T[]): T[] {
  if (fs.existsSync(file)) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return seed;
    }
  }
  return seed;
}

function save<T>(file: string, data: T[]) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to save ${file}:`, err);
  }
}

// Lots
export function getAllLots(): Lot[] {
  if (!lotsCache) lotsCache = load(LOTS_FILE, seedLots);
  return lotsCache;
}

export function getLot(id: string): Lot | undefined {
  return getAllLots().find((l) => l.id === id);
}

export function getLotsByFarmer(farmerId: string): Lot[] {
  return getAllLots().filter((l) => l.farmerId === farmerId);
}

export function getOpenLots(filters?: {
  crop?: string;
  district?: string;
}): Lot[] {
  return getAllLots()
    .filter((l) => l.status === "open")
    .filter((l) => !filters?.crop || l.crop.toLowerCase() === filters.crop.toLowerCase())
    .filter((l) => !filters?.district || l.district.toLowerCase() === filters.district.toLowerCase());
}

export function createLot(data: Omit<Lot, "id" | "createdAt" | "status">): Lot {
  const lot: Lot = {
    ...data,
    id: `L${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "open",
  };
  const lots = getAllLots();
  lots.unshift(lot);
  lotsCache = lots;
  save(LOTS_FILE, lots);
  return lot;
}

// Offers
export function getAllOffers(): Offer[] {
  if (!offersCache) offersCache = load(OFFERS_FILE, seedOffers);
  return offersCache;
}

export function getOffersForLot(lotId: string): Offer[] {
  return getAllOffers().filter((o) => o.lotId === lotId);
}

export function createOffer(
  data: Omit<Offer, "id" | "createdAt" | "status">
): Offer {
  const offer: Offer = {
    ...data,
    id: `O${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  const offers = getAllOffers();
  offers.unshift(offer);
  offersCache = offers;
  save(OFFERS_FILE, offers);
  return offer;
}

export function acceptOffer(offerId: string): { offer: Offer; transaction: Transaction; lot: Lot } | null {
  const offers = getAllOffers();
  const offer = offers.find((o) => o.id === offerId);
  if (!offer) return null;

  // Update offer status
  offer.status = "accepted";
  offersCache = offers;
  save(OFFERS_FILE, offers);

  // Update lot status
  const lots = getAllLots();
  const lot = lots.find((l) => l.id === offer.lotId);
  if (!lot) return null;
  lot.status = "closed";
  lotsCache = lots;
  save(LOTS_FILE, lots);

  // Create transaction (1 ton = 10 quintals)
  const tx: Transaction = {
    id: `T${randomUUID().slice(0, 8)}`,
    lotId: lot.id,
    offerId: offer.id,
    buyerId: offer.buyerId,
    farmerId: lot.farmerId,
    finalPricePerQuintal: offer.pricePerQuintal,
    qtyTons: offer.qtyTons,
    totalAmount: offer.pricePerQuintal * offer.qtyTons * 10,
    closedAt: new Date().toISOString(),
  };
  const txs = getAllTransactions();
  txs.unshift(tx);
  txCache = txs;
  save(TX_FILE, txs);

  return { offer, transaction: tx, lot };
}

// Transactions
export function getAllTransactions(): Transaction[] {
  if (!txCache) txCache = load(TX_FILE, seedTransactions);
  return txCache;
}

// Demand posts
export function getAllDemands(): DemandPost[] {
  if (!demandsCache) demandsCache = load(DEMANDS_FILE, seedDemands);
  return demandsCache;
}

export function getDemandsByBuyer(buyerId: string): DemandPost[] {
  return getAllDemands().filter((d) => d.buyerId === buyerId);
}

export function getMatchingDemands(
  crop: string,
  district: string
): DemandPost[] {
  return getAllDemands()
    .filter((d) => d.status === "open")
    .filter((d) => !crop || d.crop.toLowerCase() === crop.toLowerCase())
    .filter((d) => !district || d.district.toLowerCase() === district.toLowerCase())
    .slice(0, 3); // top 3 for farmer dashboard
}

export function createDemand(
  data: Omit<DemandPost, "id" | "createdAt" | "status">
): DemandPost {
  const demand: DemandPost = {
    ...data,
    id: `D${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "open",
  };
  const demands = getAllDemands();
  demands.unshift(demand);
  demandsCache = demands;
  save(DEMANDS_FILE, demands);
  return demand;
}
