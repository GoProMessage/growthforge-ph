import { Delivery, Driver, Shipper, AdminStats, VehicleType, State, DeliveryLocation } from '@/types'
import { CITIES } from './cities'
import { haversineDistance, calculateCost } from './calculator'

function makeLocation(city: string, state: State, street: string, zip: string): DeliveryLocation {
  const c = CITIES.find(x => x.name === city && x.state === state)!
  return { address: street, city, state, zip, lat: c.lat, lng: c.lng }
}

function daysFromNow(days: number, hour = 9): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, 0, 0, 0)
  return d
}

/** Expiry: loads posted recently expire sooner; range 18-55 minutes from now */
function makeExpiry(postedMinutesAgo: number): Date {
  // total window is 60 min from posting; minus time already elapsed
  const windowMinutes = 40 + Math.floor(Math.random() * 20) // 40-60 min total window
  const remainingMinutes = Math.max(8, windowMinutes - postedMinutesAgo)
  return new Date(Date.now() + remainingMinutes * 60 * 1000)
}

function makeDelivery(
  id: string,
  shipperName: string,
  shipperCompany: string,
  vehicleType: VehicleType,
  pickup: DeliveryLocation,
  dropoff: DeliveryLocation,
  description: string,
  pickupDayOffset: number,
  pickupHour: number,
  deliveryDayOffset: number,
  deliveryHour: number,
  isUrgent: boolean,
  isScheduled: boolean,
  weight: string,
  postedMinutesAgo: number,
  contactPhone: string,
  liftGate?: boolean,
  loadingDock?: boolean,
  source?: string
): Delivery {
  const distance = haversineDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
  const costs = calculateCost(distance, vehicleType)
  const postedAt = new Date(Date.now() - postedMinutesAgo * 60 * 1000)
  const pickupDate = daysFromNow(pickupDayOffset, pickupHour)
  const deliveryDate = daysFromNow(deliveryDayOffset, deliveryHour)
  return {
    id,
    shipperId: `shipper-${id}`,
    shipperName,
    shipperCompany,
    vehicleType,
    pickup,
    dropoff,
    pickupDate: pickupDate.toISOString().split('T')[0],
    pickupTime: `${String(pickupHour).padStart(2, '0')}:00`,
    deliveryDate: deliveryDate.toISOString().split('T')[0],
    deliveryTime: `${String(deliveryHour).padStart(2, '0')}:00`,
    distance,
    ...costs,
    description,
    weight,
    status: 'available',
    isScheduled,
    isUrgent,
    postedAt,
    expiresAt: makeExpiry(postedMinutesAgo),
    contactPhone,
    liftGate: liftGate ?? false,
    loadingDock: loadingDock ?? false,
    source: source ?? 'direct',
  }
}

// ── One Rail Logistics loads ───────────────────────────────────────────────
const ONE_RAIL_PHONE = '(704) 555-0199'
const ONE_RAIL_CONTACT = '(704) 555-0199'

export const MOCK_DELIVERIES: Delivery[] = [
  // ── One Rail Logistics (premium partner) ──────────────────────────────
  makeDelivery('orl-001', 'Marcus Reed', 'One Rail Logistics',
    'sprinter-van',
    makeLocation('Charlotte', 'NC', '4201 One Rail Blvd', '28208'),
    makeLocation('Raleigh', 'NC', '800 Corporate Center Dr', '27607'),
    'Automotive parts — 4 pallets, fragile. Handle with care. Receiver will unload.',
    0, 8, 0, 14, true, false, '1,840 lbs', 5, ONE_RAIL_PHONE, false, true, 'OneRail'),
  makeDelivery('orl-002', 'Sandra Liu', 'One Rail Logistics',
    'box-truck',
    makeLocation('Atlanta', 'GA', '2100 Fulton Industrial Blvd', '30336'),
    makeLocation('Columbia', 'SC', '1200 Assembly St', '29201'),
    'Industrial equipment — freight includes 2 crated machine parts. Lift gate required at delivery.',
    1, 7, 1, 15, false, false, '4,200 lbs', 3, ONE_RAIL_PHONE, true, true, 'OneRail'),
  makeDelivery('orl-003', 'James Whitfield', 'One Rail Logistics',
    'sprinter-van',
    makeLocation('Greenville', 'SC', '5 Brendan Way', '29615'),
    makeLocation('Charlotte', 'NC', '4201 One Rail Blvd', '28208'),
    'Electronics — 8 boxes, high-value cargo. Signature required. Keep dry.',
    0, 10, 0, 13, true, false, '620 lbs', 8, ONE_RAIL_PHONE, false, false, 'OneRail'),
  makeDelivery('orl-004', 'Tamara Brooks', 'One Rail Logistics',
    'cargo-van',
    makeLocation('Durham', 'NC', '4100 Main Campus Dr', '27707'),
    makeLocation('Greensboro', 'NC', '200 Corporate Dr', '27408'),
    'Office supply delivery — 12 boxes stationery and toner. Easy drop-off at loading dock.',
    1, 9, 1, 12, false, true, '380 lbs', 12, ONE_RAIL_PHONE, false, true, 'OneRail'),
  makeDelivery('orl-005', 'Kevin Morris', 'One Rail Logistics',
    'box-truck',
    makeLocation('Savannah', 'GA', '100 Port Terminal Rd', '31401'),
    makeLocation('Atlanta', 'GA', '2100 Fulton Industrial Blvd', '30336'),
    'Port freight — 3 pallets of imported goods. Time-sensitive same-day delivery.',
    0, 6, 0, 12, true, false, '3,800 lbs', 2, ONE_RAIL_PHONE, true, true, 'OneRail'),

  // ── Standard cargo van loads ───────────────────────────────────────────
  makeDelivery('d-001', 'Sarah Johnson', 'Palmetto Furniture Co',
    'cargo-van',
    makeLocation('Charleston', 'SC', '125 Meeting St', '29401'),
    makeLocation('Columbia', 'SC', '2020 Main St', '29201'),
    'Office furniture delivery — 2 desks, 4 chairs. Assembly not required.',
    1, 9, 1, 14, false, false, '480 lbs', 15, '(843) 555-0101'),
  makeDelivery('d-002', 'Mike Torres', 'Coastal Catering LLC',
    'cargo-van',
    makeLocation('Myrtle Beach', 'SC', '1200 Ocean Blvd', '29577'),
    makeLocation('Florence', 'SC', '100 E Evans St', '29501'),
    'Catering equipment — chafing dishes, coolers, linens. Event pickup tomorrow.',
    0, 14, 0, 17, true, false, '320 lbs', 7, '(843) 555-0202', false, false),
  makeDelivery('d-003', 'Angela White', 'Upstate Medical Supply',
    'cargo-van',
    makeLocation('Spartanburg', 'SC', '400 E Main St', '29302'),
    makeLocation('Greenville', 'SC', '1 Patewood Dr', '29615'),
    'Medical supplies — boxes of PPE and bandages. No special handling.',
    1, 8, 1, 11, false, true, '210 lbs', 22, '(864) 555-0303'),
  makeDelivery('d-004', 'Derek Hall', 'Lowcountry Florist',
    'cargo-van',
    makeLocation('Hilton Head Island', 'SC', '35 Office Park Rd', '29928'),
    makeLocation('Savannah', 'GA', '100 Bull St', '31401'),
    'Floral arrangements — temperature-sensitive cargo. Must deliver by noon.',
    0, 6, 0, 11, true, false, '90 lbs', 4, '(843) 555-0404'),
  makeDelivery('d-005', 'Lisa Park', 'Pee Dee Wholesale',
    'cargo-van',
    makeLocation('Florence', 'SC', '100 E Evans St', '29501'),
    makeLocation('Sumter', 'SC', '115 N Main St', '29150'),
    'Restaurant wholesale goods — cooking oils, dry goods. Business delivery.',
    1, 7, 1, 10, false, false, '540 lbs', 18, '(843) 555-0505', false, true),

  // ── Sprinter van loads ─────────────────────────────────────────────────
  makeDelivery('d-006', 'Robert Kim', 'Triangle Tech Distributors',
    'sprinter-van',
    makeLocation('Raleigh', 'NC', '4800 Six Forks Rd', '27609'),
    makeLocation('Charlotte', 'NC', '100 N Tryon St', '28202'),
    'IT equipment — servers, networking gear. High-value, handle carefully.',
    0, 9, 0, 15, false, false, '980 lbs', 9, '(919) 555-0606', false, true),
  makeDelivery('d-007', 'Carmen Diaz', 'Queen City Moving Co',
    'sprinter-van',
    makeLocation('Charlotte', 'NC', '200 S College St', '28244'),
    makeLocation('Asheville', 'NC', '70 Court Plaza', '28801'),
    'Residential furniture and boxes — full sprinter load. Blankets provided.',
    2, 8, 2, 16, false, true, '1,650 lbs', 31, '(704) 555-0707'),
  makeDelivery('d-008', 'Tom Bradley', 'Piedmont Packaging Inc',
    'sprinter-van',
    makeLocation('Winston-Salem', 'NC', '800 W 5th St', '27101'),
    makeLocation('Durham', 'NC', '280 S Mangum St', '27701'),
    'Corrugated packaging material — 18 rolls. Loading dock access at both ends.',
    1, 11, 1, 15, false, false, '1,200 lbs', 14, '(336) 555-0808', false, true),
  makeDelivery('d-009', 'Natalie Green', 'Triad Art Supplies',
    'cargo-van',
    makeLocation('Greensboro', 'NC', '120 S Elm St', '27401'),
    makeLocation('Winston-Salem', 'NC', '130 Stratford Rd', '27103'),
    'Art supply delivery to college — canvases, paints, easels.',
    1, 10, 1, 13, false, false, '290 lbs', 26, '(336) 555-0909'),
  makeDelivery('d-010', 'Brian Scott', 'Outer Banks Seafood',
    'sprinter-van',
    makeLocation('Wilmington', 'NC', '1 Estell Lee Pl', '28401'),
    makeLocation('Raleigh', 'NC', '420 S McDowell St', '27601'),
    'Refrigerated seafood — must stay cold. Reefer unit in van required.',
    0, 4, 0, 10, true, false, '1,100 lbs', 6, '(910) 555-1010'),

  // ── Georgia loads ──────────────────────────────────────────────────────
  makeDelivery('d-011', 'Patricia Young', 'Peach State Produce',
    'cargo-van',
    makeLocation('Macon', 'GA', '700 Poplar St', '31201'),
    makeLocation('Atlanta', 'GA', '75 5th St NW', '30308'),
    'Fresh produce — 8 crates. Temperature-sensitive, deliver before noon.',
    0, 5, 0, 10, true, false, '720 lbs', 8, '(478) 555-1111'),
  makeDelivery('d-012', 'Charles Brown', 'Augusta Auto Parts',
    'cargo-van',
    makeLocation('Augusta', 'GA', '601 Greene St', '30901'),
    makeLocation('Macon', 'GA', '450 Martin Luther King Jr Blvd', '31201'),
    'Auto parts — brake rotors, filters, fluids. No special handling.',
    1, 9, 1, 13, false, false, '410 lbs', 20, '(706) 555-1212'),
  makeDelivery('d-013', 'Michelle Davis', 'Savannah Port Logistics',
    'box-truck',
    makeLocation('Savannah', 'GA', '200 Port Terminal Blvd', '31415'),
    makeLocation('Macon', 'GA', '750 Industrial Blvd', '31201'),
    'Port cargo — 5 pallets of imported consumer goods. Dock-to-dock.',
    0, 7, 0, 14, false, false, '5,800 lbs', 11, '(912) 555-1313', false, true),
  makeDelivery('d-014', 'William Martinez', 'Columbus Medical Center',
    'sprinter-van',
    makeLocation('Columbus', 'GA', '710 Center St', '31901'),
    makeLocation('Atlanta', 'GA', '303 Peachtree Center Ave NE', '30308'),
    'Medical records transfer — sealed boxes. HIPAA compliant handling required.',
    1, 7, 1, 12, false, true, '340 lbs', 17, '(706) 555-1414'),
  makeDelivery('d-015', 'Jennifer Wilson', 'Lake Lanier Events',
    'cargo-van',
    makeLocation('Atlanta', 'GA', '190 Marietta St NW', '30303'),
    makeLocation('Augusta', 'GA', '901 Greene St', '30901'),
    'Event decor delivery — tablecloths, centerpieces, lighting fixtures.',
    3, 10, 3, 16, false, true, '280 lbs', 35, '(404) 555-1515'),

  // ── Box truck loads ────────────────────────────────────────────────────
  makeDelivery('d-016', 'Steven Clark', 'Carolina Warehouse Co',
    'box-truck',
    makeLocation('Columbia', 'SC', '300 Gervais St', '29201'),
    makeLocation('Charlotte', 'NC', '500 S College St', '28202'),
    'Warehouse relocation — 12 pallets industrial shelving and equipment.',
    2, 8, 2, 17, false, false, '8,500 lbs', 13, '(803) 555-1616', true, true),
  makeDelivery('d-017', 'Amanda Taylor', 'Piedmont Restaurant Supply',
    'box-truck',
    makeLocation('Greensboro', 'NC', '3921 Battleground Ave', '27410'),
    makeLocation('Durham', 'NC', '123 Morris St', '27701'),
    'Restaurant equipment — 2 commercial ovens, refrigeration units. Lift gate needed.',
    1, 9, 1, 15, false, false, '6,200 lbs', 19, '(336) 555-1717', true, false),
  makeDelivery('d-018', 'Daniel Lewis', 'Georgia Build Supply',
    'box-truck',
    makeLocation('Atlanta', 'GA', '950 W Marietta St NW', '30318'),
    makeLocation('Columbus', 'GA', '2500 Airport Thruway', '31904'),
    'Construction materials — lumber, drywall, flooring. Strapped and secured.',
    0, 6, 0, 14, true, false, '9,800 lbs', 5, '(404) 555-1818', false, true),
  makeDelivery('d-019', 'Kimberly Harris', 'Triad Grocery Distributors',
    'box-truck',
    makeLocation('Winston-Salem', 'NC', '700 N Liberty St', '27101'),
    makeLocation('Raleigh', 'NC', '300 Fayetteville St', '27601'),
    'Grocery store resupply — dry goods and paper products. Weekly route.',
    1, 4, 1, 11, false, true, '11,200 lbs', 28, '(336) 555-1919', false, true),
  makeDelivery('d-020', 'Anthony Robinson', 'Rock Hill Distribution',
    'box-truck',
    makeLocation('Rock Hill', 'SC', '155 Johnston St', '29730'),
    makeLocation('Anderson', 'SC', '101 S Main St', '29624'),
    'Appliance delivery — 6 refrigerators, 4 washers. White glove delivery.',
    2, 9, 2, 16, false, false, '7,400 lbs', 23, '(803) 555-2020', true, false),

  // ── More mixed loads ───────────────────────────────────────────────────
  makeDelivery('d-021', 'Rachel Thompson', 'Anderson Printing',
    'cargo-van',
    makeLocation('Anderson', 'SC', '200 S Main St', '29624'),
    makeLocation('Spartanburg', 'SC', '145 W Broad St', '29306'),
    'Print job delivery — banners, brochures, business cards. Fragile.',
    0, 11, 0, 14, false, false, '165 lbs', 24, '(864) 555-2121'),
  makeDelivery('d-022', 'Gregory Walker', 'Coastal Nursery & Garden',
    'cargo-van',
    makeLocation('Hilton Head Island', 'SC', '10 Executive Park Rd', '29928'),
    makeLocation('Savannah', 'GA', '400 E Bay St', '31401'),
    'Landscaping plants and soil — 15 potted trees, bags of mulch. Careful loading.',
    1, 8, 1, 12, false, false, '520 lbs', 10, '(843) 555-2222'),
  makeDelivery('d-023', 'Stephanie Adams', 'Fayetteville Sports',
    'sprinter-van',
    makeLocation('Raleigh', 'NC', '2 Hannover Square', '27601'),
    makeLocation('Wilmington', 'NC', '100 N Water St', '28401'),
    'Sporting equipment for beach tournament — kayaks, paddleboards, gear bags.',
    3, 7, 3, 13, false, true, '1,440 lbs', 33, '(919) 555-2323'),
  makeDelivery('d-024', 'Christopher Nelson', 'Atlanta Audio Visual',
    'sprinter-van',
    makeLocation('Atlanta', 'GA', '265 Peachtree Center Ave', '30303'),
    makeLocation('Savannah', 'GA', '102 E Liberty St', '31401'),
    'AV equipment for conference — projectors, screens, speakers. All fragile.',
    0, 10, 0, 16, true, false, '780 lbs', 6, '(404) 555-2424'),
  makeDelivery('d-025', 'Jessica Mitchell', 'Augusta Bakery Wholesale',
    'cargo-van',
    makeLocation('Augusta', 'GA', '830 Broad St', '30901'),
    makeLocation('Columbia', 'SC', '1441 Main St', '29201'),
    'Bakery supplies — flour, sugar, yeast, packaging. Early morning delivery.',
    0, 5, 0, 9, true, false, '680 lbs', 3, '(706) 555-2525'),
]

// ── Drivers ────────────────────────────────────────────────────────────────
export const MOCK_DRIVERS: Driver[] = [
  { id: 'drv-001', name: 'DeShawn Carter', phone: '(803) 555-3001', email: 'deshawn@email.com', vehicleType: 'sprinter-van', vehicleYear: '2022', vehicleMake: 'Mercedes', vehicleModel: 'Sprinter', licensePlate: 'SC 4X9-2B1', rating: 4.9, completedDeliveries: 187, totalEarnings: 22840, isAvailable: true, currentCity: 'Columbia', currentState: 'SC', joinedDate: '2023-03-15' },
  { id: 'drv-002', name: 'Maria Gonzalez', phone: '(704) 555-3002', email: 'maria.g@email.com', vehicleType: 'cargo-van', vehicleYear: '2021', vehicleMake: 'Ford', vehicleModel: 'Transit', licensePlate: 'NC 7P3-QR2', rating: 4.8, completedDeliveries: 243, totalEarnings: 19620, isAvailable: true, currentCity: 'Charlotte', currentState: 'NC', joinedDate: '2022-11-08' },
  { id: 'drv-003', name: 'Tony Watkins', phone: '(404) 555-3003', email: 'tony.w@email.com', vehicleType: 'box-truck', vehicleYear: '2020', vehicleMake: 'Isuzu', vehicleModel: 'NPR', licensePlate: 'GA 2T7-YK5', rating: 4.7, completedDeliveries: 98, totalEarnings: 31450, isAvailable: false, currentCity: 'Atlanta', currentState: 'GA', joinedDate: '2023-07-22' },
  { id: 'drv-004', name: 'Keisha Brown', phone: '(864) 555-3004', email: 'keisha.b@email.com', vehicleType: 'cargo-van', vehicleYear: '2022', vehicleMake: 'Ram', vehicleModel: 'ProMaster', licensePlate: 'SC 8M1-LZ4', rating: 5.0, completedDeliveries: 312, totalEarnings: 28100, isAvailable: true, currentCity: 'Greenville', currentState: 'SC', joinedDate: '2022-08-14' },
  { id: 'drv-005', name: 'Marcus Webb', phone: '(919) 555-3005', email: 'marcus.w@email.com', vehicleType: 'sprinter-van', vehicleYear: '2023', vehicleMake: 'Mercedes', vehicleModel: 'Sprinter 2500', licensePlate: 'NC 5V9-PH8', rating: 4.6, completedDeliveries: 154, totalEarnings: 24380, isAvailable: true, currentCity: 'Raleigh', currentState: 'NC', joinedDate: '2023-01-30' },
]

// ── Shippers ───────────────────────────────────────────────────────────────
export const MOCK_SHIPPERS: Shipper[] = [
  { id: 'shp-001', name: 'Marcus Reed', company: 'One Rail Logistics', phone: ONE_RAIL_PHONE, email: 'dispatch@onerail.com', totalDeliveries: 48, totalSpent: 14200, rating: 4.9 },
  { id: 'shp-002', name: 'Sarah Johnson', company: 'Palmetto Furniture Co', phone: '(843) 555-0101', email: 'sarah@palmbiz.com', totalDeliveries: 22, totalSpent: 5840, rating: 4.7 },
  { id: 'shp-003', name: 'Robert Kim', company: 'Triangle Tech Distributors', phone: '(919) 555-0606', email: 'dispatch@tritech.com', totalDeliveries: 35, totalSpent: 9100, rating: 4.8 },
  { id: 'shp-004', name: 'Patricia Young', company: 'Peach State Produce', phone: '(478) 555-1111', email: 'pat@peachstate.com', totalDeliveries: 67, totalSpent: 12300, rating: 4.5 },
  { id: 'shp-005', name: 'Steven Clark', company: 'Carolina Warehouse Co', phone: '(803) 555-1616', email: 'steve@carolinawh.com', totalDeliveries: 19, totalSpent: 18600, rating: 4.6 },
]

// ── Admin stats ────────────────────────────────────────────────────────────
export const ADMIN_STATS: AdminStats = {
  totalDeliveries: 1247,
  activeDeliveries: 25,
  completedDeliveries: 1198,
  totalRevenue: 287400,
  platformRevenue: 14370,   // 5% of totalRevenue
  activeDrivers: 34,
  totalDrivers: 89,
  activeShippers: 28,
  totalShippers: 124,
  revenueByMonth: [
    { month: 'Jan', revenue: 18200, platformCut: 910 },
    { month: 'Feb', revenue: 21400, platformCut: 1070 },
    { month: 'Mar', revenue: 24800, platformCut: 1240 },
    { month: 'Apr', revenue: 22100, platformCut: 1105 },
    { month: 'May', revenue: 28600, platformCut: 1430 },
    { month: 'Jun', revenue: 31900, platformCut: 1595 },
    { month: 'Jul', revenue: 29400, platformCut: 1470 },
    { month: 'Aug', revenue: 33200, platformCut: 1660 },
    { month: 'Sep', revenue: 27800, platformCut: 1390 },
    { month: 'Oct', revenue: 35100, platformCut: 1755 },
    { month: 'Nov', revenue: 38400, platformCut: 1920 },
    { month: 'Dec', revenue: 22500, platformCut: 1125 },
  ],
  deliveriesByState: [
    { state: 'SC', count: 487 },
    { state: 'NC', count: 521 },
    { state: 'GA', count: 239 },
  ],
  deliveriesByVehicle: [
    { type: 'Cargo Van', count: 612 },
    { type: 'Sprinter Van', count: 484 },
    { type: 'Box Truck', count: 151 },
  ],
}

// ── Live feed generator ────────────────────────────────────────────────────
const LIVE_SHIPPERS = [
  { name: 'Carlos Mendez', company: 'One Rail Logistics', phone: ONE_RAIL_PHONE, source: 'OneRail' },
  { name: 'Ashley Turner', company: 'Direct Shipper', phone: '(864) 555-9901', source: 'direct' },
  { name: 'Brandon Lee', company: 'FastFreight NC', phone: '(919) 555-9902', source: 'posted' },
  { name: 'Tanya Miller', company: 'One Rail Logistics', phone: ONE_RAIL_PHONE, source: 'OneRail' },
  { name: 'Kevin Ross', company: 'Georgia Cargo Co', phone: '(404) 555-9904', source: 'posted' },
  { name: 'Sandra Patel', company: 'One Rail Logistics', phone: ONE_RAIL_PHONE, source: 'OneRail' },
  { name: 'James Fuller', company: 'Direct Shipper', phone: '(803) 555-9906', source: 'direct' },
]

const LIVE_DESCRIPTIONS = [
  'General freight — palletized goods. Easy loading and unloading.',
  'Retail merchandise — boxed product. Delivery to storefront.',
  'Medical supply run — standard boxes. No special handling.',
  'Construction materials — bagged goods. Loading dock available.',
  'Electronics shipment — fragile, keep upright.',
  'Food service delivery — dry goods only.',
  'Office furniture — chairs and desks, 3 pieces.',
  'Auto parts run — engine components, well-packaged.',
  'Event equipment — tables, chairs, linens.',
  'Wholesale merchandise — 4 pallets, shrink-wrapped.',
]

let liveIdCounter = 1000

export function generateNewDelivery(): Delivery {
  const allCities = CITIES
  const pickupCity = allCities[Math.floor(Math.random() * allCities.length)]
  let dropoffCity = allCities[Math.floor(Math.random() * allCities.length)]
  while (dropoffCity.name === pickupCity.name) {
    dropoffCity = allCities[Math.floor(Math.random() * allCities.length)]
  }

  const vehicles: VehicleType[] = ['cargo-van', 'sprinter-van', 'box-truck']
  const weights: Record<VehicleType, string[]> = {
    'cargo-van': ['120 lbs', '280 lbs', '450 lbs', '380 lbs'],
    'sprinter-van': ['620 lbs', '980 lbs', '1,240 lbs', '1,600 lbs'],
    'box-truck': ['3,200 lbs', '5,800 lbs', '8,400 lbs', '10,500 lbs'],
  }
  const vehicleType = vehicles[Math.floor(Math.random() * vehicles.length)]
  const shipper = LIVE_SHIPPERS[Math.floor(Math.random() * LIVE_SHIPPERS.length)]
  const desc = LIVE_DESCRIPTIONS[Math.floor(Math.random() * LIVE_DESCRIPTIONS.length)]
  const weightArr = weights[vehicleType]
  const weight = weightArr[Math.floor(Math.random() * weightArr.length)]

  const pickupLoc: DeliveryLocation = {
    address: `${100 + Math.floor(Math.random() * 900)} Main St`,
    city: pickupCity.name,
    state: pickupCity.state,
    zip: `${29000 + Math.floor(Math.random() * 3000)}`,
    lat: pickupCity.lat,
    lng: pickupCity.lng,
  }
  const dropoffLoc: DeliveryLocation = {
    address: `${100 + Math.floor(Math.random() * 900)} Commerce Blvd`,
    city: dropoffCity.name,
    state: dropoffCity.state,
    zip: `${29000 + Math.floor(Math.random() * 3000)}`,
    lat: dropoffCity.lat,
    lng: dropoffCity.lng,
  }

  const distance = haversineDistance(pickupLoc.lat, pickupLoc.lng, dropoffLoc.lat, dropoffLoc.lng)
  const costs = calculateCost(distance, vehicleType)
  const isUrgent = Math.random() < 0.25
  const id = `live-${++liveIdCounter}`
  const now = new Date()
  const tomorrowDate = new Date(now); tomorrowDate.setDate(now.getDate() + 1)
  const expiresAt = new Date(now.getTime() + (25 + Math.floor(Math.random() * 20)) * 60 * 1000)

  return {
    id,
    shipperId: `shipper-live-${liveIdCounter}`,
    shipperName: shipper.name,
    shipperCompany: shipper.company,
    vehicleType,
    pickup: pickupLoc,
    dropoff: dropoffLoc,
    pickupDate: tomorrowDate.toISOString().split('T')[0],
    pickupTime: `${String(7 + Math.floor(Math.random() * 10)).padStart(2, '0')}:00`,
    deliveryDate: tomorrowDate.toISOString().split('T')[0],
    deliveryTime: `${String(12 + Math.floor(Math.random() * 6)).padStart(2, '0')}:00`,
    distance,
    ...costs,
    description: desc,
    weight,
    status: 'available',
    isScheduled: false,
    isUrgent,
    postedAt: now,
    expiresAt,
    contactPhone: shipper.phone,
    liftGate: Math.random() < 0.3,
    loadingDock: Math.random() < 0.4,
    source: shipper.source,
  }
}

export function getDeliveryById(id: string): Delivery | undefined {
  return MOCK_DELIVERIES.find(d => d.id === id)
}
