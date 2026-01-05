import { COMPANY_NAME } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(`<h1>${COMPANY_NAME} API is running!</h1>`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
