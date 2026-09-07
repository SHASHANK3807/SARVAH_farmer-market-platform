// app/[locale]/page.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-4">
          Problem Statement #26132 • Maharashtra State Innovation Society
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-emerald-950">
          {t("landing.title")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("landing.subtitle")}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4 font-bold">
              👨‍🌾
            </div>
            <h3 className="text-xl font-bold mb-2">Farmer Persona (Priya Patil)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Real-time mandi prices, localized Recharts trend, and the smart SELL/WAIT decision engine to stop distress selling.
            </p>
          </div>
          <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Link href="./farmer?crop=soybean&district=latur">{t("landing.farmerCta")}</Link>
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-blue-500 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-4 font-bold">
              🏢
            </div>
            <h3 className="text-xl font-bold mb-2">Buyer Persona (Rajan Traders)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Browse farmer lots and FPO aggregated bulk pools, post quality demands, and make counter-offers in a transparent ledger.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="w-full border-blue-600 text-blue-700 hover:bg-blue-50">
            <Link href="./buyer/lots">{t("landing.buyerCta")}</Link>
          </Button>
        </div>
      </div>

      <section className="bg-emerald-50/60 border border-emerald-100 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-emerald-900 mb-2">{t("landing.problemHeading")}</h2>
        <p className="text-sm leading-relaxed text-emerald-950/80">{t("landing.problemText")}</p>
      </section>
    </div>
  );
}
