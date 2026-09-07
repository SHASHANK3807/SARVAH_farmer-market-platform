// components/farmer/CropDistrictSelector.tsx
"use client";
import { useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export function CropDistrictSelector() {
  const t = useTranslations("farmer");
  const [crop, setCrop] = useQueryState("crop", { defaultValue: "soybean" });
  const [district, setDistrict] = useQueryState("district", { defaultValue: "latur" });

  const cropLower = (crop || "soybean").toLowerCase();
  const districtLower = (district || "latur").toLowerCase();

  return (
    <div className="flex gap-4 flex-wrap bg-card p-4 rounded-xl border">
      <div className="flex-1 min-w-[180px]">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
          {t("selectCrop")}
        </Label>
        <Select value={cropLower} onValueChange={(v: string) => setCrop(v)}>
          <SelectTrigger className="w-full font-medium">
            <SelectValue placeholder="Crop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soybean">🌱 Soybean (सोयाबीन)</SelectItem>
            <SelectItem value="onion">🧅 Onion (कांदा)</SelectItem>
            <SelectItem value="tur">🌾 Tur / Arhar (तूर)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
          {t("selectDistrict")}
        </Label>
        <Select value={districtLower} onValueChange={(v: string) => setDistrict(v)}>
          <SelectTrigger className="w-full font-medium">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latur">📍 Latur (लातूर)</SelectItem>
            <SelectItem value="pune">📍 Pune (पुणे)</SelectItem>
            <SelectItem value="nashik">📍 Nashik (नाशिक)</SelectItem>
            <SelectItem value="solapur">📍 Solapur (सोलापूर)</SelectItem>
            <SelectItem value="nagpur">📍 Nagpur (नागपूर)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
