// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import Link from "next/link";

export const metadata = {
  title: "Sarvah — Friend of the Market",
  description: "Maharashtra farm-gate price discovery and marketplace for smallholders.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params);
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/${locale}`} className="text-xl font-bold text-emerald-700 flex items-center gap-2">
            🌾 Sarvah
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href={`/${locale}/farmer?crop=soybean&district=latur`} className="text-sm font-medium hover:text-emerald-700 hover:underline">
              {locale === "mr" ? "शेतकरी डॅशबोर्ड" : "Farmer"}
            </Link>
            <Link href={`/${locale}/buyer/lots`} className="text-sm font-medium hover:text-emerald-700 hover:underline">
              {locale === "mr" ? "खरेदीदार पोर्टल" : "Buyer"}
            </Link>
            <Link href={`/${locale}/transactions`} className="text-sm font-medium hover:text-emerald-700 hover:underline">
              {locale === "mr" ? "व्यवहार" : "Transactions"}
            </Link>
            <Link href={`/${locale}/roadmap`} className="text-sm font-medium hover:text-emerald-700 hover:underline">
              {locale === "mr" ? "रोडमॅप" : "Roadmap"}
            </Link>
            <LocaleToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-muted/30">
        <div className="container mx-auto px-4">
          <p>Sarvah — Maharashtra State Innovation Society (Hackathon PS #26132)</p>
        </div>
      </footer>
    </NextIntlClientProvider>
  );
}
