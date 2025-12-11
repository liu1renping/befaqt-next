import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongoose";
import { UserModel as User } from "@/models/User";
import { USER_ROLE, USER_STATUS } from "@/lib/constants";
import { formatMongooseError } from "@/lib/mongooseError";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const hashedPassword = await bcrypt.hash(body.password, 12);
    await User.create({
      ...body,
      password: hashedPassword,
      role: USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });
    // schema validation will be handled by mongoose
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Error registering user:", err);
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}
