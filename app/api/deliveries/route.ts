import { NextResponse } from "next/server"
import { getAvailableDeliveries, postDelivery, seedMockDeliveries } from "@/lib/deliveries-db"
import { Delivery } from "@/types"

// GET /api/deliveries — load board data
export async function GET() {
  try {
    // Auto-seed on first request if DB is empty
    await seedMockDeliveries()

    const deliveries = await getAvailableDeliveries()
    return NextResponse.json({ deliveries })
  } catch (err) {
    console.error("[GET /api/deliveries]", err)
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}

// POST /api/deliveries — post a new load
export async function POST(req: Request) {
  try {
    const delivery: Delivery = await req.json()
    const result = await postDelivery(delivery)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[POST /api/deliveries]", err)
    return NextResponse.json({ error: "Failed to post delivery" }, { status: 500 })
  }
}
