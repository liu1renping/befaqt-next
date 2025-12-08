import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { JWT_NAME } from "@/lib/constants";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(JWT_NAME, "", { expires: new Date(0) });
  return NextResponse.json({ message: "Logged out" });
}
