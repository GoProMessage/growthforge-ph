import { NextRequest, NextResponse } from "next/server";
import { getCheckoutSession } from "@/lib/paymongo";
import { updatePaymentStatus } from "@/lib/db";
import type { Payment } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id query param required" },
        { status: 400 }
      );
    }

    const { status: rawStatus, paymentMethodUsed } =
      await getCheckoutSession(sessionId);

    // Map PayMongo status → our Payment status enum
    const statusMap: Record<string, Payment["status"]> = {
      paid: "paid",
      active: "paid",
      succeeded: "paid",
      awaiting_payment_method: "pending",
      awaiting_next_action: "pending",
      processing: "pending",
      failed: "failed",
      expired: "expired",
    };
    const dbStatus: Payment["status"] = statusMap[rawStatus] ?? "pending";

    // Update DB (non-blocking)
    try {
      await updatePaymentStatus(sessionId, dbStatus, paymentMethodUsed);
    } catch (dbErr) {
      console.warn("[verify] DB update skipped:", (dbErr as Error).message);
    }

    return NextResponse.json({
      status: dbStatus,
      paymentStatus: rawStatus,
      paymentMethod: paymentMethodUsed,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/payment/verify]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
