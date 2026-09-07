// app/[locale]/buyer/demands/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function NewDemandPage() {
  const router = useRouter();
  const locale = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [crop, setCrop] = useState("soybean");
  const [district, setDistrict] = useState("Latur");
  const [qtyTons, setQtyTons] = useState("20");
  const [priceMin, setPriceMin] = useState("4300");
  const [priceMax, setPriceMax] = useState("4500");
  const [grade, setGrade] = useState("A");
  const [deliveryWindowDays, setDeliveryWindow] = useState("7");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/demand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerId: "b1", // Rajan Agro Processors
        crop,
        district,
        qtyTons: Number(qtyTons),
        priceMinPerQuintal: Number(priceMin),
        priceMaxPerQuintal: Number(priceMax),
        grade,
        deliveryWindowDays: Number(deliveryWindowDays),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      router.push(`/${locale}/buyer/demands`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-sm border">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold">Post Institutional Crop Demand</CardTitle>
          <p className="text-xs text-muted-foreground">
            This will be surfaced to smallholders and FPOs matching this crop and district.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label className="font-semibold">Crop Needed</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="soybean">🌱 Soybean (सोयाबीन)</SelectItem>
                  <SelectItem value="onion">🧅 Onion (कांदा)</SelectItem>
                  <SelectItem value="tur">🌾 Tur / Arhar (तूर)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-semibold">Target Delivery APMC / District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latur">Latur</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Nashik">Nashik</SelectItem>
                  <SelectItem value="Solapur">Solapur</SelectItem>
                  <SelectItem value="Nagpur">Nagpur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-semibold">Required Volume (Metric Tons)</Label>
              <Input
                type="number"
                value={qtyTons}
                onChange={(e) => setQtyTons(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Min Price (₹/quintal)</Label>
                <Input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-semibold">Max Price (₹/quintal)</Label>
                <Input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="font-semibold">Minimum Grade Required</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A (FAQ Standard)</SelectItem>
                    <SelectItem value="B">Grade B (Medium)</SelectItem>
                    <SelectItem value="C">Grade C (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-semibold">Delivery Window (Days)</Label>
                <Input
                  type="number"
                  value={deliveryWindowDays}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-base font-semibold">
              {submitting ? "Publishing Demand…" : "Broadcast Demand to Farmers & FPOs"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
