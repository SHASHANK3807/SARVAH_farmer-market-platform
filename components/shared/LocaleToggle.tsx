"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const nextLocale = locale === "en" ? "mr" : "en";
  const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push(newPath)}
    >
      {nextLocale === "en" ? "English" : "मराठी"}
    </Button>
  );
}