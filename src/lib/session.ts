import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { JWT_NAME, JWT_SECRET, JWT_SESSION_DURATION } from "./constants";

const secret = new TextEncoder().encode(JWT_SECRET);

export type SessionPayload = JWTPayload & {
  userId: string;
  email: string;
  fname: string;
  role: string;
};

export async function signSession(payload: SessionPayload, expiration = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as SessionPayload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(JWT_NAME)?.value ?? null;
  if (!session) return null;
  try {
    return await verifySession(session);
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(JWT_NAME)?.value ?? null;
  if (!session) return;

  try {
    const payload = await verifySession(session);
    // Extend expiration
    const res = NextResponse.next();
    res.cookies.set(JWT_NAME, await signSession(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + JWT_SESSION_DURATION),
    });
    return res;
  } catch {
    return;
  }
}
