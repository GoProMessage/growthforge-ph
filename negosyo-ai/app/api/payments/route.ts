import { NextRequest, NextResponse } from "next/server";
import { getPayments } from "@/lib/db";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "growthforge2024";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const payments = await getPayments();
    return NextResponse.json({ payments });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/payments]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
