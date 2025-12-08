import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import connectDB from "@/lib/db";
import User from "@/models/User";
import { signSession } from "@/lib/session";
import {
  JWT_EXPIRATION,
  JWT_NAME,
  JWT_SESSION_DURATION,
} from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Call signSession with flat user object as per new SessionPayload definition
    const session = await signSession(
      {
        userId: user._id.toString(),
        email: user.email,
        fname: user.name, // Mapping 'name' to 'fname'
        role: "USER", // Default role
      },
      JWT_EXPIRATION
    );

    // Use JWT_SESSION_DURATION for the cookie expiration date
    const cookieStore = await cookies();
    cookieStore.set(JWT_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + JWT_SESSION_DURATION),
    });

    return NextResponse.json(
      {
        message: "Logged in successfully",
        user: { id: user._id.toString(), name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
