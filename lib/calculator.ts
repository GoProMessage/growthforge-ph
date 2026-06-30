import { VehicleType } from '@/types'

export const MILEAGE_RATES: Record<VehicleType, number> = {
  'cargo-van':    1.25,
  'sprinter-van': 1.75,
  'box-truck':    2.25,
}

export const BASE_FEES: Record<VehicleType, number> = {
  'cargo-van':    35,
  'sprinter-van': 55,
  'box-truck':    85,
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  'cargo-van':    'Cargo Van',
  'sprinter-van': 'Sprinter Van',
  'box-truck':    'Box Truck',
}

export const VEHICLE_CAPACITY: Record<VehicleType, string> = {
  'cargo-van':    'Up to 2,500 lbs',
  'sprinter-van': 'Up to 4,500 lbs',
  'box-truck':    'Up to 12,000 lbs',
}

export const PLATFORM_FEE_PERCENT = 0.05   // 5% platform fee

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function calculateCost(distance: number, vehicleType: VehicleType): {
  baseFee: number
  mileageRate: number
  mileageCost: number
  totalCost: number
  platformFee: number
  driverPayout: number
} {
  const baseFee = BASE_FEES[vehicleType]
  const mileageRate = MILEAGE_RATES[vehicleType]
  const mileageCost = Math.round(distance * mileageRate * 100) / 100
  const totalCost = Math.round((baseFee + mileageCost) * 100) / 100
  const platformFee = Math.round(totalCost * PLATFORM_FEE_PERCENT * 100) / 100
  const driverPayout = Math.round((totalCost - platformFee) * 100) / 100
  return { baseFee, mileageRate, mileageCost, totalCost, platformFee, driverPayout }
}

export function estimateDriveTime(distanceMiles: number): string {
  const avgSpeedMph = 55
  const hours = distanceMiles / avgSpeedMph
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

/** Returns minutes until expiry (negative = expired) */
export function minutesUntilExpiry(expiresAt: Date): number {
  return Math.round((expiresAt.getTime() - Date.now()) / 60000)
}

/** Format a 24h "HH:MM" string as 12h AM/PM (e.g. "14:00" → "2 PM") */
export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr, 10)
  const m = parseInt(mStr ?? '0', 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  const minute = m > 0 ? `:${String(m).padStart(2, '0')}` : ''
  return `${hour}${minute} ${period}`
}
