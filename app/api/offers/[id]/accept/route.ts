// app/api/offers/[id]/accept/route.ts
// POST /api/offers/[id]/accept
// Accepts an offer, closes the lot, creates a transaction record.

import { NextResponse } from "next/server";
import { acceptOffer } from "@/lib/data/store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  const result = acceptOffer(id);
  if (!result) {
    return NextResponse.json({ error: "offer not found" }, { status: 404 });
  }

  const acceptHeader = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  const isFormSubmit =
    acceptHeader.includes("text/html") ||
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  if (isFormSubmit) {
    let locale = "en";
    try {
      const formData = await request.formData();
      const formLocale = formData.get("locale")?.toString();
      if (formLocale) locale = formLocale;
    } catch {
      const referer = request.headers.get("referer");
      if (referer && referer.includes("/mr/")) locale = "mr";
    }
    return NextResponse.redirect(
      new URL(`/${locale}/transactions/${result.transaction.id}`, request.url),
      303
    );
  }

  return NextResponse.json({
    offer: result.offer,
    transaction: result.transaction,
    lot: result.lot,
  });
}
