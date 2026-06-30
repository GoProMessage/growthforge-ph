/**
 * Route Van Pro — Deliveries database layer (Supabase)
 * All server-side only (uses service role key)
 */

import { getSupabase, isSupabaseReady } from "@/lib/supabase"
import { Delivery, DeliveryLocation, DeliveryStatus, VehicleType } from "@/types"
import { MOCK_DELIVERIES } from "@/lib/mock-data"

// ─── Row → Delivery mapper ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToDelivery(r: any): Delivery {
  const pickup: DeliveryLocation = {
    address: r.pickup_address,
    city: r.pickup_city,
    state: r.pickup_state,
    zip: r.pickup_zip,
    lat: r.pickup_lat ?? 0,
    lng: r.pickup_lng ?? 0,
  }
  const dropoff: DeliveryLocation = {
    address: r.dropoff_address,
    city: r.dropoff_city,
    state: r.dropoff_state,
    zip: r.dropoff_zip,
    lat: r.dropoff_lat ?? 0,
    lng: r.dropoff_lng ?? 0,
  }
  return {
    id: r.id,
    shipperId: r.shipper_id ?? "",
    shipperName: r.shipper_name,
    shipperCompany: r.shipper_company ?? undefined,
    vehicleType: r.vehicle_type as VehicleType,
    pickup,
    dropoff,
    pickupDate: r.pickup_date,
    pickupTime: r.pickup_time,
    deliveryDate: r.delivery_date,
    deliveryTime: r.delivery_time,
    distance: r.distance,
    baseFee: r.base_fee,
    mileageRate: r.mileage_rate,
    mileageCost: r.mileage_cost,
    totalCost: r.total_cost,
    platformFee: r.platform_fee,
    driverPayout: r.driver_payout,
    description: r.description ?? "",
    weight: r.weight ?? undefined,
    dimensions: r.dimensions ?? undefined,
    specialInstructions: r.special_instructions ?? undefined,
    status: r.status as DeliveryStatus,
    isScheduled: r.is_scheduled ?? false,
    isUrgent: r.is_urgent ?? false,
    postedAt: new Date(r.posted_at),
    expiresAt: new Date(r.expires_at),
    assignedDriverId: r.assigned_driver_id ?? undefined,
    contactPhone: r.contact_phone ?? undefined,
    contactName: r.contact_name ?? undefined,
    contactEmail: r.contact_email ?? undefined,
    loadingDock: r.loading_dock ?? false,
    liftGate: r.lift_gate ?? false,
    source: r.source ?? "posted",
  }
}

// ─── Delivery → Row mapper ────────────────────────────────────────────────────

function deliveryToRow(d: Delivery) {
  return {
    id: d.id,
    shipper_id: d.shipperId,
    shipper_name: d.shipperName,
    shipper_company: d.shipperCompany ?? null,
    vehicle_type: d.vehicleType,
    pickup_address: d.pickup.address,
    pickup_city: d.pickup.city,
    pickup_state: d.pickup.state,
    pickup_zip: d.pickup.zip,
    pickup_lat: d.pickup.lat,
    pickup_lng: d.pickup.lng,
    dropoff_address: d.dropoff.address,
    dropoff_city: d.dropoff.city,
    dropoff_state: d.dropoff.state,
    dropoff_zip: d.dropoff.zip,
    dropoff_lat: d.dropoff.lat,
    dropoff_lng: d.dropoff.lng,
    pickup_date: d.pickupDate,
    pickup_time: d.pickupTime,
    delivery_date: d.deliveryDate,
    delivery_time: d.deliveryTime,
    distance: d.distance,
    base_fee: d.baseFee,
    mileage_rate: d.mileageRate,
    mileage_cost: d.mileageCost,
    total_cost: d.totalCost,
    platform_fee: d.platformFee,
    driver_payout: d.driverPayout,
    description: d.description,
    weight: d.weight ?? null,
    dimensions: d.dimensions ?? null,
    special_instructions: d.specialInstructions ?? null,
    status: d.status,
    is_scheduled: d.isScheduled,
    is_urgent: d.isUrgent,
    posted_at: d.postedAt instanceof Date ? d.postedAt.toISOString() : d.postedAt,
    expires_at: d.expiresAt instanceof Date ? d.expiresAt.toISOString() : d.expiresAt,
    assigned_driver_id: d.assignedDriverId ?? null,
    contact_phone: d.contactPhone ?? null,
    contact_name: d.contactName ?? null,
    contact_email: d.contactEmail ?? null,
    loading_dock: d.loadingDock ?? false,
    lift_gate: d.liftGate ?? false,
    source: d.source ?? "posted",
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch all available (non-expired) deliveries. Falls back to mock data if DB not ready. */
export async function getAvailableDeliveries(): Promise<Delivery[]> {
  if (!isSupabaseReady) {
    console.warn("[deliveries-db] Supabase not configured — using mock data")
    return MOCK_DELIVERIES.filter(d => new Date(d.expiresAt) > new Date())
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("status", "available")
    .gt("expires_at", new Date().toISOString())
    .order("posted_at", { ascending: false })

  if (error) {
    console.error("[deliveries-db] getAvailableDeliveries error:", error.message)
    return MOCK_DELIVERIES.filter(d => new Date(d.expiresAt) > new Date())
  }

  return (data ?? []).map(rowToDelivery)
}

/** Fetch a single delivery by ID. */
export async function getDeliveryById(id: string): Promise<Delivery | null> {
  if (!isSupabaseReady) {
    return MOCK_DELIVERIES.find(d => d.id === id) ?? null
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null
  return rowToDelivery(data)
}

/** Claim a delivery — sets status to 'assigned' and records the claim. */
export async function claimDelivery(
  deliveryId: string,
  driverInfo: { id?: string; name?: string; phone?: string }
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseReady) {
    return { success: true } // mock mode — always succeeds
  }

  const supabase = getSupabase()

  // Insert claim record
  const { error: claimError } = await supabase
    .from("claimed_loads")
    .insert({
      delivery_id: deliveryId,
      driver_id: driverInfo.id ?? null,
      driver_name: driverInfo.name ?? null,
      driver_phone: driverInfo.phone ?? null,
      status: "claimed",
    })

  if (claimError) {
    console.error("[deliveries-db] claimDelivery insert error:", claimError.message)
    return { success: false, error: claimError.message }
  }

  // Update delivery status to assigned
  const { error: updateError } = await supabase
    .from("deliveries")
    .update({
      status: "assigned",
      assigned_driver_id: driverInfo.id ?? null,
    })
    .eq("id", deliveryId)

  if (updateError) {
    console.error("[deliveries-db] claimDelivery update error:", updateError.message)
    return { success: false, error: updateError.message }
  }

  return { success: true }
}

/** Post a new delivery to the board. */
export async function postDelivery(
  delivery: Delivery
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseReady) {
    return { success: true }
  }

  const supabase = getSupabase()
  const { error } = await supabase
    .from("deliveries")
    .insert(deliveryToRow(delivery))

  if (error) {
    console.error("[deliveries-db] postDelivery error:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/** Seed mock deliveries into the DB (one-time setup). */
export async function seedMockDeliveries(): Promise<{ seeded: number; error?: string }> {
  if (!isSupabaseReady) return { seeded: 0, error: "Supabase not configured" }

  const supabase = getSupabase()

  // Only seed if table is empty
  const { count } = await supabase
    .from("deliveries")
    .select("*", { count: "exact", head: true })

  if ((count ?? 0) > 0) return { seeded: 0 }

  // Set fresh expiry times relative to now
  const now = new Date()
  const rows = MOCK_DELIVERIES.map(d => ({
    ...deliveryToRow(d),
    posted_at: new Date(now.getTime() - Math.random() * 30 * 60000).toISOString(),
    expires_at: new Date(now.getTime() + (30 + Math.random() * 30) * 60000).toISOString(),
    status: "available",
  }))

  const { error } = await supabase.from("deliveries").insert(rows)
  if (error) return { seeded: 0, error: error.message }

  return { seeded: rows.length }
}

/** Admin: get all deliveries regardless of status/expiry. */
export async function getAllDeliveries(): Promise<Delivery[]> {
  if (!isSupabaseReady) return MOCK_DELIVERIES

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .order("posted_at", { ascending: false })

  if (error) return MOCK_DELIVERIES
  return (data ?? []).map(rowToDelivery)
}

/** Admin stats */
export async function getAdminStats() {
  if (!isSupabaseReady) {
    return { total: 0, available: 0, assigned: 0, completed: 0, totalPayout: 0 }
  }

  const supabase = getSupabase()
  const { data } = await supabase.from("deliveries").select("status, driver_payout")

  const deliveries = data ?? []
  return {
    total: deliveries.length,
    available: deliveries.filter(d => d.status === "available").length,
    assigned: deliveries.filter(d => d.status === "assigned").length,
    completed: deliveries.filter(d => d.status === "completed").length,
    totalPayout: deliveries
      .filter(d => d.status === "completed")
      .reduce((s, d) => s + (d.driver_payout ?? 0), 0),
  }
}
