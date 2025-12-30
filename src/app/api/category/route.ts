import { NextResponse } from "next/server";

import connectDB from "@/lib/mongoose";
import { CategoryModel } from "@/models/Category";

export async function GET() {
  await connectDB();
  const categories = await CategoryModel.find().sort({ name: 1 });
  return NextResponse.json(categories);
}
