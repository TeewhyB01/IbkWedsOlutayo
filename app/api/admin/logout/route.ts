import { NextResponse } from "next/server";

import { clearPasswordAdminSession } from "@/lib/adminAuth";

export async function POST() {
  await clearPasswordAdminSession();

  return NextResponse.json({ success: true });
}
