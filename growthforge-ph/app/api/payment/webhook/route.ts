import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data?.attributes) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    const checkoutId: string = data.attributes.checkout_session_id ?? data.id ?? "";
    const paymentMethod: string =
      data.attributes.payments?.[0]?.attributes?.source?.type ?? "";

    if (type === "checkout_session.payment.paid") {
      await updatePaymentStatus(checkoutId, "paid", paymentMethod);
    } else if (type === "checkout_session.expired") {
      await updatePaymentStatus(checkoutId, "expired");
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/payment/webhook]", msg);
    // Always return 200 to PayMongo so it doesn't retry
    return NextResponse.json({ received: true, warning: msg });
  }
}
