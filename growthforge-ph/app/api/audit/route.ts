import { NextRequest, NextResponse } from "next/server";
import { getAudits, addAudit, updateAuditStatus } from "@/lib/db";
import { calculateAuditScore } from "@/lib/audit-score";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "growthforge2024";

function authorized(req: NextRequest): boolean {
  return req.headers.get("x-admin-key") === ADMIN_KEY;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const audits = await getAudits();
    return NextResponse.json({ audits });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/audit]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, businessName, city, industry,
      yearsInBusiness, employees, monthlyRevenue, biggestChallenge, answers,
    } = body;

    if (!name || !email || !businessName || !answers) {
      return NextResponse.json(
        { error: "name, email, businessName, and answers are required" },
        { status: 400 }
      );
    }

    const scores = calculateAuditScore(answers);

    const audit = await addAudit({
      name, email, phone: phone ?? "",
      businessName, city: city ?? "", industry: industry ?? "",
      yearsInBusiness: yearsInBusiness ?? "", employees: employees ?? "",
      monthlyRevenue: monthlyRevenue ?? "", biggestChallenge: biggestChallenge ?? "",
      answers, scores,
    });

    return NextResponse.json({ success: true, audit, scores }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/audit]", msg);
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
    const ok = await updateAuditStatus(id, status);
    return NextResponse.json({ success: ok });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[PATCH /api/audit]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
