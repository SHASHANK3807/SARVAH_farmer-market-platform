# Sarvah: Functionalities & Architecture Guide
**A guide for the team to confidently answer jury questions regarding the backend logic, implementation details, and future scalability.**

---

## 1. Fully Built Functionalities (How they work under the hood)

### A. Authentication & Session Management
- **Current Implementation**: We built a lightweight, fully functional authentication system using **JSON Web Tokens (JWT)**.
- **Backend Flow**: When a user registers or logs in (`/api/auth/register`), the server validates their credentials, hashes their password using Node's native `crypto.scryptSync` (to demonstrate security awareness), and saves the user in our file-based data store (`users.runtime.json`).
- **Session Handling**: The server signs a JWT using the `jose` library (edge-compatible) and sets it as an `HttpOnly` secure cookie. This ensures that Client Components cannot tamper with the session. The layout and dashboard automatically query `/api/auth/me` to fetch user details.

### B. Smart Decision Engine (SELL/WAIT Recommendations)
- **Current Implementation**: A rules-based engine residing in `components/farmer/RecommendationCard.tsx` and utility layers.
- **Backend Flow**: The engine ingests mock historical Mandi price data (simulating AGMARKNET data). It calculates the current price's **percentile** against the 30-day window. 
- **Algorithm**: If the price is in the 80th+ percentile and the 7-day trend is upward, it confidently recommends `SELL_NOW`. If prices are crashing and in the bottom 20th percentile, it recommends `WAIT_2_WEEKS` and checks if the crop has high shelf-life (like Tur) or is perishable (like Onion), adjusting the advice accordingly.

### C. FPO Pooling & Premium Calculation
- **Current Implementation**: Demonstrated the financial power of Farmer Producer Organizations (FPOs).
- **Backend Flow**: When a lot is created via `POST /api/lots` and marked as an FPO pool, the backend interceptor artificially injects a **+3.5% premium** to the asking price. This proves to the jury that our system structurally incentivizes farmers to pool their yields for better bulk leverage.

### D. Hyperlocal Freight & Distance Deduction
- **Current Implementation**: An automated freight deduction calculator that runs when buyers browse lots.
- **Backend Flow**: Instead of expensive Google Maps API calls for the prototype, we built a **District-to-District Distance Matrix** (`lib/distance.ts`). When a buyer in Pune views a lot from Latur, the server instantly retrieves the pre-calculated distance (e.g., 340km), applies a transport cost heuristic (₹0.8 per km per quintal), and shows the buyer their exact **Net Realization Price**.

---

## 2. Partial / Mocked Functionalities

### A. Real-Time Mandi API (AGMARKNET)
- **Current State**: We are simulating AGMARKNET price feeds using seeded JSON data (`seed-loader.ts`) to guarantee the demo works perfectly without relying on unreliable third-party government APIs during the pitch.
- **How it should work (Future Scope)**: A CRON job (serverless worker) will ping the actual Gov AGMARKNET SOAP/REST endpoints every morning at 9 AM, sanitize the XML/JSON response, and push the normalized daily prices into our PostgreSQL database. 

### B. Quality Grading
- **Current State**: Self-declared FAQ (Fair Average Quality) grades (A, B, C).
- **How it should work (Future Scope)**: Integration with AI-based crop assaying APIs (like AgNext or e-NAM assaying labs). Farmers will upload photos of their crop, and a computer vision model will assess moisture content and physical damage to auto-assign a verifiable grade.

---

## 3. Deferred Functionalities (Phase 2 Roadmap)

*If the jury asks: "How do you handle disputes?" or "What about actual logistics?" use these answers.*

### A. Digital Payment Escrow & Smart Contracts
- **The Plan**: We will integrate a payment gateway (like Razorpay Route or a banking nodal account) to act as an escrow. 
- **The Flow**: When a buyer accepts an offer, they transfer funds to the escrow. The funds are locked. Once the logistics partner marks the lot as "Delivered" and the buyer signs off on the quality (weighbridge receipt), the escrow automatically releases funds to the farmer's bank account via UPI/NEFT.

### B. Logistics Coordination (Kisan Rath Integration)
- **The Plan**: We will open an API bridge to national transport aggregators or local truck unions.
- **The Flow**: When a transaction is finalized, the system will automatically broadcast a "Load Request" to local truckers, allowing them to bid for the delivery route, effectively Uber-izing the farm-gate pickup.

### C. Dispute Resolution Mechanism
- **The Plan**: A formal mediation workflow. If a buyer claims the crop is Grade C instead of Grade A upon arrival, the payment remains frozen in escrow. An APMC-licensed arbitrator is digitally assigned to review the weighbridge and assaying receipts to make a final binding decision.
