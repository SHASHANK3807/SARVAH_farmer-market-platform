// components/shared/LocaleToggle.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchTo = currentLocale === "en" ? "mr" : "en";
  const newPath = pathname.startsWith(`/${currentLocale}`)
    ? pathname.replace(`/${currentLocale}`, `/${switchTo}`)
    : `/${switchTo}${pathname}`;

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-medium"
      onClick={() => router.push(newPath)}
    >
      {switchTo === "en" ? "English" : "मराठी"}
    </Button>
  );
}
