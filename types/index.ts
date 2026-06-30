export type VehicleType = 'cargo-van' | 'sprinter-van' | 'box-truck'
export type DeliveryStatus = 'available' | 'assigned' | 'in-transit' | 'completed' | 'cancelled'
export type State = 'SC' | 'NC' | 'GA'

export interface CityData {
  name: string
  state: State
  lat: number
  lng: number
}

export interface DeliveryLocation {
  address: string
  city: string
  state: State
  zip: string
  lat: number
  lng: number
}

export interface Delivery {
  id: string
  shipperId: string
  shipperName: string
  shipperCompany?: string
  vehicleType: VehicleType
  pickup: DeliveryLocation
  dropoff: DeliveryLocation
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  distance: number
  baseFee: number
  mileageRate: number
  mileageCost: number
  totalCost: number
  platformFee: number          // platform's 5% cut
  driverPayout: number         // what driver earns
  description: string
  weight?: string
  dimensions?: string
  specialInstructions?: string
  status: DeliveryStatus
  isScheduled: boolean
  isUrgent: boolean
  postedAt: Date
  expiresAt: Date              // load disappears after this
  assignedDriverId?: string
  contactPhone?: string
  loadingDock?: boolean
  liftGate?: boolean
  source?: string              // 'OneRail' | 'direct' | 'posted'
}

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  vehicleType: VehicleType
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  licensePlate: string
  rating: number
  completedDeliveries: number
  totalEarnings: number
  isAvailable: boolean
  currentCity: string
  currentState: State
  joinedDate: string
}

export interface Shipper {
  id: string
  name: string
  company?: string
  phone: string
  email: string
  totalDeliveries: number
  totalSpent: number
  rating: number
}

export interface AdminStats {
  totalDeliveries: number
  activeDeliveries: number
  completedDeliveries: number
  totalRevenue: number
  platformRevenue: number      // 5% collected
  activeDrivers: number
  totalDrivers: number
  activeShippers: number
  totalShippers: number
  revenueByMonth: { month: string; revenue: number; platformCut: number }[]
  deliveriesByState: { state: string; count: number }[]
  deliveriesByVehicle: { type: string; count: number }[]
}

// ── NegosyoAI type stubs (kept for backward compat) ──────────────────────────
export interface AuditScores {
  seo: number; performance: number; content: number; ux: number; overall: number
}
export type AuditAnswers = Record<string, string | string[] | boolean>
export interface Payment {
  id: string
  status: string
  amount: number
  currency: string
  createdAt: Date
  updatedAt?: Date
  [key: string]: unknown  // allows NegosyoAI-specific fields
}

// ── VanRoute Pro — Recurring Routes ──────────────────────────────────────────
export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface RecurringRoute {
  id: string
  name: string
  driverId?: string
  shipperId?: string
  shipperName?: string
  pickup: {
    city: string
    state: string
    address: string
    zip: string
    lat?: number
    lng?: number
  }
  dropoff: {
    city: string
    state: string
    address: string
    zip: string
    lat?: number
    lng?: number
  }
  pickupTime: string
  deliveryTime: string
  vehicleType: VehicleType
  frequency: RecurringFrequency
  daysOfWeek?: WeekDay[]
  distance: number
  totalCost?: number
  driverPayout: number
  platformFee?: number
  description?: string
  isActive?: boolean
  status?: 'active' | 'paused'
  startDate?: string
  nextRunDate?: string
  nextRunAt?: Date
  lastRunDate?: string
  lastRunStatus?: string
  totalRuns?: number
  createdAt: Date
}
