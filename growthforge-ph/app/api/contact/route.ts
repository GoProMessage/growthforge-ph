import { NextRequest, NextResponse } from "next/server";
import { addLead } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, business, email, phone, service, message } = body;

    if (!name || !email || !business) {
      return NextResponse.json(
        { error: "Name, email, and business are required" },
        { status: 400 }
      );
    }

    const lead = await addLead({ name, business, email, phone, service, message });
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/contact]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
