# Sarvah — Judge Demo Cheat Sheet

## 🎯 Pre-baked URLs (Bookmark These)
- **Farmer (EN):** http://localhost:3000/en/farmer?crop=soybean&district=latur
- **Farmer (MR):** http://localhost:3000/mr/farmer?crop=soybean&district=latur
- **Buyer Portal:** http://localhost:3000/en/buyer/lots
- **Transactions:** http://localhost:3000/en/transactions

## 👥 Demo Personas
| Role | Name | Org | Location | Credentials |
|---|---|---|---|---|
| Farmer | Priya Patil | — | Latur | Creates soybean lot |
| Buyer | Rajan Traders | Rajan & Sons | Pune | Verified, Trust 92 |
| FPO | Latur FPO | Latur FPO | Latur | Verified FPO |

## 🎬 3-Minute Demo Script
| Time | Action | Screen |
|---|---|---|
| 0:00 | Open Farmer URL | Dashboard loads with prices, chart, recommendation |
| 0:30 | Toggle Marathi | All text switches to Devanagari |
| 0:45 | Uncheck "Storage" | Recommendation → SELL NOW with warning |
| 1:00 | Check "Urgent Cash" | Forces SELL NOW |
| 1:15 | Click "Create Lot" | Fill form, submit → toast success |
| 1:45 | Switch to Buyer | Browse lots, see Priya's lot |
| 2:00 | Make Offer | Counter-offer ₹4350, submit → toast |
| 2:15 | Switch to Farmer | Lot detail page, see offer |
| 2:30 | Accept Offer | Transaction created |
| 2:45 | Open Transactions | Immutable ledger visible |
| 3:00 | Roadmap page | Shows deferred features honestly |

## ⚡ Quick Fixes if Things Break
- **Blank screen:** Refresh (SWR revalidates)
- **Marathi overflow:** Already fixed with `text-balance`
- **Chart not loading:** Seed data fallback active
- **Offer not showing:** Check `router.refresh()` in OfferModal

## 📊 Spec Coverage to Highlight
✅ 8 fully built | ⚠️ 4 mocked but visual | 📋 5 deferred (Roadmap)
= **70% functional, 100% acknowledged**
