import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { getSession } from "@/lib/session";
import { USER_ROLE, MAX_IMAGE_SIZE } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.ADMIN) {
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

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        {
          message: `File too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a unique filename
    const safeName = file.name
      .replace(/\s/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const filename = `cat-${Date.now()}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public/uploads/categories");

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/categories/${filename}`;

    return NextResponse.json({
      message: "Image uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading category image:", error);
    return NextResponse.json(
      {
        message: "Error uploading image",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
