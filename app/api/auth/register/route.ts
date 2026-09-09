import { NextResponse } from "next/server";
import { createUser, getUserByPhone } from "@/lib/data/store";
import { createSession } from "@/lib/auth";
import crypto from "crypto";
import type { District } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { name, phone, password, role, district } = await req.json();

    if (!name || !phone || !password || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (getUserByPhone(phone)) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 });
    }

    // Simple hash for demo
    const salt = "sarvah_salt";
    const passwordHash = crypto.scryptSync(password, salt, 32).toString("hex");

    const user = createUser({
      name,
      phone,
      passwordHash,
      role,
      district: (district as District) || "Latur",
    });

    await createSession(user);

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
