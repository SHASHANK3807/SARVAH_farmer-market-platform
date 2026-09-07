# Mandi Mitra - Build Checklist (4-Day Hackathon)

## 0. PRE-WORK (Before Day 1)
- [ ] Confirm stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts
- [ ] Confirm crops: soybean, onion, tur
- [ ] Confirm mandis: Latur, Pune, Nashik, Solapur, Nagpur
- [ ] Decide demo flow: farmer-first -> buyer responds
- [ ] Decide storage: JSON files in `/data` (or SQLite + Prisma)
- [ ] Set up shared GitHub repo with branch protection (3 devs = avoid stepping on each other)

## 1. FOUNDATION (Day 1)
- [ ] Initialize Next.js project: `npx create-next-app@latest mandi-mitra`
- [ ] Install: `shadcn-ui`, `recharts`, `next-intl`, `zod`, `lucide-react`, `date-fns`
- [ ] Set up folder structure: `/app`, `/components`, `/lib`, `/messages`, `/data`
- [ ] Configure i18n routing for `/en` and `/mr`
- [ ] Create base layout with Marathi toggle in header
- [ ] Generate **realistic seed dataset**: 60 days x 3 crops x 5 mandis (900 data points)
- [ ] Save seed dataset to `/data/prices.seed.json`
- [ ] Set up Prisma schema (or JSON schema) for: Lot, Offer, Buyer, DemandPost, Transaction
- [ ] Seed DB: 5 buyers (2 verified, 2 unverified, 1 FPO), 5 demand posts, 3 sample lots

## 2. DATA + LOGIC (Day 1-2)
- [ ] Build Agmarknet scraper: `/lib/data/agmarknet.ts`
- [ ] Wrap scraper with fallback to seed data (try real, catch error, return seed)
- [ ] Create API route: `GET /api/prices?crop=&district=&mandi=`
- [ ] Create API route: `GET /api/demand?crop=&district=`
- [ ] Create API route: `GET /api/lots` and `POST /api/lots`
- [ ] Create API route: `GET /api/offers?lotId=` and `POST /api/offers`
- [ ] Create API route: `POST /api/offers/:id/accept`
- [ ] Build sale-window rules engine: `/lib/recommendation/engine.ts`
  - [ ] Rule 1: percentile-based (top 20% -> SELL)
  - [ ] Rule 2: 7-day trend (downward -> SELL, rising -> WAIT)
  - [ ] Rule 3: seasonality adjustment
  - [ ] Return: `{ action, confidence, reasoning[] }`
- [ ] Test engine against all 3 crops x 5 districts
- [ ] Build reasoning generator: Marathi + English sentence templates

## 3. FARMER EXPERIENCE (Day 2 - Hero Feature)
- [ ] Landing page: value prop, Marathi toggle, two CTAs (Farmer / Buyer)
- [ ] Farmer dashboard route: `/[locale]/farmer`
- [ ] Crop + district selector component (with URL state via `nuqs`)
- [ ] Price comparison card: 3 nearest mandis, today's price, change vs yesterday
- [ ] 30-day trend chart (Recharts LineChart, multi-mandi overlay, hover tooltip)
- [ ] Recommendation card: big, color-coded (green/yellow/red), reasoning chips
- [ ] Active buyers section: shows 3 demand posts matching crop + district
- [ ] Marathi translations for all above strings
- [ ] Mobile responsive pass on farmer dashboard
- [ ] Loading states + skeleton loaders
- [ ] Empty states (no data, no buyers)

## 4. LOT CREATION (Day 2-3)
- [ ] Lot creation form: `/[locale]/farmer/lots/new`
- [ ] Form fields: crop, qty (tons), grade (A/B/C), asking price (`/quintal), quality notes, location
- [ ] Form validation with `zod`
- [ ] **Basic distance consideration: farmer's district displayed, buyer sees ~km estimate** (prototype heuristic)
- [ ] Submit handler -> `POST /api/lots`
- [ ] Public lot listings page: `/[locale]/lots` (table, filter by crop + district)
- [ ] Single lot detail page: `/[locale]/lots/[id]` (shows distance estimate)
- [ ] Marathi translations for lot form + listings

## 5. BUYER EXPERIENCE (Day 3)
- [ ] Buyer landing: `/[locale]/buyer`
- [ ] Post demand form: crop, qty, price range, grade, district, delivery window
- [ ] My demands list: `/[locale]/buyer/demands`
- [ ] Browse lots page: `/[locale]/buyer/lots` (reuses public listings, with Make Offer button)
- [ ] "Make Offer" modal: qty, price, message
- [ ] Submit offer -> `POST /api/offers`
- [ ] Offers received view (on farmer's lot detail page)
- [ ] "Accept Offer" action -> creates Transaction record, marks lot as `closed`
- [ ] Marathi translations for all above

## 6. TRANSACTIONS + POLISH (Day 3-4)
- [ ] Transactions page: `/[locale]/transactions` (table of all closed deals)
- [ ] Transaction detail page: shows lot, offer, both parties, timestamp
- [ ] Verified buyer badge component (check with criteria tooltip)
- [ ] Seed buyers with varying verification levels for visual variety
- [ ] Arrival volumes stat: small "180 tons arrived at Latur today" widget
- [ ] Roadmap page: `/[locale]/roadmap` showing deferred features with icons
  - [ ] Logistics coordination
  - [ ] Storage finder
  - [ ] Payment escrow
  - [ ] Dispute resolution
  - [ ] Real KYC
- [ ] About page: data sources, Marathi-first design notes, team
- [ ] Mobile responsiveness pass on ALL pages
- [ ] Cross-browser check (Chrome, mobile Safari if possible)
- [ ] Pre-baked demo URLs: `?crop=soybean&district=latur` auto-loads

## 7. DEMO PREP (Day 4)
- [ ] Bug bash: full user story on phone + desktop
- [ ] Fix Devanagari line-break issues
- [ ] Optimize chart rendering (Recharts can be slow on first load)
- [ ] Record 3-min Loom backup demo
- [ ] Pitch deck (10-12 slides):
  - [ ] Problem (farmer perspective + 1 stat)
  - [ ] Why existing solutions fail
  - [ ] Solution: Mandi Mitra
  - [ ] Live demo (or video)
  - [ ] Tech & data approach
  - [ ] Spec coverage table
  - [ ] Marathi-first design
  - [ ] Outcomes measured
  - [ ] Roadmap
  - [ ] Team + ask
- [ ] Speaker assignments (3 people, ~3 min each)
- [ ] Rehearsal #1: full run, time it
- [ ] Rehearsal #2: with Q&A practice
- [ ] Rehearsal #3: from cold start, no warmup

## 8. INTERNAL HACKATHON DAY
- [ ] Arrive 30 min early, test on presentation machine
- [ ] Verify WiFi works (or have full offline mode ready)
- [ ] Have Loom backup queued in another tab
- [ ] Have 3 pre-baked demo URLs bookmarked
- [ ] Stay calm if something breaks - show the roadmap page while debugging

---

## Quick Spec Coverage Tracker

Use this to verify your 70% claim:

| Spec feature | Built? | Where |
|---|---|---|
| Mandi price aggregation | done | API + farmer dashboard |
| Buyer demand | done | Buyer portal + farmer dashboard |
| Quality requirements | done | Lot form + demand form |
| Localised price trends | done | Recharts component |
| Sale-window recommendation | done | Engine + recommendation card |
| Match farmers <-> buyers | done | Lot + offer flow |
| Verified buyer credentials | partial | Badge component, seeded |
| Lot creation | done | Form + DB |
| Quality grading | partial | A/B/C self-declare |
| Digital offers | done | Offer modal + DB |
| Arrival volumes | partial | One stat widget, seeded |
| Transaction records | done | Transactions page |
| Logistics | skipped | Roadmap page |
| Storage | skipped | Roadmap page |
| Payment escrow | skipped | Roadmap page |
| Dispute resolution | skipped | Roadmap page |
| Real KYC | skipped | Roadmap page |

**Count: 7 done fully + 4 partial visible-but-mocked + 5 skipped roadmap = 16/16 spec items addressed, 11/16 functional = ~69% functional, 100% acknowledged.**

---

## Notes
- Pre-baked demo URLs let judges instantly see the working state
- Agmarknet fallback to seed data prevents demo crashes
- Marathi toggle differentiates from typical English-only prototypes
- Roadmap page signals you read the full spec even for deferred features
