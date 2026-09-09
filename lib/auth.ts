import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { User } from "./types";

const secretKey = process.env.JWT_SECRET || "sarvah-hackathon-super-secret-key-for-jwt-signing";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });
  const cookieStore = await cookies();
  cookieStore.set("auth_session", session, { expires, httpOnly: true });
}

export async function getSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set("auth_session", "", { expires: new Date(0) });
}
