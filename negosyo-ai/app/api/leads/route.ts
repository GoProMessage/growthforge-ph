import { NextRequest, NextResponse } from "next/server";
import { getLeads, updateLeadStatus, deleteLead } from "@/lib/db";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "growthforge2024";

function authorized(req: NextRequest): boolean {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const leads = await getLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/leads]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const ok = await updateLeadStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[PATCH /api/leads]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id query param required" }, { status: 400 });
    }
    const ok = await deleteLead(id);
    return NextResponse.json({ success: ok });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[DELETE /api/leads]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
