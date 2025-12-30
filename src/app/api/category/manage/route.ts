import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";
import { formatMongooseError } from "@/lib/mongooseError";
import { USER_ROLE } from "@/lib/constants";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const categories = await CategoryModel.find({
      createdBy: session.userData._id,
    }).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();
    const category = await CategoryModel.create({
      ...body,
      createdBy: session.userData._id,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Category ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Optional: Check if user owns the category or is admin
    const category = await CategoryModel.findOne({ _id });
    if (category.createdBy.toString() !== session.userData._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (err) {
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Category ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    const category = await CategoryModel.findById(id);
    if (category?.createdBy.toString() !== session.userData._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json(
      { message: "Error deleting category" },
      { status: 500 }
    );
  }
}
