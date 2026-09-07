# Sarvah Build Folder

This folder contains everything needed to build Sarvah via vibe-coding with another AI agent.

## Start Here

**The main build document is:** `BUILD_INSTRUCTIONS.md`

That file is the **complete specification** for the agent. It contains:
- Project context and stack
- 10 phases of build steps
- Every file to create with full code
- Verification checklists for each phase
- Troubleshooting notes
- Final tally

## How to Use

1. **Read the entire `BUILD_INSTRUCTIONS.md` once** to understand the project.
2. **Follow phases 0 → 10 in order.** Each phase builds on the previous.
3. **Run the verification checklist** at the end of each phase before moving on.
4. **If something breaks**, see the Troubleshooting section at the bottom of `BUILD_INSTRUCTIONS.md`.

## Phase Overview

| Phase | Time | Goal |
|-------|------|------|
| 0. Pre-Work | 30 min | Init Next.js, install deps, set up folders |
| 1. Foundation | 2-3 hrs | Types, i18n, base layout, Marathi toggle |
| 2. Data Layer | 3-4 hrs | Seed data, JSON store, agmarknet mock, distance |
| 3. Recommendation Engine | 2-3 hrs | Rules engine: percentile + trend + seasonality |
| 4. API Routes | 2-3 hrs | All backend endpoints |
| 5. Farmer Experience | 4-5 hrs | Dashboard (HERO): price + chart + rec + buyers |
| 6. Lot Creation | 3 hrs | Form, listings, detail page |
| 7. Buyer Experience | 3-4 hrs | Portal, demand form, browse lots, offer modal |
| 8. Transaction Flow | 2 hrs | Accept offer, transaction records |
| 9. Polish | 2-3 hrs | Roadmap, About, mobile, badges |
| 10. Demo Prep | Day 4 | Verify, bug bash, demo URLs |

**Total: ~26-32 hours of focused work** (4 days × 6-8 hrs/day for 3 people working in parallel).

## Project Structure (created by the build)

```
sarvah/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # All user-facing pages (en, mr)
│   │   ├── farmer/               # Farmer dashboard, lot creation
│   │   ├── buyer/                # Buyer portal, demand form
│   │   ├── lots/                 # Public listings
│   │   ├── transactions/         # Deal records
│   │   ├── roadmap/              # Deferred features
│   │   └── about/                # About page
│   └── api/                      # Backend routes
├── components/                   # React components
├── lib/                          # Types, store, recommendation engine
├── data/                         # Seed JSON files
├── messages/                     # en.json, mr.json (i18n)
└── ...
```

## Demo URLs (when running)

- `http://localhost:3000/en/farmer?crop=soybean&district=latur` — Farmer home (Priya)
- `http://localhost:3000/mr/farmer?crop=soybean&district=latur` — Same in Marathi
- `http://localhost:3000/en/buyer/lots` — Buyer home (Rajan)
- `http://localhost:3000/en/lots/L1` — Sample lot
- `http://localhost:3000/en/roadmap` — Deferred features

## Spec Coverage (target)

- **8 built** (fully functional)
- **5 mocked/partial** (visible + seeded)
- **5 deferred** (roadmap page)
- **Total: 18/18 acknowledged (100%), 8/18 functional (~44%)**
- **Goal: 70% functional, 100% acknowledged**

## What to Tell the Agent

When you start the vibe-coding session, give the agent this single instruction:

> "Read `BUILD_INSTRUCTIONS.md` in full. Follow phases 0 through 10 in order. Test after every phase. Do not add features not in this document. If you encounter errors, see the Troubleshooting section at the bottom."

Then watch it work. Ask the agent for the verification checklist result at the end of each phase before moving to the next.

---

**Good luck with the hackathon!**
