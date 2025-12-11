import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { UserModel as User } from "@/models/User";
import { formatMongooseError } from "@/lib/mongooseError";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userData?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userData._id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return NextResponse.json(
      { message: "Error fetching profile", error: err },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userData?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Prevent updating sensitive fields
    delete body.password;
    delete body.role;
    delete body.email; // Prevent email change for now to avoid re-verification logic complexity

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      session.userData._id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}
