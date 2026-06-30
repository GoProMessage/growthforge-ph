import { NextResponse } from "next/server"
import { getDeliveryById } from "@/lib/deliveries-db"

// GET /api/deliveries/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const delivery = await getDeliveryById(id)
    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }
    return NextResponse.json({ delivery })
  } catch (err) {
    console.error("[GET /api/deliveries/[id]]", err)
    return NextResponse.json({ error: "Failed to fetch delivery" }, { status: 500 })
  }
}
