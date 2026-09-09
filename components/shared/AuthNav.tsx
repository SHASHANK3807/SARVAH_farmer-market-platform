"use client";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import type { User } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AuthNav() {
  const locale = useLocale();
  const router = useRouter();
  const { data } = useSWR<{ user: User | null }>("/api/auth/me", fetcher);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    mutate("/api/auth/me", { user: null }, false);
    router.push(`/${locale}`);
    router.refresh(); // Full reload to clear cache
  };

  if (!data?.user) return null;

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
      {locale === "mr" ? "लॉगआउट" : "Logout"}
    </Button>
  );
}
