import { NextResponse } from "next/server";

import { isValidAdminPassword, setPasswordAdminSession } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidAdminPassword(password)) {
    return NextResponse.json(
      { success: false, message: "That password is not correct." },
      { status: 401 },
    );
  }

  await setPasswordAdminSession();

  return NextResponse.json({ success: true });
}
