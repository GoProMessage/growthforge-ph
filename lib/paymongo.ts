// @ts-nocheck
const PAYMONGO_BASE_URL = "https://api.paymongo.com/v1";

function getAuthHeader(): string {
  const key = process.env.PAYMONGO_SECRET_KEY || "sk_test_placeholder";
  const encoded = Buffer.from(`${key}:`).toString("base64");
  return `Basic ${encoded}`;
}

export interface CheckoutSessionParams {
  planName: string;
  amount: number; // in centavos (e.g. ₱9,999 = 999900)
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  checkoutId: string;
  checkoutUrl: string;
}

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const response = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: params.customerName,
            email: params.customerEmail,
            phone: params.customerPhone || "",
          },
          line_items: [
            {
              amount: params.amount,
              currency: "PHP",
              description: `GrowthForge PH — ${params.planName} (monthly)`,
              name: params.planName,
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash", "paymaya", "card", "grab_pay"],
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
          description: `Monthly subscription — ${params.planName}`,
        },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    const detail = err?.errors?.[0]?.detail || "PayMongo checkout creation failed";
    throw new Error(detail);
  }

  const data = await response.json();
  return {
    checkoutId: data.data.id as string,
    checkoutUrl: data.data.attributes.checkout_url as string,
  };
}

export async function getCheckoutSession(checkoutId: string): Promise<{
  status: string;
  paymentMethodUsed: string;
}> {
  const response = await fetch(
    `${PAYMONGO_BASE_URL}/checkout_sessions/${checkoutId}`,
    {
      headers: { Authorization: getAuthHeader() },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch checkout session");
  }

  const data = await response.json();
  const attrs = data.data.attributes;
  return {
    status: attrs.payment_intent?.attributes?.status || attrs.status || "unknown",
    paymentMethodUsed:
      attrs.payment_method_used || attrs.payment_intent?.attributes?.payment_method_allowed?.[0] || "",
  };
}
