# SARVAH — Complete Vibe-Coding Build Document
**For:** Another AI agent (vibe-coding assistant)
**Project:** Maharashtra farm-gate price discovery + lightweight marketplace
**Hackathon:** 4-day internal round, Maharashtra State Innovation Society
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts + next-intl + zod
**Storage:** JSON files in `/data` (no DB setup; demo scope)
**Crops:** soybean, onion, tur
**Mandis:** Latur, Pune, Nashik, Solapur, Nagpur
**Languages:** English + Marathi (Marathi-first)
**Target:** 70% functional, 100% acknowledged (out of 18 spec items)

---

## ⚠️ CRITICAL INSTRUCTIONS FOR THE AGENT

**You are building this project from scratch. You do not know anything about it. Read this entire document before doing anything.**

1. **Do NOT skip steps.** Each phase builds on the previous one.
2. **Do NOT add features not in this doc.** Stick to the spec exactly.
3. **Test as you go.** Run the dev server after every phase to verify nothing broke.
4. **Use exact paths and filenames** as specified. The folder structure matters.
5. **Use TypeScript strictly.** No `any` types except where explicitly noted.
6. **All currency is INR (₹ / Rs).** Use Indian number formatting (1,00,000 not 100,000).
7. **No external paid services.** No real SMS, no real email, no real payments. Everything is mocked.
8. **The demo URL is `/en/farmer?crop=soybean&district=latur` and `/mr/farmer?crop=soybean&district=latur`.** Both must auto-load with seed data.
9. **Marathi translations are non-negotiable.** Every farmer-facing screen has Marathi strings.
10. **If something is unclear, follow the spirit of the spec, not the letter.** The user is doing a hackathon demo, not building a production app.

---

## 🎯 SIH Problem Statement #26132 Strategic Enhancements

To achieve top marks from Maharashtra State Innovation Society judges on PS #26132:
1. **Stronger FPO Aggregation**: Support an "FPO Aggregated Pool" lot option (`isFpoPool: true`) alongside individual farmer lots, demonstrating how smallholders pool volume for institutional buyers at a +₹100-150/q premium.
2. **Storage & Liquidity Constraint Handling**: Add a `hasStorage` toggle to the recommendation engine. If a farmer lacks storage, the engine warns against distress selling while recommending safe near-term liquidation or local warehouse pooling.
3. **Net Price Realization Heuristic**: Don't just show gross mandi prices. Use `mandiPrice - (distanceKm * ₹0.80/q)` to show net farm-gate realization so farmers aren't misled by distant markets.
4. **React 19 / Next.js Peer Dependency Care**: Use `--legacy-peer-deps` if installing packages like `next-intl` or `recharts` that have strict peer dependencies on older React versions.

---

**Folder structure you will create:**
```
sarvah/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # landing
│   │   ├── farmer/
│   │   │   ├── page.tsx                # farmer dashboard
│   │   │   └── lots/
│   │   │       ├── new/page.tsx        # lot creation form
│   │   │       └── [id]/page.tsx       # lot detail (farmer's view)
│   │   ├── buyer/
│   │   │   ├── page.tsx                # buyer landing
│   │   │   ├── demands/
│   │   │   │   ├── page.tsx            # my demands list
│   │   │   │   └── new/page.tsx        # post demand form
│   │   │   └── lots/
│   │   │       └── page.tsx            # browse lots (buyer view)
│   │   ├── lots/
│   │   │   ├── page.tsx                # public lot listings
│   │   │   └── [id]/page.tsx           # public lot detail
│   │   ├── transactions/
│   │   │   ├── page.tsx                # all transactions
│   │   │   └── [id]/page.tsx           # transaction detail
│   │   ├── roadmap/page.tsx            # deferred features
│   │   └── about/page.tsx              # data sources, team
│   └── api/
│       ├── prices/route.ts
│       ├── demand/route.ts
│       ├── lots/route.ts
│       ├── lots/[id]/route.ts
│       ├── offers/route.ts
│       ├── offers/[id]/accept/route.ts
│       └── recommend/route.ts
├── components/
│   ├── ui/                             # shadcn components
│   ├── farmer/
│   │   ├── PriceCard.tsx
│   │   ├── TrendChart.tsx
│   │   ├── RecommendationCard.tsx
│   │   ├── ActiveBuyersCard.tsx
│   │   └── CropDistrictSelector.tsx
│   ├── buyer/
│   │   ├── DemandForm.tsx
│   │   ├── OfferModal.tsx
│   │   └── LotCard.tsx
│   ├── lot/
│   │   ├── LotForm.tsx
│   │   └── LotBadge.tsx
│   ├── shared/
│   │   ├── LocaleToggle.tsx
│   │   ├── VerifiedBuyerBadge.tsx
│   │   └── ArrivalVolumeWidget.tsx
│   └── charts/
│       └── PriceTrendChart.tsx
├── lib/
│   ├── data/
│   │   ├── agmarknet.ts                # mock with seed fallback
│   │   ├── seed-loader.ts
│   │   └── store.ts                    # JSON file CRUD
│   ├── recommendation/
│   │   └── engine.ts                   # the rules engine
│   ├── distance.ts                     # basic distance heuristic
│   ├── types.ts                        # all TypeScript types
│   ├── utils.ts                        # cn(), formatters
│   └── i18n.ts                         # next-intl config
├── data/
│   ├── prices.seed.json                # 60d × 3 crops × 5 mandis
│   ├── buyers.seed.json
│   ├── demand-posts.seed.json
│   ├── lots.seed.json
│   ├── offers.seed.json
│   └── transactions.seed.json
├── messages/
│   ├── en.json
│   └── mr.json
├── public/
├── middleware.ts                       # locale routing
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local
└── README.md
```

---

# PHASE 0 — Pre-Work Setup (30 min)

## Goal
Initialize the project, install dependencies, set up folder structure.

## Files to create
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `next.config.mjs`
- `postcss.config.mjs`
- `.gitignore`
- `.env.local`

## Step-by-step

### Step 0.1 — Initialize Next.js
```bash
cd C:\Users\Poloj\sarvah
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm --no-eslint --no-turbopack
```
If the folder is non-empty (because of existing files like CHECKLIST.md), use:
```bash
mkdir sarvah-app && cd sarvah-app
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm --no-eslint --no-turbopack
```
Then move all the sarvah-app contents into the parent sarvah folder, or work inside sarvah-app. **Choose one location and stick to it.**

### Step 0.2 — Install dependencies
```bash
npm install recharts date-fns nuqs lucide-react zod
npm install next-intl
npx shadcn@latest init
```
When prompted by shadcn, choose: New York style, Slate base color, CSS variables yes.

### Step 0.3 — Install shadcn components we will need
```bash
npx shadcn@latest add button card input label select textarea badge dialog dropdown-menu form table tabs toast separator skeleton alert
```

### Step 0.4 — Create folder structure
Create all the empty directories listed in the structure above. Use:
```bash
mkdir -p app/\[locale\]/farmer/lots/new app/\[locale\]/farmer/lots/\[id\] app/\[locale\]/buyer/demands/new app/\[locale\]/buyer/lots app/\[locale\]/lots/\[id\] app/\[locale\]/transactions/\[id\] app/\[locale\]/roadmap app/\[locale\]/about app/api/prices app/api/demand app/api/lots/\[id\] app/api/offers/\[id\]/accept app/api/recommend components/ui components/farmer components/buyer components/lot components/shared components/charts lib/data lib/recommendation data messages
```

### Step 0.5 — Update `package.json` scripts
Make sure these scripts exist:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Verification checklist
- [ ] `npm run dev` starts without errors
- [ ] `http://localhost:3000` shows the default Next.js page
- [ ] All folders exist
- [ ] shadcn `components.json` exists at root

---

# PHASE 1 — Foundation: Types, i18n, Base Layout (Day 1, 2-3 hours)

## Goal
Set up TypeScript types, Marathi i18n configuration, base layout with locale toggle.

## Files to create
- `lib/types.ts`
- `lib/utils.ts`
- `lib/i18n.ts`
- `middleware.ts`
- `next.config.mjs` (update)
- `messages/en.json`
- `messages/mr.json`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx` (landing)
- `components/shared/LocaleToggle.tsx`
- `app/globals.css` (update with shadcn vars)

## Step 1.1 — `lib/types.ts` (the data contract)

Create this file with EXACT content:

```typescript
// lib/types.ts
// All TypeScript types for Sarvah. This is the single source of truth.

export type District = "Latur" | "Pune" | "Nashik" | "Solapur" | "Nagpur";
export type Crop = "soybean" | "onion" | "tur";
export type Grade = "A" | "B" | "C";
export type Locale = "en" | "mr";

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
```

## Step 1.2 — `lib/utils.ts`

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(iso: string, locale: "en" | "mr" = "en"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "mr" ? "mr-IN" : "en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysAgo(iso: string): number {
  const d = new Date(iso);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}
```

## Step 1.3 — `lib/i18n.ts`

```typescript
// lib/i18n.ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "mr"] as const;
export const defaultLocale = "en" as const;

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

## Step 1.4 — `middleware.ts`

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/lib/i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

## Step 1.5 — `next.config.mjs` (replace existing)

```javascript
// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
```

## Step 1.6 — `messages/en.json`

```json
{
  "common": {
    "appName": "Sarvah",
    "tagline": "Friend of the Market",
    "selectLanguage": "Select language",
    "english": "English",
    "marathi": "मराठी",
    "loading": "Loading…",
    "error": "Something went wrong",
    "retry": "Retry"
  },
  "landing": {
    "title": "Sarvah — Friend of the Market",
    "subtitle": "Decide when to sell. Decide to whom to sell. — for Maharashtra's smallholder farmers.",
    "farmerCta": "I am a farmer",
    "buyerCta": "I am a buyer",
    "problemHeading": "The problem",
    "problemText": "Small farmers sell at whatever price is offered, because they have zero visibility of prices at other mandis and zero way to know which buyer is offering a fair deal. They lose 10-15% on every sale."
  },
  "farmer": {
    "dashboard": "Farmer Dashboard",
    "selectCrop": "Select crop",
    "selectDistrict": "Select district",
    "todaysPrice": "Today's price",
    "vsYesterday": "vs yesterday",
    "trendChart": "30-day price trend",
    "recommendation": "What should I do?",
    "activeBuyers": "Active buyers for your crop",
    "noBuyers": "No active buyers right now. Check back tomorrow.",
    "createLot": "Create a lot",
    "myLots": "My lots",
    "arrivalsToday": "{qty} tons arrived at {district} today"
  },
  "recommendation": {
    "SELL_NOW": "SELL NOW",
    "WAIT_3_DAYS": "WAIT 3 DAYS",
    "WAIT_2_WEEKS": "WAIT 2 WEEKS",
    "HOLD": "HOLD",
    "confidence": "Confidence",
    "reasoningHeading": "Why?"
  },
  "lot": {
    "createTitle": "Create a new lot",
    "crop": "Crop",
    "qtyTons": "Quantity (tons)",
    "grade": "Grade",
    "askingPrice": "Asking price (₹/quintal)",
    "qualityNotes": "Quality notes",
    "location": "Your district",
    "submit": "Create lot",
    "submitting": "Creating…",
    "listingsTitle": "Available lots",
    "noLots": "No lots yet.",
    "detailTitle": "Lot details",
    "offersReceived": "Offers received",
    "noOffers": "No offers yet.",
    "makeOffer": "Make an offer",
    "viewOffers": "View offers"
  },
  "buyer": {
    "landing": "Buyer Portal",
    "postDemand": "Post a demand",
    "myDemands": "My demands",
    "browseLots": "Browse lots",
    "offerQty": "Quantity you want (tons)",
    "offerPrice": "Your offer price (₹/quintal)",
    "offerMessage": "Message to farmer",
    "submitOffer": "Submit offer",
    "deliveryWindow": "Delivery window (days from now)"
  },
  "demand": {
    "crop": "Crop you need",
    "qty": "Quantity (tons)",
    "priceMin": "Min price (₹/quintal)",
    "priceMax": "Max price (₹/quintal)",
    "grade": "Grade required",
    "district": "Delivery district",
    "submit": "Post demand"
  },
  "transaction": {
    "title": "Transactions",
    "noTransactions": "No transactions yet.",
    "closedOn": "Closed on",
    "parties": "Parties",
    "amount": "Total amount"
  },
  "badges": {
    "verified": "Verified",
    "fpo": "FPO",
    "freshnessWarning": "⚠️ Far — consider transport time"
  },
  "roadmap": {
    "title": "Roadmap — what's next",
    "subtitle": "Features we've deferred to Phase 2",
    "items": {
      "logistics": "Logistics coordination with real transport providers",
      "storage": "Storage finder (godowns, cold storage)",
      "escrow": "Payment escrow",
      "dispute": "Dispute resolution",
      "kyc": "Real KYC for buyers"
    }
  },
  "about": {
    "title": "About Sarvah",
    "dataSources": "Data sources",
    "dataSourcesText": "Mandi prices are based on Agmarknet data, with a fallback seed dataset for demo reliability. Buyer demand posts are seeded for the demo.",
    "marathiFirst": "Marathi-first design",
    "marathiFirstText": "Sarvah is designed Marathi-first. Every key screen is available in Marathi, and translations are not afterthoughts — they are first-class.",
    "team": "Team"
  }
}
```

## Step 1.7 — `messages/mr.json`

```json
{
  "common": {
    "appName": "सर्वह",
    "tagline": "बाजाराचा मित्र",
    "selectLanguage": "भाषा निवडा",
    "english": "English",
    "marathi": "मराठी",
    "loading": "लोड होत आहे…",
    "error": "काहीतरी चुकले",
    "retry": "पुन्हा प्रयत्न करा"
  },
  "landing": {
    "title": "सर्वह — बाजाराचा मित्र",
    "subtitle": "केव्हा विकायचे, कोणाला विकायचे — हे ठरवा. महाराष्ट्रातील लहान शेतकऱ्यांसाठी.",
    "farmerCta": "मी शेतकरी आहे",
    "buyerCta": "मी खरेदीदार आहे",
    "problemHeading": "समस्या",
    "problemText": "लहान शेतकरी कोणत्याही भावाने विकतात, कारण त्यांना इतर मंडींमधील भावांची माहिती नसते आणि कोणता खरेदीदार योग्य भाव देतोय हे कळत नाही. प्रत्येक विक्रीवर ते १०-१५% गमावतात."
  },
  "farmer": {
    "dashboard": "शेतकरी डॅशबोर्ड",
    "selectCrop": "पीक निवडा",
    "selectDistrict": "जिल्हा निवडा",
    "todaysPrice": "आजचा भाव",
    "vsYesterday": "कालच्या तुलनेत",
    "trendChart": "३० दिवसांचा भाव ट्रेंड",
    "recommendation": "मी काय करू?",
    "activeBuyers": "तुमच्या पिकासाठी सक्रिय खरेदीदार",
    "noBuyers": "आत्ता सक्रिय खरेदीदार नाहीत. उद्या पुन्हा बघा.",
    "createLot": "लॉट तयार करा",
    "myLots": "माझे लॉट",
    "arrivalsToday": "{district} मध्ये आज {qty} टन आले"
  },
  "recommendation": {
    "SELL_NOW": "आत्ता विका",
    "WAIT_3_DAYS": "३ दिवस थांबा",
    "WAIT_2_WEEKS": "२ आठवडे थांबा",
    "HOLD": "धरून ठेवा",
    "confidence": "विश्वास",
    "reasoningHeading": "का?"
  },
  "lot": {
    "createTitle": "नवीन लॉट तयार करा",
    "crop": "पीक",
    "qtyTons": "प्रमाण (टन)",
    "grade": "ग्रेड",
    "askingPrice": "मागणी भाव (₹/क्विंटल)",
    "qualityNotes": "गुणवत्ता नोंदी",
    "location": "तुमचा जिल्हा",
    "submit": "लॉट तयार करा",
    "submitting": "तयार होत आहे…",
    "listingsTitle": "उपलब्ध लॉट",
    "noLots": "अद्याप लॉट नाहीत.",
    "detailTitle": "लॉट तपशील",
    "offersReceived": "मिळालेल्या ऑफर्स",
    "noOffers": "अद्याप ऑफर नाही.",
    "makeOffer": "ऑफर द्या",
    "viewOffers": "ऑफर्स बघा"
  },
  "buyer": {
    "landing": "खरेदीदार पोर्टल",
    "postDemand": "मागणी नोंदवा",
    "myDemands": "माझ्या मागण्या",
    "browseLots": "लॉट ब्राउझ करा",
    "offerQty": "तुम्हाला हवे असलेले प्रमाण (टन)",
    "offerPrice": "तुमचा ऑफर भाव (₹/क्विंटल)",
    "offerMessage": "शेतकऱ्याला संदेश",
    "submitOffer": "ऑफर पाठवा",
    "deliveryWindow": "डिलिव्हरी विंडो (आजपासून दिवस)"
  },
  "demand": {
    "crop": "तुम्हाला हवे असलेले पीक",
    "qty": "प्रमाण (टन)",
    "priceMin": "किमान भाव (₹/क्विंटल)",
    "priceMax": "कक्षम भाव (₹/क्विंटल)",
    "grade": "आवश्यक ग्रेड",
    "district": "डिलिव्हरी जिल्हा",
    "submit": "मागणी नोंदवा"
  },
  "transaction": {
    "title": "व्यवहार",
    "noTransactions": "अद्याप व्यवहार नाहीत.",
    "closedOn": "बंद झाले",
    "parties": "पक्ष",
    "amount": "एकूण रक्कम"
  },
  "badges": {
    "verified": "सत्यापित",
    "fpo": "FPO",
    "freshnessWarning": "⚠️ दूर — वाहतूक वेळ विचारात घ्या"
  },
  "roadmap": {
    "title": "रोडमॅप — पुढे काय",
    "subtitle": "आम्ही Phase 2 साठी पुढे ढकललेली वैशिष्ट्ये",
    "items": {
      "logistics": "वास्तव वाहतूक प्रदात्यांसह समन्वय",
      "storage": "स्टोरेज शोधक (गोदाम, कोल्ड स्टोरेज)",
      "escrow": "पेमेंट एस्क्रो",
      "dispute": "विवाद निराकरण",
      "kyc": "खरेदीदारांसाठी वास्तव KYC"
    }
  },
  "about": {
    "title": "सर्वह बद्दल",
    "dataSources": "डेटा स्रोत",
    "dataSourcesText": "मंडी भाव हे Agmarknet डेटावर आधारित आहेत, डेमो विश्वासार्हतेसाठी सीड डेटासेटसह. खरेदीदार मागणी नोंदी डेमोसाठी सीड केलेल्या आहेत.",
    "marathiFirst": "मराठी-प्रथम डिझाइन",
    "marathiFirstText": "सर्वह मराठी-प्रथम डिझाइन केलेले आहे. प्रत्येक महत्त्वाचा स्क्रीन मराठीत उपलब्ध आहे, आणि अनुवाद नंतरचे नाहीत — ते प्रथम श्रेणीचे आहेत.",
    "team": "टीम"
  }
}
```

## Step 1.8 — `app/[locale]/layout.tsx`

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import Link from "next/link";
import "../globals.css";

export const metadata = {
  title: "Sarvah — Friend of the Market",
  description: "Maharashtra farm-gate price discovery and marketplace for smallholders.",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href={`/${locale}`} className="text-xl font-bold text-primary">
                Sarvah
              </Link>
              <nav className="flex gap-4 items-center">
                <Link href={`/${locale}/farmer`} className="text-sm hover:underline">
                  Farmer
                </Link>
                <Link href={`/${locale}/buyer`} className="text-sm hover:underline">
                  Buyer
                </Link>
                <LocaleToggle />
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Step 1.9 — `app/[locale]/page.tsx` (landing)

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const t = useTranslations();
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{t("landing.title")}</h1>
      <p className="text-lg text-muted-foreground mb-8">{t("landing.subtitle")}</p>
      <div className="flex gap-4 mb-12">
        <Button asChild size="lg">
          <Link href="/en/farmer?crop=soybean&district=latur">{t("landing.farmerCta")}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/en/buyer">{t("landing.buyerCta")}</Link>
        </Button>
      </div>
      <section className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">{t("landing.problemHeading")}</h2>
        <p>{t("landing.problemText")}</p>
      </section>
    </div>
  );
}
```

## Step 1.10 — `components/shared/LocaleToggle.tsx`

```typescript
// components/shared/LocaleToggle.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = currentLocale === "en" ? "mr" : "en";
  const newPath = pathname.replace(`/${currentLocale}`, `/${switchTo}`);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(newPath)}
    >
      {switchTo === "en" ? "English" : "मराठी"}
    </Button>
  );
}
```

## Step 1.11 — Move `app/page.tsx` (the default Next.js page)
Delete the default `app/page.tsx` if it exists (we are using `app/[locale]/page.tsx` instead).

## Step 1.12 — Update `app/globals.css`
Make sure shadcn's CSS variables are in place. The `npx shadcn@latest init` should have done this. Verify by checking the file contains:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root { ... }
  .dark { ... }
}
```

## Verification checklist
- [ ] `http://localhost:3000` redirects to `/en` automatically
- [ ] `http://localhost:3000/mr` shows Marathi landing page
- [ ] LocaleToggle button switches between `/en` and `/mr`
- [ ] Landing page shows "Sarvah — Friend of the Market" in English, "सर्वह — बाजाराचा मित्र" in Marathi
- [ ] No TypeScript errors in terminal

---

(Document continues in subsequent files. See README in build folder for next phases.)

---

# PHASE 2 — Data Layer: Seed Data, JSON Store, Agmarknet Mock (Day 1, 3-4 hours)

## Goal
Generate realistic seed data (60 days × 3 crops × 5 mandis = 900 price points), seed buyers/demands/lots, and build a JSON file CRUD store with Agmarknet mock fallback.

## Files to create
- `data/prices.seed.json`
- `data/buyers.seed.json`
- `data/demand-posts.seed.json`
- `data/lots.seed.json`
- `data/offers.seed.json`
- `data/transactions.seed.json`
- `lib/data/seed-loader.ts`
- `lib/data/store.ts`
- `lib/data/agmarknet.ts`
- `lib/distance.ts`
- `scripts/generate-seed.ts` (one-time script)

## Step 2.1 — `scripts/generate-seed.ts`

This script generates all seed JSON files. **Run it once, then commit the JSON files.**

```typescript
// scripts/generate-seed.ts
// Run with: npx tsx scripts/generate-seed.ts
// This generates all seed JSON files in /data folder.

import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
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
  Latur: 0.95,    // slightly below average
  Pune: 1.05,     // premium
  Nashik: 1.02,
  Solapur: 0.98,
  Nagpur: 1.08,   // highest
};

// Crop seasonality (some crops are seasonal — prices spike in certain months)
function seasonality(date: Date, crop: Crop): number {
  const day = date.getDate();
  const month = date.getMonth(); // 0-11
  if (crop === "onion" && (month === 7 || month === 8)) return 1.15; // Aug-Sep onion scarcity
  if (crop === "tur" && (month === 10 || month === 11)) return 0.90;  // Oct-Nov harvest
  if (crop === "soybean" && (month === 8 || month === 9)) return 1.05; // Sep-Oct lean
  return 1.0;
}

// Generate 60 days of prices (last 60 days from today)
function generatePrices(): PricePoint[] {
  const points: PricePoint[] = [];
  const today = new Date("2026-09-06"); // Fixed for demo
  for (let d = 60; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    for (const crop of CROPS) {
      for (const district of DISTRICTS) {
        const base = BASE_PRICES[crop] * DISTRICT_MOD[district];
        const seasonal = seasonality(date, crop);
        // 30-day trend: add slight drift
        const drift = 1 + (d / 60 - 0.5) * 0.08; // ±4% drift
        // Random noise ±2%
        const noise = 0.98 + Math.random() * 0.04;
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
    { id: "b1", name: "Rajan Traders", organization: "Rajan & Sons", district: "Pune", verified: true, fpo: false, trustScore: 92, criteriaNotes: "APMC licensed, 12 years trading, settled payments" },
    { id: "b2", name: "Latur FPO", organization: "Latur Farmer Producer Org", district: "Latur", verified: true, fpo: true, trustScore: 88, criteriaNotes: "FPO registered, member of 200+ farmers" },
    { id: "b3", name: "Nashik Wholesale", organization: "Nashik Wholesale Co", district: "Nashik", verified: false, fpo: false, trustScore: 65, criteriaNotes: "New buyer, partial verification" },
    { id: "b4", name: "Solapur Spices", organization: "Solapur Spice Trading", district: "Solapur", verified: false, fpo: false, trustScore: 58, criteriaNotes: "Limited history" },
    { id: "b5", name: "Vidarbha Mills", organization: "Vidarbha Mills Pvt Ltd", district: "Nagpur", verified: true, fpo: false, trustScore: 95, criteriaNotes: "Large processor, settled payments, A-grade only" },
  ];
}

function generateDemandPosts(): DemandPost[] {
  return [
    { id: "d1", buyerId: "b1", crop: "soybean", district: "Latur", qtyTons: 10, priceMinPerQuintal: 4300, priceMaxPerQuintal: 4500, grade: "A", deliveryWindowDays: 7, createdAt: "2026-09-04", status: "open" },
    { id: "d2", buyerId: "b2", crop: "soybean", district: "Latur", qtyTons: 5, priceMinPerQuintal: 4250, priceMaxPerQuintal: 4350, grade: "B", deliveryWindowDays: 10, createdAt: "2026-09-05", status: "open" },
    { id: "d3", buyerId: "b3", crop: "onion", district: "Nashik", qtyTons: 8, priceMinPerQuintal: 3800, priceMaxPerQuintal: 4000, grade: "A", deliveryWindowDays: 5, createdAt: "2026-09-03", status: "open" },
    { id: "d4", buyerId: "b5", crop: "tur", district: "Nagpur", qtyTons: 15, priceMinPerQuintal: 5600, priceMaxPerQuintal: 5800, grade: "A", deliveryWindowDays: 14, createdAt: "2026-09-05", status: "open" },
    { id: "d5", buyerId: "b4", crop: "soybean", district: "Latur", qtyTons: 20, priceMinPerQuintal: 4100, priceMaxPerQuintal: 4300, grade: "C", deliveryWindowDays: 7, createdAt: "2026-09-02", status: "open" },
  ];
}

function generateLots(): Lot[] {
  return [
    { id: "L1", crop: "soybean", qtyTons: 10, grade: "A", askingPricePerQuintal: 4400, qualityNotes: "No pests, harvested 3 days ago, sun-dried", district: "Latur", farmerName: "Priya Patil", farmerId: "f1", createdAt: "2026-09-05", status: "open" },
    { id: "L2", crop: "onion", qtyTons: 5, grade: "B", askingPricePerQuintal: 3800, qualityNotes: "Mixed sizes, freshly harvested", district: "Pune", farmerName: "Suresh Deshmukh", farmerId: "f2", createdAt: "2026-09-04", status: "open" },
    { id: "L3", crop: "tur", qtyTons: 8, grade: "A", askingPricePerQuintal: 5700, qualityNotes: "Premium quality, organic certified", district: "Nagpur", farmerName: "Anil Wankhede", farmerId: "f3", createdAt: "2026-09-05", status: "open" },
  ];
}

function generateOffers() {
  return [
    { id: "O1", lotId: "L1", buyerId: "b1", pricePerQuintal: 4350, qtyTons: 10, message: "Ready to pick up in 2 days", createdAt: "2026-09-05", status: "pending" },
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
```

## Step 2.2 — Run the seed script

```bash
npx tsx scripts/generate-seed.ts
```

This creates all 6 JSON files. **Verify the output**:
- `prices.seed.json` should have ~900 price points
- `buyers.seed.json` should have 5 buyers
- `demand-posts.seed.json` should have 5 demands
- `lots.seed.json` should have 3 sample lots
- `offers.seed.json` should have 1 offer on L1
- `transactions.seed.json` should be empty `[]`

## Step 2.3 — `lib/data/seed-loader.ts`

```typescript
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
```

## Step 2.4 — `lib/data/agmarknet.ts`

```typescript
// lib/data/agmarknet.ts
// Mock of Agmarknet data fetcher. In production, this would scrape or call API.
// For demo, we just return the latest seed price for the given crop+district.

import { seedPrices } from "./seed-loader";
import type { PricePoint } from "@/lib/types";

export async function fetchLatestPrice(
  crop: string,
  district: string
): Promise<PricePoint | null> {
  // Try real fetch (would be an HTTP call). For demo, simulate failure and fall back.
  // Simulate the "real fetch" failing 30% of the time, so the fallback path is exercised.
  // const res = await fetch(`https://api.example.com/price?crop=${crop}&district=${district}`);
  // if (!res.ok) throw new Error("agmarknet down");
  // return await res.json();

  // Demo path: return latest from seed
  const filtered = seedPrices.filter(
    (p) => p.crop === crop && p.district === district
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
    .filter((p) => p.crop === crop && p.district === district)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-days);
  return filtered;
}
```

## Step 2.5 — `lib/data/store.ts`

```typescript
// lib/data/store.ts
// JSON file CRUD. Reads from seed JSON, writes to runtime JSON (in-memory + fs).
// In production, replace with Prisma or similar.

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
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
  return seed;
}

function save<T>(file: string, data: T[]) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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
  crop?: string; district?: string;
}): Lot[] {
  return getAllLots()
    .filter((l) => l.status === "open")
    .filter((l) => !filters?.crop || l.crop === filters.crop)
    .filter((l) => !filters?.district || l.district === filters.district);
}
export function createLot(data: Omit<Lot, "id" | "createdAt" | "status">): Lot {
  const lot: Lot = {
    ...data,
    id: `L${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "open",
  };
  const lots = getAllLots();
  lots.push(lot);
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
  offers.push(offer);
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

  // Create transaction
  const tx: Transaction = {
    id: `T${randomUUID().slice(0, 8)}`,
    lotId: lot.id,
    offerId: offer.id,
    buyerId: offer.buyerId,
    farmerId: lot.farmerId,
    finalPricePerQuintal: offer.pricePerQuintal,
    qtyTons: offer.qtyTons,
    totalAmount: offer.pricePerQuintal * offer.qtyTons * 10, // 1 ton = 10 quintals
    closedAt: new Date().toISOString(),
  };
  const txs = getAllTransactions();
  txs.push(tx);
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
    .filter((d) => d.crop === crop)
    .filter((d) => d.district === district)
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
  demands.push(demand);
  demandsCache = demands;
  save(DEMANDS_FILE, demands);
  return demand;
}
```

## Step 2.6 — `lib/distance.ts`

```typescript
// lib/distance.ts
// Basic distance heuristic — district-level, not real geocoding.

import type { District, DistanceInfo } from "@/lib/types";

const DISTANCE_MATRIX: Record<District, Record<District, number>> = {
  Latur:  { Latur: 0,   Pune: 180, Nashik: 250, Solapur: 150, Nagpur: 350 },
  Pune:   { Latur: 180, Pune: 0,   Nashik: 150, Solapur: 200, Nagpur: 300 },
  Nashik: { Latur: 250, Pune: 150, Nashik: 0,   Solapur: 250, Nagpur: 400 },
  Solapur:{ Latur: 150, Pune: 200, Nashik: 250, Solapur: 0,   Nagpur: 350 },
  Nagpur: { Latur: 350, Pune: 300, Nashik: 400, Solapur: 350, Nagpur: 0 },
};

export function getDistanceInfo(
  from: District,
  to: District,
  mandiPrice?: number
): DistanceInfo {
  const km = DISTANCE_MATRIX[from]?.[to] ?? 100;
  const transportCost = Math.round(km * 0.8); // avg ₹0.80 per quintal per km in MH freight
  return {
    km,
    warning: km > 50,
    label: km > 50 ? `⚠️ Far (~${km} km) — freight ~₹${transportCost}/q` : `~${km} km (local)`,
    estimatedTransportCostPerQuintal: transportCost,
    netRealizationPerQuintal: mandiPrice ? mandiPrice - transportCost : undefined,
  };
}
```

## Step 2.7 — `scripts/generate-seed.ts` runner

Add to `package.json`:
```json
"scripts": {
  "seed": "tsx scripts/generate-seed.ts"
}
```

Then run:
```bash
npm run seed
```

## Verification checklist
- [ ] All 6 JSON files in `/data` exist and have content
- [ ] `prices.seed.json` has ~900 entries (61 days × 15 crop-district combos)
- [ ] `getAllLots()` returns 3 sample lots
- [ ] `getMatchingDemands("soybean", "Latur")` returns 3 demands
- [ ] `getDistanceInfo("Latur", "Pune")` returns `{km: 180, warning: true, label: "⚠️ Far — consider transport"}`
- [ ] No TypeScript errors in `lib/data/store.ts`

---

# PHASE 3 — Recommendation Engine (Day 1-2, 2-3 hours)

## Goal
Build the rules engine that tells farmers SELL/WAIT based on percentile, 7-day trend, and seasonality.

## Files to create
- `lib/recommendation/engine.ts`
- `app/api/recommend/route.ts`

## Step 3.1 — `lib/recommendation/engine.ts`

```typescript
// lib/recommendation/engine.ts
// The rules engine. Returns SELL_NOW / WAIT_3_DAYS / WAIT_2_WEEKS / HOLD
// with reasoning in English and Marathi.

import type {
  RecommendationResult, RecommendationAction, PricePoint, Crop, District,
} from "@/lib/types";

interface RecommendInput {
  crop: Crop;
  district: District;
  history: PricePoint[];      // 60 days, sorted ascending by date
  hasStorage?: boolean;       // whether farmer has storage/warehouse (defaults to true)
}

export function recommend(input: RecommendInput): RecommendationResult {
  const { history, hasStorage = true } = input;
  if (history.length < 8) {
    return {
      action: "HOLD",
      confidence: 0.3,
      reasoning: ["Not enough price history to make a recommendation."],
      reasoningMr: ["शिफारस करण्यासाठी पुरेसा भाव इतिहास नाही."],
      currentPrice: history.at(-1)?.pricePerQuintal ?? 0,
      percentile: 50,
      trend7d: "flat",
      seasonalityHint: "Unknown",
    };
  }

  const current = history.at(-1)!.pricePerQuintal;
  const sorted = [...history.map((p) => p.pricePerQuintal)].sort((a, b) => a - b);
  const rank = sorted.findIndex((p) => p === current);
  const percentile = Math.round((rank / (sorted.length - 1)) * 100);

  // 7-day trend: compare today vs 7 days ago
  const sevenDaysAgo = history.at(-8)?.pricePerQuintal ?? current;
  const trendPct = ((current - sevenDaysAgo) / sevenDaysAgo) * 100;
  const trend7d: "up" | "down" | "flat" =
    trendPct > 2 ? "up" : trendPct < -2 ? "down" : "flat";

  // Seasonality hint
  const month = new Date(history.at(-1)!.date).getMonth();
  const seasonalityHint = getSeasonalityHint(input.crop, month);

  // Build reasoning
  const reasoning: string[] = [];
  const reasoningMr: string[] = [];

  // Rule 1: Percentile
  if (percentile >= 80) {
    reasoning.push(
      `Today's price (₹${current.toLocaleString("en-IN")}) is in the top 20% of the last 60 days.`
    );
    reasoningMr.push(
      `आजचा भाव (₹${current.toLocaleString("en-IN")}) गेल्या 60 दिवसांत सर्वात वरच्या 20% मध्ये आहे.`
    );
  } else if (percentile <= 30) {
    reasoning.push(
      `Today's price is in the bottom 30% — consider waiting.`
    );
    reasoningMr.push(
      `आजचा भाव तळाच्या 30% मध्ये आहे — थांबण्याचा विचार करा.`
    );
  } else {
    reasoning.push(`Today's price is in the middle range.`);
    reasoningMr.push(`आजचा भाव मध्यम श्रेणीत आहे.`);
  }

  // Rule 2: Trend
  if (trend7d === "up") {
    reasoning.push(
      `Price has risen ${trendPct.toFixed(1)}% in the last 7 days — trend is positive.`
    );
    reasoningMr.push(
      `गेल्या 7 दिवसांत भाव ${trendPct.toFixed(1)}% वाढला — ट्रेंड सकारात्मक आहे.`
    );
  } else if (trend7d === "down") {
    reasoning.push(
      `Price has fallen ${Math.abs(trendPct).toFixed(1)}% in the last 7 days — consider selling before it drops further.`
    );
    reasoningMr.push(
      `गेल्या 7 दिवसांत भाव ${Math.abs(trendPct).toFixed(1)}% घसरला — आणखी घसरण्यापूर्वी विक्री करा.`
    );
  } else {
    reasoning.push(`Price is stable over the last 7 days.`);
    reasoningMr.push(`गेल्या 7 दिवसांत भाव स्थिर आहे.`);
  }

  // Rule 3: Seasonality
  reasoning.push(seasonalityHint.en);
  reasoningMr.push(seasonalityHint.mr);

  // Decide action
  let action: RecommendationAction;
  let confidence: number;
  let storageWarning = false;

  if (percentile >= 80 && trend7d !== "up") {
    // Top 20% price, not rising — sell now
    action = "SELL_NOW";
    confidence = 0.85;
  } else if (percentile >= 80 && trend7d === "up") {
    // Top 20% but still rising — could wait for more
    action = "WAIT_3_DAYS";
    confidence = 0.7;
  } else if (percentile <= 30 && trend7d === "down") {
    // Bottom 30% and falling — bad situation, hold if you can
    action = "WAIT_2_WEEKS";
    confidence = 0.65;
  } else if (percentile <= 30 && trend7d === "up") {
    // Bottom 30% but rising — could wait
    action = "WAIT_3_DAYS";
    confidence = 0.7;
  } else if (trend7d === "down" && percentile >= 50) {
    // Middle-to-high and falling — sell before it drops
    action = "SELL_NOW";
    confidence = 0.7;
  } else {
    action = "HOLD";
    confidence = 0.5;
  }

  // Storage / Liquidity constraint adjustment (SIH PS #26132)
  if (!hasStorage && (action === "WAIT_2_WEEKS" || action === "WAIT_3_DAYS")) {
    storageWarning = true;
    if (percentile >= 45) {
      action = "SELL_NOW";
      confidence = 0.8;
      reasoning.unshift(
        "⚠️ Storage constraint active: Holding without proper storage risks moisture/pest loss. Sell now at current rate."
      );
      reasoningMr.unshift(
        "⚠️ साठवणूक मर्यादा: साठवणूक सोय नसल्याने माल रोखून ठेवल्यास नासाडी होण्याचा धोका आहे. सध्याच्या दरात विक्री करा."
      );
    } else {
      reasoning.unshift(
        "⚠️ Limited storage: Consider pooling with local FPO warehouse to avoid distress sale."
      );
      reasoningMr.unshift(
        "⚠️ मर्यादित साठवणूक: पडत्या भावात विक्री टाळण्यासाठी स्थानिक FPO गोदामात साठा करण्याचा विचार करा."
      );
    }
  }

  return {
    action,
    confidence,
    reasoning,
    reasoningMr,
    currentPrice: current,
    percentile,
    trend7d,
    seasonalityHint: seasonalityHint.en,
    storageWarning,
  };
}

function getSeasonalityHint(crop: Crop, month: number): { en: string; mr: string } {
  // month: 0 = Jan, 11 = Dec
  if (crop === "onion" && (month === 7 || month === 8)) {
    return {
      en: "Onion prices typically spike in Aug-Sep due to lean supply.",
      mr: "ऑगस्ट-सप्टेंबरमध्ये कांद्याचे भाव सहसा वाढतात कारण पुरवठा कमी असतो.",
    };
  }
  if (crop === "tur" && (month === 10 || month === 11)) {
    return {
      en: "Tur harvest in Oct-Nov usually lowers prices.",
      mr: "ऑक्टोबर-नोव्हेंबरमध्ये तूर काढणी सहसा भाव कमी करते.",
    };
  }
  if (crop === "soybean" && (month === 8 || month === 9)) {
    return {
      en: "Soybean prices often firm up in Sep-Oct as supply tightens.",
      mr: "सप्टेंबर-ऑक्टोबरमध्ये सोयाबीनचे भाव सहसा वाढतात कारण पुरवठा कमी होतो.",
    };
  }
  return {
    en: "No strong seasonal signal for this period.",
    mr: "या काळात कोणतेही मजबूत हंगामी संकेत नाहीत.",
  };
}
```

## Step 3.2 — `app/api/recommend/route.ts`

```typescript
// app/api/recommend/route.ts
import { NextResponse } from "next/server";
import { fetchPriceHistory } from "@/lib/data/agmarknet";
import { recommend } from "@/lib/recommendation/engine";
import type { Crop, District } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") as Crop;
  const district = searchParams.get("district") as District;

  if (!crop || !district) {
    return NextResponse.json({ error: "crop and district required" }, { status: 400 });
  }

  const history = await fetchPriceHistory(crop, district, 60);
  const result = recommend({ crop, district, history });
  return NextResponse.json(result);
}
```

## Verification checklist
- [ ] `GET /api/recommend?crop=soybean&district=Latur` returns a `RecommendationResult`
- [ ] The result has `action`, `confidence`, `reasoning`, `reasoningMr`, `currentPrice`, `percentile`, `trend7d`
- [ ] For Sep 2026 seed data, soybean/Latur should return a sensible action
- [ ] Marathi reasoning strings are present and non-empty
- [ ] Engine handles edge case of < 8 days of history (returns HOLD with low confidence)

---

# (CONTINUED — next: PHASE 4 — API Routes)

---

# PHASE 4 — API Routes (Day 2, 2-3 hours)

## Goal
Build all backend API routes for prices, demand, lots, offers, transactions.

## Files to create
- `app/api/prices/route.ts`
- `app/api/demand/route.ts`
- `app/api/lots/route.ts`
- `app/api/lots/[id]/route.ts`
- `app/api/offers/route.ts`
- `app/api/offers/[id]/accept/route.ts`

## Step 4.1 — `app/api/prices/route.ts`

```typescript
// app/api/prices/route.ts
// GET /api/prices?crop=&district=&days=30
// Returns price history for a crop+district combo.

import { NextResponse } from "next/server";
import { fetchPriceHistory } from "@/lib/data/agmarknet";
import { seedPrices } from "@/lib/data/seed-loader";
import type { Crop, District } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") as Crop;
  const district = searchParams.get("district") as District;
  const days = parseInt(searchParams.get("days") || "30", 10);

  if (!crop || !district) {
    return NextResponse.json({ error: "crop and district required" }, { status: 400 });
  }

  const history = await fetchPriceHistory(crop, district, days);
  const latest = history.at(-1) ?? null;
  const yesterday = history.at(-2) ?? null;
  const changeVsYesterday = latest && yesterday
    ? latest.pricePerQuintal - yesterday.pricePerQuintal
    : 0;

  // Also return "other mandis" so farmer can compare
  const otherMandis = seedPrices
    .filter((p) => p.crop === crop)
    .filter((p) => p.district !== district)
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
```

## Step 4.2 — `app/api/demand/route.ts`

```typescript
// app/api/demand/route.ts
// GET /api/demand?crop=&district=  → matching demand posts
// GET /api/demand?buyerId=         → all demands by a buyer
// POST /api/demand                 → create a new demand post

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getMatchingDemands, getDemandsByBuyer, createDemand,
} from "@/lib/data/store";
import type { Crop, District, Grade } from "@/lib/types";

const DemandSchema = z.object({
  buyerId: z.string(),
  crop: z.enum(["soybean", "onion", "tur"]),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  qtyTons: z.number().positive().max(1000),
  priceMinPerQuintal: z.number().positive().max(100000),
  priceMaxPerQuintal: z.number().positive().max(100000),
  grade: z.enum(["A", "B", "C"]),
  deliveryWindowDays: z.number().int().positive().max(60),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") as Crop | null;
  const district = searchParams.get("district") as District | null;
  const buyerId = searchParams.get("buyerId");

  if (buyerId) {
    return NextResponse.json(getDemandsByBuyer(buyerId));
  }
  if (crop && district) {
    return NextResponse.json(getMatchingDemands(crop, district));
  }
  return NextResponse.json({ error: "crop+district or buyerId required" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = DemandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const demand = createDemand(parsed.data);
  return NextResponse.json(demand, { status: 201 });
}
```

## Step 4.3 — `app/api/lots/route.ts`

```typescript
// app/api/lots/route.ts
// GET /api/lots?crop=&district=  → all open lots, optionally filtered
// POST /api/lots                 → create a new lot

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenLots, createLot } from "@/lib/data/store";
import type { Crop, District, Grade } from "@/lib/types";

const LotSchema = z.object({
  crop: z.enum(["soybean", "onion", "tur"]),
  qtyTons: z.number().positive().max(1000),
  grade: z.enum(["A", "B", "C"]),
  askingPricePerQuintal: z.number().positive().max(100000),
  qualityNotes: z.string().max(500).optional().default(""),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  farmerName: z.string().min(1).max(100),
  farmerId: z.string().min(1),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get("crop") || undefined;
  const district = searchParams.get("district") || undefined;
  const farmerId = searchParams.get("farmerId") || undefined;

  if (farmerId) {
    const { getLotsByFarmer } = await import("@/lib/data/store");
    return NextResponse.json(getLotsByFarmer(farmerId));
  }
  return NextResponse.json(getOpenLots({ crop, district }));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const lot = createLot(parsed.data);
  return NextResponse.json(lot, { status: 201 });
}
```

## Step 4.4 — `app/api/lots/[id]/route.ts`

```typescript
// app/api/lots/[id]/route.ts
// GET /api/lots/[id]  → single lot detail with offers + distance info

import { NextResponse } from "next/server";
import { getLot, getOffersForLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { getDistanceInfo } from "@/lib/distance";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const lot = getLot(params.id);
  if (!lot) {
    return NextResponse.json({ error: "lot not found" }, { status: 404 });
  }

  const offers = getOffersForLot(lot.id);

  // Attach buyer info to offers
  const offersWithBuyers = offers.map((o) => {
    const buyer = seedBuyers.find((b) => b.id === o.buyerId);
    return { ...o, buyer };
  });

  // Distance: from farmer's district to a hypothetical "Latur" buyer (default for demo)
  // In a real app, the buyer's district would be known from their session.
  const distance = getDistanceInfo(lot.district, "Latur");

  return NextResponse.json({
    ...lot,
    offers: offersWithBuyers,
    distance,
  });
}
```

## Step 4.5 — `app/api/offers/route.ts`

```typescript
// app/api/offers/route.ts
// GET /api/offers?lotId=  → all offers for a lot
// POST /api/offers         → create a new offer

import { NextResponse } from "next/server";
import { z } from "zod";
import { getOffersForLot, createOffer } from "@/lib/data/store";

const OfferSchema = z.object({
  lotId: z.string(),
  buyerId: z.string(),
  pricePerQuintal: z.number().positive().max(100000),
  qtyTons: z.number().positive().max(1000),
  message: z.string().max(500).optional().default(""),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lotId = searchParams.get("lotId");
  if (!lotId) {
    return NextResponse.json({ error: "lotId required" }, { status: 400 });
  }
  return NextResponse.json(getOffersForLot(lotId));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = OfferSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const offer = createOffer(parsed.data);
  return NextResponse.json(offer, { status: 201 });
}
```

## Step 4.6 — `app/api/offers/[id]/accept/route.ts`

```typescript
// app/api/offers/[id]/accept/route.ts
// POST /api/offers/[id]/accept
// Accepts an offer, closes the lot, creates a transaction.

import { NextResponse } from "next/server";
import { acceptOffer } from "@/lib/data/store";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = acceptOffer(params.id);
  if (!result) {
    return NextResponse.json({ error: "offer not found" }, { status: 404 });
  }
  return NextResponse.json({
    offer: result.offer,
    transaction: result.transaction,
    lot: result.lot,
  });
}
```

## Verification checklist
- [ ] `GET /api/prices?crop=soybean&district=Latur&days=30` returns price history
- [ ] `GET /api/demand?crop=soybean&district=Latur` returns 3 demand posts
- [ ] `GET /api/lots` returns 3 open lots
- [ ] `GET /api/lots/L1` returns lot detail with offers and distance info
- [ ] `POST /api/lots` with valid body creates a new lot
- [ ] `POST /api/lots` with invalid body (e.g., qtyTons: -5) returns 400
- [ ] `POST /api/offers/O1/accept` creates a transaction and closes lot L1

---

# PHASE 5 — Farmer Experience (Day 2, 4-5 hours — HERO PHASE)

## Goal
Build the farmer dashboard with crop/district selector, price comparison, 30-day trend chart, recommendation card, and active buyers section. This is the HERO feature.

## Files to create
- `app/[locale]/farmer/page.tsx`
- `components/farmer/CropDistrictSelector.tsx`
- `components/farmer/PriceCard.tsx`
- `components/farmer/TrendChart.tsx`
- `components/charts/PriceTrendChart.tsx` (Recharts wrapper)
- `components/farmer/RecommendationCard.tsx`
- `components/farmer/ActiveBuyersCard.tsx`
- `components/shared/ArrivalVolumeWidget.tsx`

## Step 5.1 — `components/farmer/CropDistrictSelector.tsx`

```typescript
// components/farmer/CropDistrictSelector.tsx
"use client";
import { useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

export function CropDistrictSelector() {
  const t = useTranslations("farmer");
  const [crop, setCrop] = useQueryState("crop", { defaultValue: "soybean" });
  const [district, setDistrict] = useQueryState("district", { defaultValue: "latur" });

  const districtCap = district.charAt(0).toUpperCase() + district.slice(1);
  const cropLower = crop.toLowerCase();

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm text-muted-foreground">{t("selectCrop")}</label>
        <Select value={cropLower} onValueChange={(v) => setCrop(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="soybean">Soybean</SelectItem>
            <SelectItem value="onion">Onion</SelectItem>
            <SelectItem value="tur">Tur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm text-muted-foreground">{t("selectDistrict")}</label>
        <Select value={district} onValueChange={(v) => setDistrict(v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="latur">Latur</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
            <SelectItem value="nashik">Nashik</SelectItem>
            <SelectItem value="solapur">Solapur</SelectItem>
            <SelectItem value="nagpur">Nagpur</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

## Step 5.2 — `components/farmer/PriceCard.tsx`

```typescript
// components/farmer/PriceCard.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PriceCard({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1);
  const { data, error } = useSWR(
    `/api/prices?crop=${crop}&district=${districtCap}&days=30`,
    fetcher
  );

  if (error) return <Card><CardContent>Error loading price</CardContent></Card>;
  if (!data) return <Card><CardContent className="animate-pulse h-24" /></Card>;

  const { latest, changeVsYesterday, otherMandis } = data;
  const changeColor = changeVsYesterday > 0 ? "text-green-600" : changeVsYesterday < 0 ? "text-red-600" : "text-gray-600";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{crop} — {districtCap} {t("todaysPrice")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-2">{formatINR(latest?.pricePerQuintal ?? 0)}</div>
        <div className={`text-sm ${changeColor}`}>
          {changeVsYesterday > 0 ? "▲" : changeVsYesterday < 0 ? "▼" : "—"} {formatINR(Math.abs(changeVsYesterday))} {t("vsYesterday")}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm font-semibold mb-2">Other mandis:</div>
          <div className="space-y-1">
            {Object.entries(otherMandis).map(([m, info]: [string, any]) => (
              <div key={m} className="flex justify-between text-sm">
                <span>{m}</span>
                <span className="font-medium">{formatINR(info.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Step 5.3 — `components/charts/PriceTrendChart.tsx`

```bash
npm install swr
```

```typescript
// components/charts/PriceTrendChart.tsx
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatINR } from "@/lib/utils";

export function PriceTrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground">No trend data</div>;

  // Format date for X axis
  const formatted = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" fontSize={11} />
        <YAxis
          tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
          fontSize={11}
        />
        <Tooltip
          formatter={(value: any) => formatINR(value)}
          labelStyle={{ color: "#000" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="pricePerQuintal"
          stroke="#1f4e79"
          strokeWidth={2}
          dot={false}
          name="Price"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## Step 5.4 — `components/farmer/TrendChart.tsx`

```typescript
// components/farmer/TrendChart.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function TrendChart({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1);
  const { data, error } = useSWR(
    `/api/prices?crop=${crop}&district=${districtCap}&days=30`,
    fetcher
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("trendChart")} — {crop} at {districtCap}</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? <p>Error</p> :
         !data ? <div className="h-64 animate-pulse bg-muted rounded" /> :
         <PriceTrendChart data={data.history} />}
      </CardContent>
    </Card>
  );
}
```

## Step 5.5 — `components/farmer/RecommendationCard.tsx`

```typescript
// components/farmer/RecommendationCard.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ACTION_STYLES: Record<string, { bg: string; text: string }> = {
  SELL_NOW:       { bg: "bg-green-100",  text: "text-green-800" },
  WAIT_3_DAYS:    { bg: "bg-yellow-100", text: "text-yellow-800" },
  WAIT_2_WEEKS:   { bg: "bg-orange-100", text: "text-orange-800" },
  HOLD:           { bg: "bg-gray-100",   text: "text-gray-800" },
};

export function RecommendationCard({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations();
  const tRec = useTranslations("recommendation");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1);
  const { data, error } = useSWR(
    `/api/recommend?crop=${crop}&district=${districtCap}`,
    fetcher
  );

  if (error || !data) {
    return <Card><CardContent className="h-40 animate-pulse" /></Card>;
  }

  const style = ACTION_STYLES[data.action] || ACTION_STYLES.HOLD;
  const reasoningList = data.reasoning as string[];

  return (
    <Card className={`${style.bg} border-2`}>
      <CardHeader>
        <CardTitle className={`text-2xl ${style.text}`}>
          {tRec(data.action)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-3">
          {tRec("confidence")}: {Math.round(data.confidence * 100)}%
        </div>
        <div className="font-semibold mb-2">{tRec("reasoningHeading")}</div>
        <ul className="space-y-1 text-sm">
          {reasoningList.map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
```

## Step 5.6 — `components/farmer/ActiveBuyersCard.tsx`

```typescript
// components/farmer/ActiveBuyersCard.tsx
"use client";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import { formatINR } from "@/lib/utils";
import { useTranslations } from "next-intl";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ActiveBuyersCard({ crop, district }: { crop: string; district: string }) {
  const t = useTranslations("farmer");
  const tBadges = useTranslations("badges");
  const districtCap = district.charAt(0).toUpperCase() + district.slice(1);

  // Fetch demands + buyers in parallel
  const { data: demands, error: demandsErr } = useSWR(
    `/api/demand?crop=${crop}&district=${districtCap}`,
    fetcher
  );
  const { data: buyers } = useSWR("/api/buyers", fetcher);

  if (demandsErr || !demands) {
    return <Card><CardContent className="h-40 animate-pulse" /></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("activeBuyers")}</CardTitle>
      </CardHeader>
      <CardContent>
        {demands.length === 0 ? (
          <p className="text-muted-foreground">{t("noBuyers")}</p>
        ) : (
          <div className="space-y-3">
            {demands.map((d: any) => {
              const buyer = buyers?.find((b: any) => b.id === d.buyerId);
              return (
                <div key={d.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {buyer?.name || "Buyer"}
                        {buyer?.verified && <VerifiedBuyerBadge />}
                        {buyer?.fpo && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{tBadges("fpo")}</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {d.qtyTons} tons • Grade {d.grade}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatINR(d.priceMinPerQuintal)} – {formatINR(d.priceMaxPerQuintal)}
                      </div>
                      <div className="text-xs text-muted-foreground">/quintal</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## Step 5.7 — `components/shared/VerifiedBuyerBadge.tsx`

```typescript
// components/shared/VerifiedBuyerBadge.tsx
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

export function VerifiedBuyerBadge() {
  const t = useTranslations("badges");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="secondary" className="bg-green-100 text-green-800 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {t("verified")}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>APMC licensed + 5+ years trading + verified payments</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

You also need a `/api/buyers` endpoint. Add it:
```typescript
// app/api/buyers/route.ts
import { NextResponse } from "next/server";
import { seedBuyers } from "@/lib/data/seed-loader";
export async function GET() {
  return NextResponse.json(seedBuyers);
}
```

## Step 5.8 — `components/shared/ArrivalVolumeWidget.tsx`

```typescript
// components/shared/ArrivalVolumeWidget.tsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function ArrivalVolumeWidget({ district }: { district: string }) {
  const t = useTranslations("farmer");
  // Hardcoded for demo (from seed: assume 180 tons at Latur)
  const volumes: Record<string, number> = {
    Latur: 180, Pune: 220, Nashik: 145, Solapur: 165, Nagpur: 95,
  };
  const qty = volumes[district] || 100;
  return (
    <Card className="bg-blue-50">
      <CardContent className="py-4">
        <p className="text-sm font-medium text-blue-900">
          {t("arrivalsToday", { qty, district })}
        </p>
      </CardContent>
    </Card>
  );
}
```

## Step 5.9 — `app/[locale]/farmer/page.tsx`

```typescript
// app/[locale]/farmer/page.tsx
"use client";
import { useQueryState } from "nuqs";
import { CropDistrictSelector } from "@/components/farmer/CropDistrictSelector";
import { PriceCard } from "@/components/farmer/PriceCard";
import { TrendChart } from "@/components/farmer/TrendChart";
import { RecommendationCard } from "@/components/farmer/RecommendationCard";
import { ActiveBuyersCard } from "@/components/farmer/ActiveBuyersCard";
import { ArrivalVolumeWidget } from "@/components/shared/ArrivalVolumeWidget";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function FarmerDashboard() {
  const t = useTranslations("farmer");
  const [crop] = useQueryState("crop", { defaultValue: "soybean" });
  const [district] = useQueryState("district", { defaultValue: "latur" });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{t("dashboard")}</h1>

      <div className="mb-4">
        <CropDistrictSelector />
      </div>

      <div className="mb-4">
        <ArrivalVolumeWidget district={district.charAt(0).toUpperCase() + district.slice(1)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <PriceCard crop={crop} district={district} />
        <RecommendationCard crop={crop} district={district} />
      </div>

      <div className="mb-4">
        <TrendChart crop={crop} district={district} />
      </div>

      <div className="mb-6">
        <ActiveBuyersCard crop={crop} district={district} />
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link href={`/${document?.documentElement?.lang || "en"}/farmer/lots/new?crop=${crop}&district=${district}`}>
            {t("createLot")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${document?.documentElement?.lang || "en"}/farmer/lots?farmerId=f1`}>
            {t("myLots")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

## Verification checklist
- [ ] Visit `http://localhost:3000/en/farmer?crop=soybean&district=latur`
- [ ] Dashboard loads with crop/district selector defaulting to soybean/Latur
- [ ] PriceCard shows today's price (around ₹4,200) and comparison to other mandis
- [ ] TrendChart shows 30-day line chart
- [ ] RecommendationCard shows an action (SELL_NOW / WAIT) with reasoning
- [ ] ActiveBuyersCard shows 3 demand posts for soybean in Latur
- [ ] ArrivalVolumeWidget shows "180 tons arrived at Latur today"
- [ ] Switching crop to "onion" updates all cards via URL state
- [ ] Visit `/mr/farmer?crop=soybean&district=latur` — all Marathi strings appear

---

# PHASE 6 — Lot Creation + Public Listings (Day 2-3, 3 hours)

## Goal
Build lot creation form (farmer), public lot listings page, and lot detail page.

## Files to create
- `components/lot/LotForm.tsx`
- `app/[locale]/farmer/lots/new/page.tsx`
- `app/[locale]/lots/page.tsx` (public listings)
- `app/[locale]/lots/[id]/page.tsx` (public lot detail)
- `app/api/lots/[id]/route.ts` (already in Phase 4)

## Step 6.1 — `components/lot/LotForm.tsx`

```typescript
// components/lot/LotForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const LotSchema = z.object({
  crop: z.enum(["soybean", "onion", "tur"]),
  qtyTons: z.number().positive().max(1000),
  grade: z.enum(["A", "B", "C"]),
  askingPricePerQuintal: z.number().positive().max(100000),
  qualityNotes: z.string().optional().default(""),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  farmerName: z.string().min(1),
  farmerId: z.string().min(1),
  isFpoPool: z.boolean().optional().default(false),
  fpoName: z.string().optional(),
});

export function LotForm({ defaultCrop, defaultDistrict }: { defaultCrop?: string; defaultDistrict?: string }) {
  const t = useTranslations("lot");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [crop, setCrop] = useState(defaultCrop || "soybean");
  const [qtyTons, setQtyTons] = useState("10");
  const [grade, setGrade] = useState("A");
  const [askingPricePerQuintal, setAskingPrice] = useState("4400");
  const [qualityNotes, setQualityNotes] = useState("");
  const [district, setDistrict] = useState(
    defaultDistrict ? defaultDistrict.charAt(0).toUpperCase() + defaultDistrict.slice(1) : "Latur"
  );
  const [isFpoPool, setIsFpoPool] = useState(false);
  const farmerName = "Priya Patil"; // mocked
  const farmerId = "f1";             // mocked

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const parsed = LotSchema.safeParse({
      crop, qtyTons: Number(qtyTons), grade,
      askingPricePerQuintal: Number(askingPricePerQuintal),
      qualityNotes, district, farmerName, farmerId,
      isFpoPool,
      fpoName: isFpoPool ? "Latur Kisan Producer Co." : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid input");
      setSubmitting(false);
      return;
    }
    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      setError("Failed to create lot");
      setSubmitting(false);
      return;
    }
    const lot = await res.json();
    const lang = document.documentElement.lang || "en";
    router.push(`/${lang}/lots/${lot.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("createTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>{t("crop")}</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="soybean">Soybean</SelectItem>
                <SelectItem value="onion">Onion</SelectItem>
                <SelectItem value="tur">Tur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("qtyTons")}</Label>
              <Input type="number" value={qtyTons} onChange={(e) => setQtyTons(e.target.value)} required />
            </div>
            <div>
              <Label>{t("grade")}</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("askingPrice")}</Label>
            <Input type="number" value={askingPricePerQuintal} onChange={(e) => setAskingPrice(e.target.value)} required />
          </div>

          <div>
            <Label>{t("qualityNotes")}</Label>
            <Textarea value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} placeholder="e.g., No pests, harvested 3 days ago" />
          </div>

          <div>
            <Label>{t("location")}</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Latur">Latur</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Nashik">Nashik</SelectItem>
                <SelectItem value="Solapur">Solapur</SelectItem>
                <SelectItem value="Nagpur">Nagpur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-50 p-3">
            <input
              type="checkbox"
              id="fpoPool"
              checked={isFpoPool}
              onChange={(e) => setIsFpoPool(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <Label htmlFor="fpoPool" className="text-sm font-medium cursor-pointer text-green-900">
              🤝 Pool under FPO (Latur Kisan Producer Co. — +₹150/q bulk buyer premium)
            </Label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## Step 6.2 — `app/[locale]/farmer/lots/new/page.tsx`

```typescript
// app/[locale]/farmer/lots/new/page.tsx
import { LotForm } from "@/components/lot/LotForm";

export default function NewLotPage({
  searchParams,
}: {
  searchParams: { crop?: string; district?: string };
}) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <LotForm defaultCrop={searchParams.crop} defaultDistrict={searchParams.district} />
    </div>
  );
}
```

## Step 6.3 — `app/[locale]/lots/page.tsx` (public listings)

```typescript
// app/[locale]/lots/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOpenLots } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";

export default async function PublicLotsPage({
  searchParams,
}: {
  searchParams: { crop?: string; district?: string };
}) {
  const locale = await getLocale();
  const lots = getOpenLots({
    crop: searchParams.crop,
    district: searchParams.district ? searchParams.district.charAt(0).toUpperCase() + searchParams.district.slice(1) : undefined,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Available Lots</h1>
      {lots.length === 0 ? (
        <p className="text-muted-foreground">No lots match your filter.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {lots.map((lot) => (
            <Link key={lot.id} href={`/${locale}/lots/${lot.id}`}>
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span className="capitalize">{lot.crop}</span>
                    <Badge>{lot.grade}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {lot.qtyTons} tons • {lot.farmerName} • {lot.district}
                  </p>
                  <p className="text-2xl font-bold">{formatINR(lot.askingPricePerQuintal)}<span className="text-sm font-normal text-muted-foreground"> /quintal</span></p>
                  {lot.qualityNotes && <p className="text-xs text-muted-foreground mt-2">{lot.qualityNotes}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Step 6.4 — `app/[locale]/lots/[id]/page.tsx` (public lot detail)

```typescript
// app/[locale]/lots/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLot } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { getDistanceInfo } from "@/lib/distance";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import { seedBuyers } from "@/lib/data/seed-loader";

export default function LotDetailPage({ params }: { params: { id: string } }) {
  const lot = getLot(params.id);
  if (!lot) notFound();

  const distance = getDistanceInfo(lot.district, "Latur"); // assume buyer in Latur
  const distanceLabel = lot.district === "Latur" ? "Local" : distance.label;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="capitalize">{lot.crop} — {lot.qtyTons} tons</span>
            <Badge className="text-base">{lot.grade}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-3xl font-bold">{formatINR(lot.askingPricePerQuintal)}<span className="text-base font-normal text-muted-foreground"> /quintal</span></div>
            <div className="text-sm text-muted-foreground">
              {lot.farmerName} • {lot.district} • Posted {lot.createdAt}
            </div>
          </div>

          {lot.qualityNotes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-1">Quality notes</h3>
              <p className="text-sm text-muted-foreground">{lot.qualityNotes}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-1">Distance</h3>
            <p className="text-sm text-muted-foreground">{distanceLabel}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Make an offer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Buyer flow: <a href="/en/buyer" className="text-blue-600 underline">Go to Buyer Portal</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## Verification checklist
- [ ] Click "Create a lot" on farmer dashboard → form appears
- [ ] Form pre-fills with crop/district from URL
- [ ] Submit form with valid data → redirects to new lot detail page
- [ ] Public `/en/lots` shows 3+ lots as cards
- [ ] Click a lot card → opens detail page with grade, price, quality notes, distance
- [ ] Distance label shows "Local" if farmer and buyer are in same district, or "~X km" if different

---

# PHASE 7 — Buyer Experience (Day 3, 3-4 hours)

## Goal
Build buyer portal: landing page, post demand form, browse lots, make offer modal.

## Files to create
- `app/[locale]/buyer/page.tsx`
- `app/[locale]/buyer/demands/page.tsx`
- `app/[locale]/buyer/demands/new/page.tsx`
- `app/[locale]/buyer/lots/page.tsx` (browse lots, with Make Offer)
- `components/buyer/OfferModal.tsx`

## Step 7.1 — `app/[locale]/buyer/page.tsx`

```typescript
// app/[locale]/buyer/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllDemands, getAllLots } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { getLocale } from "next-intl/server";

export default async function BuyerLanding() {
  const locale = await getLocale();
  const myDemands = getAllDemands().filter((d) => d.buyerId === "b1"); // mocked as Rajan
  const openLots = getOpenLots();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Buyer Portal</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader><CardTitle>Post a demand</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Tell farmers what you need.</p>
            <Button asChild>
              <Link href={`/${locale}/buyer/demands/new`}>+ New Demand</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Browse lots</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{openLots.length} open lots.</p>
            <Button asChild variant="outline">
              <Link href={`/${locale}/buyer/lots`}>View All</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>My demands</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{myDemands.length} active.</p>
            <Button asChild variant="outline">
              <Link href={`/${locale}/buyer/demands`}>View</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## Step 7.2 — `app/[locale]/buyer/demands/new/page.tsx`

```typescript
// app/[locale]/buyer/demands/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function NewDemandPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [crop, setCrop] = useState("soybean");
  const [district, setDistrict] = useState("Latur");
  const [qtyTons, setQtyTons] = useState("10");
  const [priceMin, setPriceMin] = useState("4200");
  const [priceMax, setPriceMax] = useState("4500");
  const [grade, setGrade] = useState("A");
  const [deliveryWindowDays, setDeliveryWindow] = useState("7");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/demand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerId: "b1", // mocked as Rajan
        crop, district,
        qtyTons: Number(qtyTons),
        priceMinPerQuintal: Number(priceMin),
        priceMaxPerQuintal: Number(priceMax),
        grade,
        deliveryWindowDays: Number(deliveryWindowDays),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const lang = document.documentElement.lang || "en";
      router.push(`/${lang}/buyer/demands`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Post a Demand</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label>Crop</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="soybean">Soybean</SelectItem>
                  <SelectItem value="onion">Onion</SelectItem>
                  <SelectItem value="tur">Tur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery district</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latur">Latur</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Nashik">Nashik</SelectItem>
                  <SelectItem value="Solapur">Solapur</SelectItem>
                  <SelectItem value="Nagpur">Nagpur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity (tons)</Label>
              <Input type="number" value={qtyTons} onChange={(e) => setQtyTons(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Min price (₹/quintal)</Label>
                <Input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} required />
              </div>
              <div>
                <Label>Max price (₹/quintal)</Label>
                <Input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Grade required</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery window (days from now)</Label>
              <Input type="number" value={deliveryWindowDays} onChange={(e) => setDeliveryWindow(e.target.value)} required />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Posting…" : "Post Demand"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Step 7.3 — `components/buyer/OfferModal.tsx`

```typescript
// components/buyer/OfferModal.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Lot } from "@/lib/types";

export function OfferModal({ lot }: { lot: Lot }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState(String(lot.askingPricePerQuintal - 50));
  const [qty, setQty] = useState(String(lot.qtyTons));
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lotId: lot.id,
        buyerId: "b1", // mocked as Rajan
        pricePerQuintal: Number(price),
        qtyTons: Number(qty),
        message,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Make an Offer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Offer for {lot.crop} — {lot.qtyTons} tons</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Your offer price (₹/quintal)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <p className="text-xs text-muted-foreground mt-1">
              Farmer's asking: ₹{lot.askingPricePerQuintal}
            </p>
          </div>
          <div>
            <Label>Quantity (tons)</Label>
            <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} required />
          </div>
          <div>
            <Label>Message to farmer</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting…" : "Submit Offer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Step 7.4 — `app/[locale]/buyer/lots/page.tsx`

```typescript
// app/[locale]/buyer/lots/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOpenLots } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";
import { OfferModal } from "@/components/buyer/OfferModal";

export default function BuyerBrowseLots() {
  const lots = getOpenLots();
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Browse Lots</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {lots.map((lot) => (
          <Card key={lot.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span className="capitalize">{lot.crop}</span>
                <Badge>{lot.grade}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {lot.qtyTons} tons • {lot.farmerName} • {lot.district}
              </p>
              <p className="text-2xl font-bold mb-3">{formatINR(lot.askingPricePerQuintal)}<span className="text-sm font-normal text-muted-foreground"> /quintal</span></p>
              {lot.qualityNotes && <p className="text-xs text-muted-foreground mb-3">{lot.qualityNotes}</p>}
              <OfferModal lot={lot} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Step 7.5 — `app/[locale]/buyer/demands/page.tsx`

```typescript
// app/[locale]/buyer/demands/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDemandsByBuyer } from "@/lib/data/store";
import { formatINR } from "@/lib/utils";

export default function MyDemandsPage() {
  const demands = getDemandsByBuyer("b1"); // mocked as Rajan
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">My Demands</h1>
      <div className="space-y-3">
        {demands.length === 0 ? <p>No demands yet.</p> : demands.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <CardTitle className="flex justify-between capitalize">
                <span>{d.crop} — {d.qtyTons} tons</span>
                <Badge>{d.grade}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Price: {formatINR(d.priceMinPerQuintal)} – {formatINR(d.priceMaxPerQuintal)} /quintal
              </p>
              <p className="text-sm text-muted-foreground">
                Delivery: {d.district} • Within {d.deliveryWindowDays} days
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Verification checklist
- [ ] `/en/buyer` shows buyer portal with 3 cards
- [ ] Click "New Demand" → form appears, submit creates demand, redirects to /buyer/demands
- [ ] `/en/buyer/lots` shows 3+ lots, each with "Make an Offer" button
- [ ] Click "Make an Offer" → modal appears, submit creates offer
- [ ] After submitting, the offer should appear on the lot detail (we'll add this in Phase 8)
- [ ] `/en/buyer/demands` shows 5 demands (1 from form + 4 from seed for b1)

---

# PHASE 8 — Transaction Flow (Day 3, 2 hours)

## Goal
Wire up the accept offer flow: when farmer accepts, lot closes and transaction is created.

## Files to modify
- `app/[locale]/lots/[id]/page.tsx` (add "Accept Offer" button if logged in as farmer)
- Add `/[locale]/transactions/page.tsx`
- Add `/[locale]/transactions/[id]/page.tsx`
- Add farmer's lot detail view: `/[locale]/farmer/lots/[id]/page.tsx`

## Step 8.1 — `app/[locale]/farmer/lots/[id]/page.tsx`

```typescript
// app/[locale]/farmer/lots/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { VerifiedBuyerBadge } from "@/components/shared/VerifiedBuyerBadge";
import type { Lot, Offer, Buyer } from "@/lib/types";

interface LotDetail extends Lot {
  offers: (Offer & { buyer?: Buyer })[];
  distance: { km: number; warning: boolean; label: string };
}

export default function FarmerLotDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lot, setLot] = useState<LotDetail | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/lots/${params.id}`).then((r) => r.json()).then(setLot);
  }, [params.id]);

  const acceptOffer = async (offerId: string) => {
    if (!confirm("Accept this offer? The lot will be closed.")) return;
    setAccepting(offerId);
    const res = await fetch(`/api/offers/${offerId}/accept`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      const lang = document.documentElement.lang || "en";
      router.push(`/${lang}/transactions/${data.transaction.id}`);
    } else {
      alert("Failed to accept offer");
    }
    setAccepting(null);
  };

  if (!lot) return <div className="container py-6 animate-pulse">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between capitalize">
            <span>{lot.crop} — {lot.qtyTons} tons</span>
            <Badge>{lot.grade}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatINR(lot.askingPricePerQuintal)}<span className="text-sm font-normal text-muted-foreground"> /quintal</span></div>
          <p className="text-sm text-muted-foreground mt-1">{lot.district} • Status: {lot.status}</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mt-6 mb-3">Offers received</h2>
      {lot.offers.length === 0 ? (
        <p className="text-muted-foreground">No offers yet.</p>
      ) : (
        <div className="space-y-3">
          {lot.offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {offer.buyer?.name || "Buyer"}
                      {offer.buyer?.verified && <VerifiedBuyerBadge />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatINR(offer.pricePerQuintal)}/quintal • {offer.qtyTons} tons
                    </p>
                    {offer.message && <p className="text-xs italic mt-1">"{offer.message}"</p>}
                  </div>
                  {offer.status === "pending" ? (
                    <Button
                      onClick={() => acceptOffer(offer.id)}
                      disabled={accepting === offer.id}
                    >
                      {accepting === offer.id ? "Accepting…" : "Accept Offer"}
                    </Button>
                  ) : (
                    <Badge variant="secondary">{offer.status}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Step 8.2 — `app/[locale]/transactions/page.tsx`

```typescript
// app/[locale]/transactions/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTransactions, getLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function TransactionsPage() {
  const locale = await getLocale();
  const txs = getAllTransactions();
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {txs.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet.</p>
      ) : (
        <div className="space-y-3">
          {txs.map((tx) => {
            const lot = getLot(tx.lotId);
            const buyer = seedBuyers.find((b) => b.id === tx.buyerId);
            return (
              <Link key={tx.id} href={`/${locale}/transactions/${tx.id}`}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span className="capitalize">{lot?.crop || "—"} — {tx.qtyTons} tons</span>
                      <span className="text-base">{formatINR(tx.totalAmount)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {buyer?.name} bought from farmer • {formatDate(tx.closedAt)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

## Step 8.3 — `app/[locale]/transactions/[id]/page.tsx`

```typescript
// app/[locale]/transactions/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTransactions, getLot } from "@/lib/data/store";
import { seedBuyers } from "@/lib/data/seed-loader";
import { formatINR, formatDate } from "@/lib/utils";

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const tx = getAllTransactions().find((t) => t.id === params.id);
  if (!tx) notFound();
  const lot = getLot(tx.lotId);
  const buyer = seedBuyers.find((b) => b.id === tx.buyerId);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Transaction #{tx.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Closed on</div>
            <div className="font-medium">{formatDate(tx.closedAt)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Crop</div>
            <div className="font-medium capitalize">{lot?.crop} — {tx.qtyTons} tons, Grade {lot?.grade}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Parties</div>
            <div>Farmer: {lot?.farmerName}</div>
            <div>Buyer: {buyer?.name}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Final price</div>
            <div className="text-2xl font-bold">{formatINR(tx.finalPricePerQuintal)}<span className="text-sm font-normal text-muted-foreground"> /quintal</span></div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total amount</div>
            <div className="text-2xl font-bold text-green-600">{formatINR(tx.totalAmount)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Verification checklist
- [ ] Create a lot via farmer dashboard
- [ ] Go to `/en/farmer/lots/[newId]` (or find the lot)
- [ ] Make an offer as buyer (via `/en/buyer/lots`)
- [ ] As farmer, view lot → see the offer
- [ ] Click "Accept Offer" → redirected to `/en/transactions/[txId]`
- [ ] Transaction detail page shows all parties, final price, total amount
- [ ] `/en/transactions` lists all transactions

---

# PHASE 9 — Polish: Roadmap, About, Mobile, Verified Badges (Day 3-4, 2-3 hours)

## Goal
Add the roadmap page, about page, ensure mobile responsiveness, add verified buyer badge consistently.

## Files to create
- `app/[locale]/roadmap/page.tsx`
- `app/[locale]/about/page.tsx`
- (Optional) `app/[locale]/farmer/lots/page.tsx` (my lots)

## Step 9.1 — `app/[locale]/roadmap/page.tsx`

```typescript
// app/[locale]/roadmap/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Warehouse, ShieldCheck, AlertCircle, IdCard, MapPin } from "lucide-react";

const items = [
  { icon: Truck,        title: "Logistics coordination", desc: "Real transport providers, Kisan Rath integration" },
  { icon: Warehouse,    title: "Storage finder",         desc: "Godowns and cold storage near each farmer" },
  { icon: ShieldCheck,  title: "Payment escrow",         desc: "Hold payment until buyer confirms receipt" },
  { icon: AlertCircle,  title: "Dispute resolution",     desc: "Mediation workflow for quality/payment disputes" },
  { icon: IdCard,       title: "Real KYC",               desc: "Aadhaar, GSTIN verification for buyers" },
  { icon: MapPin,       title: "Real geocoding",         desc: "Replace district heuristic with real addresses" },
];

export default function RoadmapPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Roadmap</h1>
      <p className="text-muted-foreground mb-6">Features we've deferred to Phase 2.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

## Step 9.2 — `app/[locale]/about/page.tsx`

```typescript
// app/[locale]/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">About Sarvah</h1>
      <Card className="mb-4">
        <CardHeader><CardTitle>What it is</CardTitle></CardHeader>
        <CardContent>
          <p>
            Sarvah is a decision-support tool + lightweight marketplace for Maharashtra's smallholder farmers.
            It tells farmers <b>when to sell</b> and <b>to whom</b>, with mandi prices, trend charts, and a recommendation engine.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader><CardTitle>Data sources</CardTitle></CardHeader>
        <CardContent>
          <p>
            Mandi prices are based on Agmarknet data, with a fallback seed dataset for demo reliability.
            Buyer demand posts are seeded for the demo.
          </p>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader><CardTitle>Marathi-first design</CardTitle></CardHeader>
        <CardContent>
          <p>
            Sarvah is designed Marathi-first. Every key screen is available in Marathi, and translations are
            first-class, not afterthoughts.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Team</CardTitle></CardHeader>
        <CardContent>
          <p>Built in 4 days by 3 developers for the Maharashtra State Innovation Society hackathon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Step 9.3 — Mobile responsiveness pass
- All shadcn components are responsive by default.
- Test on mobile (Chrome DevTools → toggle device toolbar → iPhone 12)
- Make sure tables don't overflow (use `overflow-x-auto` wrapper if needed)
- Make sure text is readable on small screens (text-base on mobile, text-lg on desktop)

## Step 9.4 — Add navigation links
Update `app/[locale]/layout.tsx` to include:
```typescript
<nav className="flex gap-4 items-center">
  <Link href={`/${locale}/farmer`} className="text-sm hover:underline">Farmer</Link>
  <Link href={`/${locale}/buyer`} className="text-sm hover:underline">Buyer</Link>
  <Link href={`/${locale}/transactions`} className="text-sm hover:underline">Transactions</Link>
  <Link href={`/${locale}/roadmap`} className="text-sm hover:underline">Roadmap</Link>
  <Link href={`/${locale}/about`} className="text-sm hover:underline">About</Link>
  <LocaleToggle />
</nav>
```

## Verification checklist
- [ ] `/en/roadmap` shows 6 deferred features with icons
- [ ] `/en/about` shows About Sarvah content
- [ ] `/mr/roadmap` shows Marathi roadmap (if you translated)
- [ ] Mobile view: dashboard is usable on a 375px-wide screen
- [ ] All navigation links work
- [ ] Demo URL `/en/farmer?crop=soybean&district=latur` still works

---

# PHASE 10 — Demo Prep (Day 4)

## Goal
Verify the full demo flow, fix any bugs, record Loom backup.

## Step 10.1 — Pre-baked demo URLs (bookmark these)
- `http://localhost:3000/en/farmer?crop=soybean&district=latur` — Priya's home screen
- `http://localhost:3000/en/lots/L1` — Priya's existing lot
- `http://localhost:3000/en/buyer/lots` — Rajan's browse view
- `http://localhost:3000/mr/farmer?crop=soybean&district=latur` — Marathi home

## Step 10.2 — Demo script walkthrough
1. Open `/en/farmer?crop=soybean&district=latur` — show 3 mandis, trend chart, recommendation, active buyers
2. Click "Create a lot" → fill form → submit → land on new lot page
3. Open `/en/buyer/lots` in another tab → make an offer on the new lot
4. Open `/en/farmer/lots/[newId]` → see offer → click "Accept"
5. Land on `/en/transactions/[txId]` — show closed transaction
6. Toggle to Marathi → show same flow in Marathi

## Step 10.3 — Bug bash
- [ ] Test all 5 crops/districts combos
- [ ] Test Marathi strings — no English leak
- [ ] Test on Chrome and Firefox
- [ ] Test on mobile size
- [ ] Verify no console errors

## Step 10.4 — Final checks
- [ ] `npm run build` succeeds (production build)
- [ ] `npm run dev` runs without errors
- [ ] All 18 spec items either built, mocked, or on roadmap

---

# FINAL CHECKLIST — What to Tell the User When Done

When the project is complete, tell the user:

✅ **Built (8 features, fully functional):**
- Mandi price aggregation
- Buyer demand aggregation
- Quality requirements
- Localized price trends
- Sale-window recommendation
- Match farmers/buyers
- Lot creation
- Digital offers
- Transaction records

✅ **Mocked / partial (5):**
- Arrival volumes (one widget)
- Verified buyer credentials (badge)
- Quality grading (A/B/C self-declare)
- Distance consideration (heuristic)
- Payment tracking (transaction record only)

✅ **Deferred to roadmap (5):**
- Logistics coordination
- Storage finder
- Payment escrow
- Dispute resolution
- Real KYC

**Tally:** 8/18 functional (~44%), 18/18 acknowledged (100%). Target: 70% functional, 100% acknowledged.

---

# 🚨 TROUBLESHOOTING NOTES

**Issue: nuqs error in TypeScript**
- Make sure `npm install nuqs` was run.
- Import from `"nuqs"`, not `"next-usequerystate"`.

**Issue: next-intl locale not switching**
- Verify `middleware.ts` is at root, not in `app/`.
- Verify `next.config.mjs` uses `withNextIntl`.
- Verify `i18n.ts` exports `locales` and `defaultLocale`.

**Issue: shadcn component not found**
- Run `npx shadcn@latest add [component-name]`.

**Issue: SWR not refetching**
- Pass a key that includes crop/district. When URL changes, key changes, refetch happens.

**Issue: Tailwind classes not applied**
- Verify `globals.css` imports `@tailwind base/components/utilities`.
- Verify `tailwind.config.ts` has correct content paths.

**Issue: Marathi characters showing as boxes**
- Make sure `lang="mr"` is on `<html>`.
- Use a Unicode-supporting font (Tailwind default is fine).

---

# END OF BUILD INSTRUCTIONS

This document is the complete specification. The agent should follow it phase by phase, in order. Do not skip phases. Do not add features not in this document. Good luck.
