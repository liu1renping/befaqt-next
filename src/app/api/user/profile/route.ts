import { NextResponse } from "next/server";

import { createSession, getSession, SessionPayload } from "@/lib/session";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { formatMongooseError } from "@/lib/mongooseError";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userData?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await UserModel.findById(session.userData._id).select(
      "-password"
    );

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

    delete body.email; // Prevent email change for now to avoid re-verification logic complexity

    await connectDB();

    // Check if avatar has changed
    if (body.avatar) {
      const existingUser = await UserModel.findById(session.userData._id);
      if (
        existingUser &&
        existingUser.avatar &&
        existingUser.avatar !== body.avatar
      ) {
        await deleteImageFromCloudinary(existingUser.avatar);
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.userData._id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // recreate the session with the new user data
    const sessionPayload: SessionPayload = {
      userData: {
        _id: updatedUser._id.toString(),
        email: updatedUser.email,
        fname: updatedUser.fname,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      },
    };
    await createSession(sessionPayload);

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}
