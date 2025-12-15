import { NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import { ProductModel } from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort({ name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
