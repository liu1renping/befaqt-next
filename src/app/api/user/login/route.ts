import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0)
      return NextResponse.json(
        { message: "Invalid input", errors },
        { status: 400 }
      );

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
          errors: { email: "Email not found" },
        },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
          errors: { password: "Incorrect password" },
        },
        { status: 401 }
      );
    }

    // create a session for the user
    await createSession({
      userData: {
        _id: user._id.toString(),
        email: user.email,
        fname: user.fname,
        role: user.role,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
