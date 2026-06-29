// ── VanRoute Pro types ────────────────────────────────────────────────────────
export type VehicleType = 'cargo-van' | 'sprinter-van' | 'box-truck'
export type DeliveryStatus = 'available' | 'assigned' | 'in-transit' | 'completed' | 'cancelled'
export type State = string   // now supports all 50 US states

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
  platformFee: number
  driverPayout: number
  description: string
  weight?: string
  dimensions?: string
  specialInstructions?: string
  status: DeliveryStatus
  isScheduled: boolean
  isUrgent: boolean
  postedAt: Date
  expiresAt: Date
  assignedDriverId?: string
  contactPhone?: string
  loadingDock?: boolean
  liftGate?: boolean
  source?: string
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
  platformRevenue: number
  activeDrivers: number
  totalDrivers: number
  activeShippers: number
  totalShippers: number
  revenueByMonth: { month: string; revenue: number; platformCut: number }[]
  deliveriesByState: { state: string; count: number }[]
  deliveriesByVehicle: { type: string; count: number }[]
}

// ── NegosyoAI types ───────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'
export type LeadStatus = 'new' | 'contacted' | 'converted' | 'inactive'
export type AuditStatus = 'new' | 'pending' | 'completed'

export interface Lead {
  id?: string
  name: string
  business?: string
  email: string
  phone?: string
  service?: string
  message?: string
  status?: LeadStatus
  createdAt?: string
}

export interface Payment {
  id: string
  checkoutId?: string
  planName?: string
  amount: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  status: PaymentStatus
  paymentMethod?: string
  checkoutUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuditRequest {
  id?: string
  name?: string
  email: string
  phone?: string
  businessName?: string
  city?: string
  industry?: string
  yearsInBusiness?: string
  employees?: string
  monthlyRevenue?: string
  biggestChallenge?: string
  answers?: AuditAnswers | Record<string, unknown>
  scores?: AuditScores | Record<string, unknown>
  score?: number
  status?: AuditStatus
  createdAt?: string
}

export interface AuditAnswers {
  hasWebsite: string
  isMobileFriendly: string
  hasGoogleBusiness: string
  platforms: string[]
  postingFrequency: string
  hasReviews: string
  respondsToReviews: string
  runningAds: string[]
  primaryGoal: string
  monthlyBudget: string
}

export interface AuditScores {
  website: number
  social: number
  localSeo: number
  reputation: number
  advertising: number
  overall: number
}

// ── Recurring Routes ──────────────────────────────────────────────────────────
export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly'
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface RecurringRoute {
  id: string
  name: string
  shipperId: string
  shipperName: string
  vehicleType: VehicleType
  pickup: DeliveryLocation
  dropoff: DeliveryLocation
  pickupTime: string
  deliveryTime: string
  frequency: RecurringFrequency
  daysOfWeek?: WeekDay[]
  isActive: boolean
  startDate: string
  endDate?: string
  nextRunDate: string
  lastRunDate?: string
  lastRunStatus?: 'completed' | 'missed' | 'pending'
  totalRuns: number
  distance: number
  description: string
  totalCost: number
  driverPayout: number
  liftGate?: boolean
  loadingDock?: boolean
  createdAt: Date
}
