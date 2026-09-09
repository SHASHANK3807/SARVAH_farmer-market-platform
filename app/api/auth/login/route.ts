import { NextResponse } from "next/server";
import { getUserByPhone } from "@/lib/data/store";
import { createSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = getUserByPhone(phone);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const salt = "sarvah_salt";
    const passwordHash = crypto.scryptSync(password, salt, 32).toString("hex");

    if (user.passwordHash !== passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user);

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
