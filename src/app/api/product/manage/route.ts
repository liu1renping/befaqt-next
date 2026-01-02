import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { ProductModel } from "@/models/Product";
import { formatMongooseError } from "@/lib/mongooseError";
import { USER_ROLE } from "@/lib/constants";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.SELLER) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const products = await ProductModel.find({
      createdBy: session.userData._id,
    }).sort({ name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.SELLER) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();
    const product = await ProductModel.create({
      ...body,
      createdBy: session.userData._id,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.SELLER) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Optional: Check if user owns the product or is admin
    const product = await ProductModel.findOne({ _id });
    if (product.createdBy.toString() !== session.userData._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Delete images that were removed
    if (product.images && product.images.length > 0) {
      const newImages = updateData.images || [];
      const removedImages = product.images.filter(
        (img: string) => !newImages.includes(img)
      );

      for (const img of removedImages) {
        await deleteImageFromCloudinary(img);
      }
    }

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    const { status, body } = formatMongooseError(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.userData.role !== USER_ROLE.SELLER) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 400 }
      );
    }

    await connectDB();
    const product = await ProductModel.findById(id);
    if (product?.createdBy.toString() !== session.userData._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    // Delete all images associated with the product
    if (product?.images && product.images.length > 0) {
      for (const img of product.images) {
        await deleteImageFromCloudinary(img);
      }
    }

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    console.error("Delete product error:", err);
    return NextResponse.json(
      { message: "Error deleting product" },
      { status: 500 }
    );
  }
}
