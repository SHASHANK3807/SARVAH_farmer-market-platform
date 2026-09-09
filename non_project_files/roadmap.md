# System Roadmap & Spec Coverage
**Architecture & Scalability Blueprint • PS #26132**

100% of the Maharashtra State Innovation Society problem statement requirements are addressed. Features that require external state APIs or banking licenses are architecturally detailed below for Phase 2 deployment.

## 📋 100% Spec Coverage Matrix (18/18 Items Acknowledged)

| Specification Requirement | Status | Implementation Note |
|---|---|---|
| Mandi price aggregation | Built (Functional) | Side-by-side rates across 5 Maharashtra APMCs |
| Localised price trends | Built (Functional) | 30-day interactive Recharts trend chart |
| Sale-window recommendation | Built (Functional) | Rules engine: percentile + 7d velocity + seasonality + storage |
| Buyer demand aggregation | Built (Functional) | Real-time institutional buyer demand broadcast |
| Match farmers/FPOs with buyers | Built (Functional) | Interactive digital offer and acceptance lifecycle |
| Lot creation | Built (Functional) | Crop, tons, asking price, quality specifications |
| Digital offers & negotiation | Built (Functional) | Counter-offer modal and status tracking |
| Transparent transaction records | Built (Functional) | Immutable transaction ledger with receipts |
| Stronger FPO aggregation | Built (Functional) | Pooled FPO bulk lot creation with +₹150/q premium |
| Quality grading | Mocked / Seeded | Self-declared FAQ Grade A, B, C criteria |
| Verified buyer credentials | Mocked / Seeded | Verified APMC badge with credential tooltips |
| Arrival volumes | Mocked / Seeded | Live APMC arrival metric tons counter |
| Distance & Net Realization | Mocked / Seeded | District distance matrix with freight cost deduction |
| Logistics coordination | Deferred (Roadmap) | Kisan Rath & multi-axle freight integrations |
| Storage & godown finder | Deferred (Roadmap) | WDRA accredited warehouse locator & e-NWR |
| Payment escrow | Deferred (Roadmap) | Automated escrow lock until weighment signoff |
| Dispute & grievance resolution | Deferred (Roadmap) | Formal mediation process with APMC oversight |
| Real KYC verification | Deferred (Roadmap) | Direct GSTIN & APMC license verification API |

---

## 🚀 Deferred Features (Phase 2 Production Roadmap)

### Logistics Coordination & Fleet Integration
Direct API integration with national transport aggregators (Kisan Rath) and local rural freight operators for on-demand farm-gate pickup.

### Storage Finder & Godown Receipts (WDRA)
Locating WDRA-accredited warehouses and cold storages within 25 km, enabling electronic Negotiable Warehouse Receipts (e-NWR) to prevent distress selling.

### Digital Payment Escrow & Smart Contracts
Tri-party escrow holding buyer payments upon lot dispatch, releasing funds automatically upon digital quality signoff at destination.

### Dispute & Grievance Redressal Mechanism
Structured arbitration workflow for weight discrepancies, moisture penalties, and delivery delays with APMC arbitrator involvement.

### Automated KYC & APMC Trader License Verification
Real-time GSTIN, PAN, and APMC commission agent license validation via state government APIs.

### Hyperlocal Geocoding & Route Optimization
Transition from district-level distance heuristics to live GPS farm-gate routing with diesel price indexing.
