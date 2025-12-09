import { NextResponse } from "next/server";

import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
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
