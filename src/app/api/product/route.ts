import { NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import { ProductModel } from "@/models/Product";

export async function GET() {
  await connectDB();
  const products = await ProductModel.find().sort({ name: 1 });
  return NextResponse.json(products);
}
