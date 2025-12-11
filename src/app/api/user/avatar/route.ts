import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";

import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { UserModel as User } from "@/models/User";
import { MAX_AVATAR_SIZE } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userData?._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > MAX_AVATAR_SIZE) {
      return NextResponse.json(
        {
          message: `File too large. Maximum size is ${MAX_AVATAR_SIZE / 1024 / 1024} MB.`,
        },
        { status: 400 }
      );
    }

    // Get current user to check for existing avatar
    await connectDB();
    const currentUser = await User.findById(session.userData._id);
    if (currentUser?.avatar) {
      // Extract the filename from the URL (e.g., /uploads/avatars/filename.jpg)
      const oldAvatarPath = path.join(
        process.cwd(),
        "public",
        currentUser.avatar
      );
      try {
        await unlink(oldAvatarPath);
      } catch (err) {
        console.error("Error deleting old avatar:", err);
        // Continue even if deletion fails (e.g., file not found)
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create a unique filename
    const filename = `${session.userData.fname}-${file.name.replace(/\s/g, "_")}-${Date.now()}`;

    // Ensure the uploads directory exists - usually done in build/setup but good to be safe
    // We assume public/uploads/avatars exists based on previous step
    const uploadDir = path.join(process.cwd(), "public/uploads/avatars");

    await writeFile(path.join(uploadDir, filename), buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      session.userData._id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar uploaded successfully",
      url: avatarUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      {
        message: "Error uploading avatar",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
