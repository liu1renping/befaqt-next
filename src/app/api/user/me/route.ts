import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(null);
  }

  // Transform session payload to User interface expected by AuthContext
  const user = {
    id: session.userId,
    name: session.fname,
    email: session.email,
  };

  return NextResponse.json(user);
}
