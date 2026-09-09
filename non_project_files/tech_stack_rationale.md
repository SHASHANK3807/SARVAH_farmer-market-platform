# Tech Stack Rationale & Architecture
**A cheat sheet for defending technical choices and explaining why this stack was selected for the Sarvah platform.**

---

## 1. Core Framework: Next.js (App Router)

### Why we chose it:
- **Full-Stack Capabilities**: Next.js allows us to write both the frontend React code and the backend API routes (`/api/lots`, `/api/auth/register`) in a single unified codebase. This radically reduced our development time during the hackathon.
- **Server Components (RSC)**: Next.js 14+ uses React Server Components, meaning we can fetch data securely on the server without sending heavy JavaScript bundles to the client. This is critical for users in rural areas with poor 3G/4G connectivity, as the pages load significantly faster.
- **SEO & Social Sharing**: Server-Side Rendering (SSR) ensures that if a farmer shares a lot link on WhatsApp, the preview cards will unfurl perfectly because the HTML is pre-rendered.

---

## 2. Language: TypeScript

### Why we chose it:
- **End-to-End Type Safety**: By defining strict interfaces (like `Lot`, `User`, `Transaction`), TypeScript catches bugs at compile time before the app even runs.
- **Data Integrity**: In an agricultural marketplace handling pricing and financial transactions, we cannot afford undefined variables or type coercion errors (e.g., treating a string `"500"` as a number `500` in a math calculation). TypeScript ensures strict numeric handling.

---

## 3. Styling: Tailwind CSS v4 & Shadcn UI

### Why we chose it:
- **Rapid Prototyping**: Tailwind allows us to build a premium, highly responsive UI incredibly fast without managing messy external `.css` files.
- **Component Consistency**: We utilized Radix UI primitives (via Shadcn) to build accessible dropdowns, modals, and tabs. This ensures the app is fully usable by screen readers and operates smoothly on mobile browsers.
- **Responsive by Default**: Farmers will primarily access Sarvah on low-end Android smartphones. Tailwind’s mobile-first breakpoints ensure the dashboard looks native on a 5-inch screen and scales beautifully to a desktop for institutional buyers.

---

## 4. Internationalization: next-intl

### Why we chose it:
- **First-Class Localization**: The problem statement requires serving Maharashtra's farmers. `next-intl` allowed us to build a robust Marathi-first interface where every single string is mapped to JSON dictionaries (`en.json` and `mr.json`). 
- **Dynamic Routing**: It handles subpath routing automatically (e.g., `/mr/farmer` vs `/en/farmer`), making language context persistent across the user's session.

---

## 5. Security & Session Management: jose (JWT)

### Why we chose it:
- **Stateless Authentication**: We opted for JSON Web Tokens signed by the edge-compatible `jose` library. This means we don't have to constantly query a database to check if a user is logged in. The signed HTTP-only cookie contains everything we need.
- **Edge Compatibility**: Unlike heavier auth libraries, `jose` is ultra-lightweight and designed to run on Vercel Edge functions, ensuring lightning-fast middleware route protection.

---

## 6. Data Visualization: Recharts

### Why we chose it:
- **Declarative Charts**: Recharts integrates natively with React to build the 30-day Mandi Price Trend charts. It handles complex SVG rendering effortlessly and performs well on mobile devices without crashing the browser.

---

## 7. Storage: Local JSON (Prototype Phase)

### Why we chose it:
- **Hackathon Agility**: To avoid the overhead of setting up, hosting, and migrating a heavy PostgreSQL database during a time-constrained hackathon, we built a robust JSON filesystem abstraction (`lib/data/store.ts`).
- **Future Migration Path**: Because we strictly typed our data access layer, replacing the `JSON.parse` logic with actual Prisma or Drizzle ORM calls to a PostgreSQL database in Phase 2 will take less than a day, without touching a single line of frontend UI code.
