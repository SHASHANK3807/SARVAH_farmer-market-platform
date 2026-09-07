Mandi Mitra
============

Maharashtra farm-gate price discovery + lightweight marketplace

A web prototype that helps smallholder farmers decide WHEN to sell and TO WHOM, with real mandi prices, a smart sell/wait recommendation, and a two-sided flow connecting farmers/FPOs to verified buyers.


Build Status
------------

See CHECKLIST.md for the full 4-day task list and docs/SPEC_COVERAGE.txt for tracking what % of the problem statement is covered.


Quick Reference
---------------

  Stack:        Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Recharts
  Storage:      JSON files in /data (demo scope)
  Crops:        soybean, onion, tur
  Mandis:       Latur, Pune, Nashik, Solapur, Nagpur
  Languages:    English + Marathi (toggle)
  Demo flow:    Farmer-first -> buyer responds
  Target:       70% functional prototype for internal hackathon


Folder Structure
----------------

  mandi-mitra/
    README.txt            this file
    CHECKLIST.md          4-day build checklist
    TEAM_BRIEF.txt        what we're building and why (share with team)
    docs/
      SPEC_COVERAGE.md    mapping our build to the problem statement
      SPEC_COVERAGE.txt   same as .md, plain text version
    app/                  Next.js routes (to be created Day 1)
    components/           shared UI (to be created Day 1)
    lib/                  data, logic, mock (to be created Day 1)
    data/                 seed JSON for prices, buyers, lots (to be created Day 1)
    messages/             en.json, mr.json for i18n (to be created Day 1)
