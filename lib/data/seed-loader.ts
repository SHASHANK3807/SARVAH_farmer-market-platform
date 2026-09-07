// lib/data/seed-loader.ts
// Loads seed JSON files. In a real app, this would be a DB query.

import type { PricePoint, Buyer, DemandPost, Lot, Offer, Transaction } from "@/lib/types";
import pricesData from "@/data/prices.seed.json";
import buyersData from "@/data/buyers.seed.json";
import demandsData from "@/data/demand-posts.seed.json";
import lotsData from "@/data/lots.seed.json";
import offersData from "@/data/offers.seed.json";
import transactionsData from "@/data/transactions.seed.json";

export const seedPrices = pricesData as PricePoint[];
export const seedBuyers = buyersData as Buyer[];
export const seedDemands = demandsData as DemandPost[];
export const seedLots = lotsData as Lot[];
export const seedOffers = offersData as Offer[];
export const seedTransactions = transactionsData as Transaction[];
