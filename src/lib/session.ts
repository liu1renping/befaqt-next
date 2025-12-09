import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import {
  JWT_NAME,
  JWT_SECRET,
  JWT_SESSION_DURATION,
  JWT_EXPIRATION,
  USER_ROLE,
} from "./constants";

const secret = new TextEncoder().encode(JWT_SECRET);

export type SessionPayload = JWTPayload & {
  userData: {
    _id: string;
    email: string;
    fname: string;
    role: USER_ROLE;
  };
};

// create a session for the user
export async function createSession(payload: SessionPayload) {
  // sign the payload into a JWT token
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(JWT_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + JWT_SESSION_DURATION),
  });
}

// clear the JWT token from the cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(JWT_NAME, "", { expires: new Date(0) });
}

// get the session from the cookie
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  try {
    const token = request.cookies.get(JWT_NAME)?.value ?? null;
    if (!token) return;
    const { payload } = await jwtVerify(token, secret);
    // sign a new token with the same payload
    await createSession(payload as SessionPayload);
  } catch (error) {
    // if the token is invalid, clear the session and return an error
    await clearSession();
    console.error(error);
    return;
  }
}
