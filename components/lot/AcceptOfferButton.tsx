"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AcceptOfferButton({ offerId, locale, lotId }: { offerId: string; locale: string; lotId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch(`/api/offers/${offerId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ locale }).toString(),
      });
      if (res.ok) {
        toast.success("Deal Closed", { description: "Offer accepted, transaction recorded" });
        router.push(`/${locale}/transactions/${lotId}`);
      } else {
        toast.error("Failed", { description: "Could not accept offer" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isPending} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
        {isPending ? "Accepting…" : "Accept Offer"}
      </Button>
    </form>
  );
}
