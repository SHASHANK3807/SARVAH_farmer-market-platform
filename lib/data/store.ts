// lib/data/store.ts
// JSON file CRUD. Reads from seed JSON, writes to runtime JSON (in-memory + fs).

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import type { Lot, Offer, Transaction, DemandPost, User } from "@/lib/types";
import {
  seedLots, seedOffers, seedTransactions, seedDemands,
} from "./seed-loader";

const DATA_DIR = path.join(process.cwd(), "data");
const LOTS_FILE = path.join(DATA_DIR, "lots.runtime.json");
const OFFERS_FILE = path.join(DATA_DIR, "offers.runtime.json");
const TX_FILE = path.join(DATA_DIR, "transactions.runtime.json");
const DEMANDS_FILE = path.join(DATA_DIR, "demand-posts.runtime.json");
const USERS_FILE = path.join(DATA_DIR, "users.runtime.json");

function load<T>(file: string, seed: T[]): T[] {
  if (fs.existsSync(file)) {
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return [...seed];
    }
  }
  return [...seed];
}

function save<T>(file: string, data: T[]) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to save ${file}:`, err);
  }
}

// Users
export function getAllUsers(): User[] {
  return load(USERS_FILE, []);
}

export function getUserById(id: string): User | undefined {
  return getAllUsers().find((u) => u.id === id);
}

export function getUserByPhone(phone: string): User | undefined {
  return getAllUsers().find((u) => u.phone === phone);
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const user: User = {
    ...data,
    id: `U${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const users = getAllUsers();
  users.unshift(user);
  save(USERS_FILE, users);
  return user;
}

// Lots
export function getAllLots(): Lot[] {
  return load(LOTS_FILE, seedLots);
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
  // If FPO pool, add premium to asking price
  let askingPrice = data.askingPricePerQuintal;
  if (data.isFpoPool) {
    askingPrice = Math.round(data.askingPricePerQuintal * 1.035); // +3.5% premium
  }
  const lot: Lot = {
    ...data,
    askingPricePerQuintal: askingPrice,
    id: `L${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "open",
  };
  const lots = getAllLots();
  lots.unshift(lot);
  save(LOTS_FILE, lots);
  return lot;
}

// Offers
export function getAllOffers(): Offer[] {
  return load(OFFERS_FILE, seedOffers);
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
  save(OFFERS_FILE, offers);
  return offer;
}

export function acceptOffer(offerId: string): { offer: Offer; transaction: Transaction; lot: Lot } | null {
  const offers = getAllOffers();
  const offer = offers.find((o) => o.id === offerId);
  if (!offer) return null;

  // Prevent duplicate transactions if already accepted
  if (offer.status === "accepted") {
    const existingTx = getAllTransactions().find((t) => t.offerId === offerId);
    const lot = getAllLots().find((l) => l.id === offer.lotId);
    if (existingTx && lot) {
      return { offer, transaction: existingTx, lot };
    }
  }

  // Update offer status
  offer.status = "accepted";
  save(OFFERS_FILE, offers);

  // Update lot status
  const lots = getAllLots();
  const lot = lots.find((l) => l.id === offer.lotId);
  if (!lot) return null;
  lot.status = "closed";
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
  save(TX_FILE, txs);

  return { offer, transaction: tx, lot };
}

// Transactions
export function getAllTransactions(): Transaction[] {
  return load(TX_FILE, seedTransactions);
}

// Demand posts
export function getAllDemands(): DemandPost[] {
  return load(DEMANDS_FILE, seedDemands);
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
  save(DEMANDS_FILE, demands);
  return demand;
}
