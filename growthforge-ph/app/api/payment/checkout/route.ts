import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/paymongo";
import { addPayment } from "@/lib/db";

const PLAN_PRICES: Record<string, number> = {
  Starter: 999900,   // ₱9,999
  Growth: 2499900,   // ₱24,999
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { planName, customerName, customerEmail, customerPhone } = await req.json();

    if (!planName || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "planName, customerName, and customerEmail are required" },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[planName];
    if (!amount) {
      return NextResponse.json({ error: "Unknown plan name" }, { status: 400 });
    }

    // Create PayMongo checkout session
    const session = await createCheckoutSession({
      planName,
      amount,
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? "",
      successUrl: `${APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${APP_URL}/#pricing`,
    });

    // Persist to DB (non-blocking — don't fail checkout if DB is misconfigured)
    try {
      await addPayment({
        checkoutId: session.checkoutId,
        planName,
        amount,
        customerName,
        customerEmail,
        customerPhone: customerPhone ?? "",
        paymentMethod: "",
        checkoutUrl: session.checkoutUrl,
      });
    } catch (dbErr) {
      console.warn("[checkout] DB write skipped:", (dbErr as Error).message);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session.checkoutUrl,
      sessionId: session.checkoutId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/payment/checkout]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
