// app/api/buyers/route.ts
import { NextResponse } from "next/server";
import { seedBuyers } from "@/lib/data/seed-loader";

export async function GET() {
  return NextResponse.json(seedBuyers);
}
