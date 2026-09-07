# Sarvah — Implementation Plan

**Project:** Maharashtra farm-gate price discovery + lightweight marketplace  
**Hackathon:** Maharashtra State Innovation Society (Problem Statement #26132)  
**Timeline:** 4 days | 3 developers  
**Target:** 70% functional, 100% acknowledged (18/18 spec items)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui (New York, slate) |
| **Charts** | Recharts |
| **i18n** | next-intl (English + Marathi, Marathi-first) |
| **Validation** | Zod |
| **URL State** | nuqs |
| **Date Handling** | date-fns |
| **Icons** | lucide-react |
| **Data Fetching** | SWR |
| **Storage** | JSON files in `/data` (demo scope) |
| **Utilities** | clsx, tailwind-merge, cn() helper |

---

## 📁 Folder Structure

```
sarvah/
├── app/
│   ├── [locale]/                 # i18n routes (en, mr)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing
│   │   ├── farmer/               # Farmer dashboard + lot creation
│   │   │   ├── page.tsx
│   │   │   └── lots/
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── buyer/                # Buyer portal
│   │   │   ├── page.tsx
│   │   │   ├── demands/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── lots/page.tsx
│   │   ├── lots/                 # Public listings
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── transactions/         # Deal records
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── roadmap/page.tsx
│   │   └── about/page.tsx
│   └── api/
│       ├── prices/route.ts
│       ├── demand/route.ts
│       ├── lots/route.ts
│       ├── lots/[id]/route.ts
│       ├── offers/route.ts
│       ├── offers/[id]/accept/route.ts
│       └── recommend/route.ts
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── farmer/                   # Farmer-specific components
│   ├── buyer/                    # Buyer-specific components
│   ├── lot/                      # Lot components
│   ├── shared/                   # Shared (LocaleToggle, VerifiedBuyerBadge, etc.)
│   └── charts/                   # PriceTrendChart
├── lib/
│   ├── data/                     # agmarknet.ts, seed-loader.ts, store.ts
│   ├── recommendation/           # engine.ts (rules engine)
│   ├── distance.ts               # distance heuristic
│   ├── types.ts                  # All TypeScript types
│   ├── utils.ts                  # cn(), formatters
│   └── i18n.ts                   # next-intl config
├── data/                         # Seed JSON files
├── messages/                     # en.json, mr.json
├── scripts/                      # generate-seed.ts
└── middleware.ts                 # locale routing
```

---

## 📋 10-Phase Build Plan

| Phase | Time | Focus | Key Deliverables |
|-------|------|-------|------------------|
| **0** | 30 min | **Setup** | Next.js init, deps, folder structure |
| **1** | 2-3 hrs | **Foundation** | Types, i18n, base layout, Marathi toggle, landing |
| **2** | 3-4 hrs | **Data Layer** | Seed data (900 pts), JSON store, Agmarknet mock, distance heuristic |
| **3** | 2-3 hrs | **Recommendation Engine** | Rules engine (percentile + trend + seasonality) |
| **4** | 2-3 hrs | **API Routes** | All 7 endpoints |
| **5** | 4-5 hrs | **Farmer Experience (HERO)** | Dashboard: price cards, Recharts trend, recommendation, active buyers |
| **6** | 3 hrs | **Lot Creation** | Form, public listings, lot detail |
| **7** | 3-4 hrs | **Buyer Experience** | Portal, demand form, browse lots, offer modal |
| **8** | 2 hrs | **Transaction Flow** | Accept offer → transaction records |
| **9** | 2-3 hrs | **Polish** | Roadmap, About, mobile pass, verified badges |
| **10** | Day 4 | **Demo Prep** | Bug bash, pre-baked URLs, Loom backup |

---

## 🎯 Key Features & Spec Coverage

| Feature | Status | Notes |
|---------|--------|-------|
| Farmer dashboard (price cards, Recharts trend, SELL/WAIT rec) | ✅ Built | HERO feature |
| Lot creation (crop, qty, grade A/B/C, asking price, notes) | ✅ Built | |
| Two-sided marketplace (lots → offers → accept → transaction) | ✅ Built | |
| Recommendation engine (percentile + trend + seasonality) | ✅ Built | |
| Marathi-first i18n toggle | ✅ Built | Non-negotiable |
| Distance heuristic (district→km, warning >50km) | ⚠️ Mocked | Prototype heuristic |
| Quality grading (A/B/C self-declare) | ⚠️ Mocked | |
| Verified buyer badges | ⚠️ Mocked | |
| Logistics, storage, escrow, disputes, KYC | 📋 Deferred | Roadmap page |

### Spec Coverage Tally
| Bucket | Count | Items |
|--------|-------|-------|
| **Built** | 8 | Mandi prices, buyer demand, quality reqs, price trends, sale-window rec, farmer↔buyer matching, lot creation, digital offers, transactions |
| **Mocked/Partial** | 5 | Arrival volumes, verified buyer badge, quality grading, distance heuristic, payment tracking (partial) |
| **Deferred** | 5 | Logistics, storage, transport, payment escrow, dispute resolution, real KYC |
| **Total** | **18/18** | **100% acknowledged, ~44% functional** |

**Target:** 70% functional, 100% acknowledged

---

## 🔑 Key Domain Details

| Category | Values |
|----------|--------|
| **Crops** | soybean, onion, tur |
| **Mandis** | Latur, Pune, Nashik, Solapur, Nagpur |
| **Grades** | A, B, C (self-declared) |
| **Languages** | English + Marathi (Marathi-first) |
| **Demo URLs** | `/en/farmer?crop=soybean&district=latur` & `/mr/...` |

---

## 🚀 Execution Strategy

1. **Read `BUILD_INSTRUCTIONS.md`** — Complete phase-by-phase spec with exact file paths, code snippets, and verification checklists
2. **Follow phases 0→10 sequentially** — Each phase builds on the previous
3. **Test after each phase** — Run dev server, verify checklist
4. **No scope creep** — Only build what's in the spec
5. **Parallel work** — 3 devs: (1) Data/Engine, (2) Farmer UI + Marathi, (3) Buyer UI + Flow

---

## 📋 Demo Script (3 minutes)

| Time | Segment |
|------|---------|
| 0:00–0:30 | Problem: farmer loses 15% without price info |
| 0:30–1:30 | Farmer flow: prices + chart + recommendation |
| 1:30–2:30 | Marketplace: create lot → buyer offer → accept |
| 2:30–3:00 | Roadmap + Marathi + outcomes |

---

## 📦 Pre-built Assets

| Asset | Location |
|-------|----------|
| Full build spec | `C:\Users\Poloj\sarvah\build\BUILD_INSTRUCTIONS.md` |
| Quick reference | `C:\Users\Poloj\sarvah\build\README.md` |
| PPT (updated) | `C:\Users\Poloj\Downloads\sarvaha_new.pptx` |
| Session summaries | `C:\Users\Poloj\sarvah\chats\` |

---

## 🎯 Ready to Build

**Next action:** Hand `BUILD_INSTRUCTIONS.md` to your vibe-coding agent with:

> *"Read BUILD_INSTRUCTIONS.md in full. Follow phases 0→10 in order. Test after every phase. Do not add features not in this document. If you encounter errors, see the Troubleshooting section at the bottom."*

The spec is complete, precise, and ready for vibe-coding execution.

---

*Generated for Sarvah hackathon prototype — Maharashtra State Innovation Society, Problem Statement #26132*