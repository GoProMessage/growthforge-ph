import { CityData, State } from '@/types'

export const CITIES: CityData[] = [
  // South Carolina
  { name: 'Charleston', state: 'SC', lat: 32.7765, lng: -79.9311 },
  { name: 'Columbia', state: 'SC', lat: 34.0007, lng: -81.0348 },
  { name: 'Greenville', state: 'SC', lat: 34.8526, lng: -82.3940 },
  { name: 'Spartanburg', state: 'SC', lat: 34.9496, lng: -81.9321 },
  { name: 'Myrtle Beach', state: 'SC', lat: 33.6891, lng: -78.8867 },
  { name: 'Florence', state: 'SC', lat: 34.1954, lng: -79.7626 },
  { name: 'Anderson', state: 'SC', lat: 34.5034, lng: -82.6501 },
  { name: 'Rock Hill', state: 'SC', lat: 34.9249, lng: -81.0251 },
  { name: 'Hilton Head Island', state: 'SC', lat: 32.2163, lng: -80.7526 },
  { name: 'Sumter', state: 'SC', lat: 33.9204, lng: -80.3412 },
  // North Carolina
  { name: 'Charlotte', state: 'NC', lat: 35.2271, lng: -80.8431 },
  { name: 'Raleigh', state: 'NC', lat: 35.7796, lng: -78.6382 },
  { name: 'Durham', state: 'NC', lat: 35.9940, lng: -78.8986 },
  { name: 'Greensboro', state: 'NC', lat: 36.0726, lng: -79.7920 },
  { name: 'Winston-Salem', state: 'NC', lat: 36.0999, lng: -80.2442 },
  { name: 'Wilmington', state: 'NC', lat: 34.2257, lng: -77.9447 },
  { name: 'Fayetteville', state: 'NC', lat: 35.0527, lng: -78.8784 },
  { name: 'Asheville', state: 'NC', lat: 35.5951, lng: -82.5515 },
  { name: 'Cary', state: 'NC', lat: 35.7915, lng: -78.7811 },
  { name: 'High Point', state: 'NC', lat: 35.9557, lng: -80.0053 },
  // Georgia
  { name: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
  { name: 'Savannah', state: 'GA', lat: 32.0835, lng: -81.0998 },
  { name: 'Augusta', state: 'GA', lat: 33.4735, lng: -82.0105 },
  { name: 'Macon', state: 'GA', lat: 32.8407, lng: -83.6324 },
  { name: 'Columbus', state: 'GA', lat: 32.4610, lng: -84.9877 },
  { name: 'Athens', state: 'GA', lat: 33.9519, lng: -83.3576 },
  { name: 'Albany', state: 'GA', lat: 31.5785, lng: -84.1557 },
  { name: 'Warner Robins', state: 'GA', lat: 32.6130, lng: -83.5996 },
  { name: 'Gainesville', state: 'GA', lat: 34.2979, lng: -83.8241 },
  { name: 'Sandy Springs', state: 'GA', lat: 33.9304, lng: -84.3733 },
]

export const STATES: State[] = ['SC', 'NC', 'GA']

export const STATE_NAMES: Record<State, string> = {
  SC: 'South Carolina',
  NC: 'North Carolina',
  GA: 'Georgia',
}

export function getCitiesByState(state: string): CityData[] {
  return CITIES.filter(c => c.state === state)
}

export function getCityData(name: string, state: string): CityData | undefined {
  return CITIES.find(c => c.name === name && c.state === state)
}

export function getRandomCity(excludeCity?: string): CityData {
  const available = excludeCity ? CITIES.filter(c => c.name !== excludeCity) : CITIES
  return available[Math.floor(Math.random() * available.length)]
}
