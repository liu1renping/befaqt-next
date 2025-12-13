import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { ProductModel as Product } from "@/models/Product";
import { formatMongooseError } from "@/lib/mongooseError";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
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
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();
    const product = await Product.create({
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
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    await connectDB();
    
    // Optional: Check if user owns the product or is admin
    // const product = await Product.findOne({ _id });
    // if (product.createdBy.toString() !== session.userData._id) ...

    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
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
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Product ID required" }, { status: 400 });
    }

    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
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
