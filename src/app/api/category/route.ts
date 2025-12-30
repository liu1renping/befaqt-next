import { NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories = await CategoryModel.find().sort({ order: 1, name: 1 });
  return NextResponse.json(categories);
}
