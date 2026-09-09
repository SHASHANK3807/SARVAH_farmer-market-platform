// components/lot/LotForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import useSWR from "swr";
import type { User } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LotSchema = z.object({
  crop: z.enum(["soybean", "onion", "tur"]),
  qtyTons: z.number().positive().max(1000),
  grade: z.enum(["A", "B", "C"]),
  askingPricePerQuintal: z.number().positive().max(100000),
  qualityNotes: z.string().optional().default(""),
  district: z.enum(["Latur", "Pune", "Nashik", "Solapur", "Nagpur"]),
  farmerName: z.string().min(1),
  farmerId: z.string().min(1),
  isFpoPool: z.boolean().optional().default(false),
  fpoName: z.string().optional(),
});

export function LotForm({ defaultCrop, defaultDistrict }: { defaultCrop?: string; defaultDistrict?: string }) {
  const t = useTranslations("lot");
  const locale = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSWR<{ user: User | null }>("/api/auth/me", fetcher);

  const [crop, setCrop] = useState(defaultCrop ? defaultCrop.toLowerCase() : "soybean");
  const [qtyTons, setQtyTons] = useState("10");
  const [grade, setGrade] = useState("A");
  const [askingPricePerQuintal, setAskingPrice] = useState("4400");
  const [qualityNotes, setQualityNotes] = useState("Moisture < 9.5%, clean machine-harvested");
  const [district, setDistrict] = useState(
    defaultDistrict ? defaultDistrict.charAt(0).toUpperCase() + defaultDistrict.slice(1).toLowerCase() : "Latur"
  );
  const [isFpoPool, setIsFpoPool] = useState(true);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const parsed = LotSchema.safeParse({
      crop,
      qtyTons: Number(qtyTons),
      grade,
      askingPricePerQuintal: Number(askingPricePerQuintal),
      qualityNotes,
      district,
      farmerName: session?.user?.name || "Unknown Farmer",
      farmerId: session?.user?.id || "f1",
      isFpoPool,
      fpoName: isFpoPool ? "Latur Kisan FPO" : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid input");
      setSubmitting(false);
      return;
    }
    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      toast.error("Failed", { description: "Could not create lot" });
      setSubmitting(false);
      return;
    }
    const lot = await res.json();
    toast.success("Success", { description: "Lot created successfully" });
    setSubmitting(false);
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-bold">{t("createTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="font-semibold">{t("crop")}</Label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="mt-1 font-medium"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="soybean">🌱 Soybean (सोयाबीन)</SelectItem>
                <SelectItem value="onion">🧅 Onion (कांदा)</SelectItem>
                <SelectItem value="tur">🌾 Tur / Arhar (तूर)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-semibold">{t("qtyTons")}</Label>
              <Input
                type="number"
                value={qtyTons}
                onChange={(e) => setQtyTons(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label className="font-semibold">{t("grade")}</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger className="mt-1 font-medium"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">{t("gradeA")}</SelectItem>
                  <SelectItem value="B">{t("gradeB")}</SelectItem>
                  <SelectItem value="C">{t("gradeC")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="font-semibold">{t("askingPrice")}</Label>
            <Input
              type="number"
              value={askingPricePerQuintal}
              onChange={(e) => setAskingPrice(e.target.value)}
              required
              className="mt-1"
            />
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {t("refPriceToday")}
            </span>
          </div>

          <div>
            <Label className="font-semibold">{t("qualityNotes")}</Label>
            <Textarea
              value={qualityNotes}
              onChange={(e) => setQualityNotes(e.target.value)}
              placeholder={t("qualityNotesPlaceholder")}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-semibold">{t("location")}</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="mt-1 font-medium"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Latur">{locale === "mr" ? "📍 लातूर (Latur)" : "📍 Latur"}</SelectItem>
                <SelectItem value="Pune">{locale === "mr" ? "📍 पुणे (Pune)" : "📍 Pune"}</SelectItem>
                <SelectItem value="Nashik">{locale === "mr" ? "📍 नाशिक (Nashik)" : "📍 Nashik"}</SelectItem>
                <SelectItem value="Solapur">{locale === "mr" ? "📍 सोलापूर (Solapur)" : "📍 Solapur"}</SelectItem>
                <SelectItem value="Nagpur">{locale === "mr" ? "📍 नागपूर (Nagpur)" : "📍 Nagpur"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-emerald-300 bg-emerald-50/80 p-3.5 space-y-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                id="fpoPool"
                checked={isFpoPool}
                onChange={(e) => setIsFpoPool(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-bold text-emerald-950">
                {t("fpoPoolTitle")}
              </span>
            </label>
            <p className="text-xs text-emerald-900/80 pl-6.5 leading-relaxed">
              {t("fpoPoolDesc")}
            </p>
            {isFpoPool && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border pl-6.5 mt-2">
                💡 FPO pools typically command +3-5% premium vs individual lots due to volume & quality assurance
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full py-5 font-semibold text-base">
              {locale === "mr" ? "मागे जा" : "Back"}
            </Button>
            <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 py-5 font-semibold text-base">
              {submitting ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
