// components/buyer/OfferModal.tsx
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import type { Lot } from "@/lib/types";

export function OfferModal({ lot }: { lot: Lot }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState(String(lot.askingPricePerQuintal - 50));
  const [qty, setQty] = useState(String(lot.qtyTons));
  const [message, setMessage] = useState("Ready for immediate truck pickup. 24h bank settlement.");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lotId: lot.id,
        buyerId: "b1", // Rajan Traders (Verified Buyer)
        pricePerQuintal: Number(price),
        qtyTons: Number(qty),
        message,
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold text-white">
          Make an Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize text-lg font-bold">
            Submit Offer • {lot.crop} ({lot.qtyTons} Tons)
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div>
            <Label className="font-semibold">Your Counter Offer (₹/quintal)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 font-bold text-lg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Farmer&apos;s asking rate: {formatINR(lot.askingPricePerQuintal)}/quintal
            </p>
          </div>

          <div>
            <Label className="font-semibold">Quantity you want to lift (tons)</Label>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label className="font-semibold">Note / Logistics Proposal to Farmer</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="bg-muted/40 p-3 rounded-lg border text-xs space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Total Contract Value:</span>
              <span className="text-emerald-900 font-bold">
                {formatINR(Number(price || 0) * Number(qty || 0) * 10)}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Bidding as Rajan Agro Processors (Verified APMC Trader)
            </p>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 font-semibold">
            {submitting ? "Transmitting Offer…" : "Send Digital Offer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
