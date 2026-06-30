import { NextResponse } from "next/server"
import { claimDelivery } from "@/lib/deliveries-db"

// POST /api/deliveries/[id]/claim
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const driverInfo = {
      id: body.driverId ?? undefined,
      name: body.driverName ?? undefined,
      phone: body.driverPhone ?? undefined,
    }

    const result = await claimDelivery(id, driverInfo)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[POST /api/deliveries/[id]/claim]", err)
    return NextResponse.json({ error: "Failed to claim delivery" }, { status: 500 })
  }
}
