import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { USER_ROLE } from "./constants";

const JWT_NAME = process.env.JWT_NAME ?? "project_token";
const JWT_SECRET = process.env.JWT_SECRET ?? "project_jwt_secret_key";
const secret = new TextEncoder().encode(JWT_SECRET);

// expiration duration for JWT tokens, used signSession
const JWT_EXPIRATION = "7d"; // 7 days
// expiration duration for JWT cookies in milliseconds, used in cookies.set
const JWT_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

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
  try {
    // sign the payload into a JWT token
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRATION)
      .sign(secret);
    // set the JWT token in the cookie
    const cookieStore = await cookies();
    cookieStore.set(JWT_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + JWT_SESSION_DURATION),
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
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

// update the session to refresh the expiration date
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

// clear the JWT token from the cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(JWT_NAME, "", { expires: new Date(0) });
}
