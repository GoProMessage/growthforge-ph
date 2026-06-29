// ── US Cities Database — all 50 states ───────────────────────────────────────
// Used for generating loads across the entire country

export interface USCity {
  name: string
  state: string          // 2-letter abbreviation
  stateName: string
  lat: number
  lng: number
  zip: string
}

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },       { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },       { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },    { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },   { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },       { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },        { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },      { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },          { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },      { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },         { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },     { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },      { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },      { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },    { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },{ code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },          { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },        { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },         { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },       { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },    { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },     { code: 'WY', name: 'Wyoming' },
]

export const US_CITIES: USCity[] = [
  // Alabama
  { name: 'Birmingham',   state: 'AL', stateName: 'Alabama',       lat: 33.52,  lng: -86.80, zip: '35203' },
  { name: 'Montgomery',   state: 'AL', stateName: 'Alabama',       lat: 32.36,  lng: -86.30, zip: '36104' },
  { name: 'Huntsville',   state: 'AL', stateName: 'Alabama',       lat: 34.73,  lng: -86.59, zip: '35801' },
  { name: 'Mobile',       state: 'AL', stateName: 'Alabama',       lat: 30.69,  lng: -88.04, zip: '36602' },
  // Arizona
  { name: 'Phoenix',      state: 'AZ', stateName: 'Arizona',       lat: 33.45,  lng: -112.07,zip: '85001' },
  { name: 'Tucson',       state: 'AZ', stateName: 'Arizona',       lat: 32.22,  lng: -110.97,zip: '85701' },
  { name: 'Mesa',         state: 'AZ', stateName: 'Arizona',       lat: 33.42,  lng: -111.83,zip: '85201' },
  { name: 'Scottsdale',   state: 'AZ', stateName: 'Arizona',       lat: 33.49,  lng: -111.93,zip: '85251' },
  // Arkansas
  { name: 'Little Rock',  state: 'AR', stateName: 'Arkansas',      lat: 34.74,  lng: -92.29, zip: '72201' },
  { name: 'Fort Smith',   state: 'AR', stateName: 'Arkansas',      lat: 35.38,  lng: -94.42, zip: '72901' },
  { name: 'Fayetteville', state: 'AR', stateName: 'Arkansas',      lat: 36.06,  lng: -94.16, zip: '72701' },
  // California
  { name: 'Los Angeles',  state: 'CA', stateName: 'California',    lat: 34.05,  lng: -118.24,zip: '90001' },
  { name: 'San Diego',    state: 'CA', stateName: 'California',    lat: 32.72,  lng: -117.15,zip: '92101' },
  { name: 'San Jose',     state: 'CA', stateName: 'California',    lat: 37.34,  lng: -121.89,zip: '95101' },
  { name: 'San Francisco',state: 'CA', stateName: 'California',    lat: 37.77,  lng: -122.42,zip: '94102' },
  { name: 'Fresno',       state: 'CA', stateName: 'California',    lat: 36.74,  lng: -119.77,zip: '93721' },
  { name: 'Sacramento',   state: 'CA', stateName: 'California',    lat: 38.58,  lng: -121.49,zip: '95814' },
  // Colorado
  { name: 'Denver',       state: 'CO', stateName: 'Colorado',      lat: 39.74,  lng: -104.99,zip: '80202' },
  { name: 'Colorado Springs',state:'CO',stateName:'Colorado',      lat: 38.83,  lng: -104.82,zip: '80903' },
  { name: 'Aurora',       state: 'CO', stateName: 'Colorado',      lat: 39.73,  lng: -104.83,zip: '80010' },
  // Connecticut
  { name: 'Bridgeport',   state: 'CT', stateName: 'Connecticut',   lat: 41.18,  lng: -73.19, zip: '06604' },
  { name: 'New Haven',    state: 'CT', stateName: 'Connecticut',   lat: 41.31,  lng: -72.92, zip: '06510' },
  { name: 'Hartford',     state: 'CT', stateName: 'Connecticut',   lat: 41.76,  lng: -72.68, zip: '06103' },
  // Delaware
  { name: 'Wilmington',   state: 'DE', stateName: 'Delaware',      lat: 39.75,  lng: -75.55, zip: '19801' },
  { name: 'Dover',        state: 'DE', stateName: 'Delaware',      lat: 39.16,  lng: -75.52, zip: '19901' },
  // Florida
  { name: 'Jacksonville', state: 'FL', stateName: 'Florida',       lat: 30.33,  lng: -81.66, zip: '32202' },
  { name: 'Miami',        state: 'FL', stateName: 'Florida',       lat: 25.77,  lng: -80.19, zip: '33101' },
  { name: 'Tampa',        state: 'FL', stateName: 'Florida',       lat: 27.95,  lng: -82.46, zip: '33602' },
  { name: 'Orlando',      state: 'FL', stateName: 'Florida',       lat: 28.54,  lng: -81.38, zip: '32801' },
  { name: 'Fort Lauderdale',state:'FL',stateName:'Florida',        lat: 26.12,  lng: -80.14, zip: '33301' },
  // Georgia
  { name: 'Atlanta',      state: 'GA', stateName: 'Georgia',       lat: 33.75,  lng: -84.39, zip: '30301' },
  { name: 'Augusta',      state: 'GA', stateName: 'Georgia',       lat: 33.47,  lng: -81.97, zip: '30901' },
  { name: 'Columbus',     state: 'GA', stateName: 'Georgia',       lat: 32.46,  lng: -84.99, zip: '31901' },
  { name: 'Savannah',     state: 'GA', stateName: 'Georgia',       lat: 32.08,  lng: -81.09, zip: '31401' },
  { name: 'Macon',        state: 'GA', stateName: 'Georgia',       lat: 32.84,  lng: -83.63, zip: '31201' },
  // Idaho
  { name: 'Boise',        state: 'ID', stateName: 'Idaho',         lat: 43.61,  lng: -116.20,zip: '83702' },
  { name: 'Nampa',        state: 'ID', stateName: 'Idaho',         lat: 43.54,  lng: -116.56,zip: '83651' },
  // Illinois
  { name: 'Chicago',      state: 'IL', stateName: 'Illinois',      lat: 41.88,  lng: -87.63, zip: '60601' },
  { name: 'Aurora',       state: 'IL', stateName: 'Illinois',      lat: 41.76,  lng: -88.32, zip: '60505' },
  { name: 'Rockford',     state: 'IL', stateName: 'Illinois',      lat: 42.27,  lng: -89.09, zip: '61101' },
  { name: 'Springfield',  state: 'IL', stateName: 'Illinois',      lat: 39.80,  lng: -89.65, zip: '62701' },
  // Indiana
  { name: 'Indianapolis', state: 'IN', stateName: 'Indiana',       lat: 39.77,  lng: -86.16, zip: '46204' },
  { name: 'Fort Wayne',   state: 'IN', stateName: 'Indiana',       lat: 41.13,  lng: -85.13, zip: '46802' },
  { name: 'Evansville',   state: 'IN', stateName: 'Indiana',       lat: 37.97,  lng: -87.57, zip: '47708' },
  // Iowa
  { name: 'Des Moines',   state: 'IA', stateName: 'Iowa',          lat: 41.59,  lng: -93.62, zip: '50309' },
  { name: 'Cedar Rapids', state: 'IA', stateName: 'Iowa',          lat: 41.98,  lng: -91.66, zip: '52401' },
  // Kansas
  { name: 'Wichita',      state: 'KS', stateName: 'Kansas',        lat: 37.69,  lng: -97.34, zip: '67202' },
  { name: 'Overland Park',state: 'KS', stateName: 'Kansas',        lat: 38.99,  lng: -94.67, zip: '66210' },
  { name: 'Kansas City',  state: 'KS', stateName: 'Kansas',        lat: 39.12,  lng: -94.63, zip: '66101' },
  // Kentucky
  { name: 'Louisville',   state: 'KY', stateName: 'Kentucky',      lat: 38.25,  lng: -85.76, zip: '40202' },
  { name: 'Lexington',    state: 'KY', stateName: 'Kentucky',      lat: 38.04,  lng: -84.50, zip: '40507' },
  { name: 'Bowling Green',state: 'KY', stateName: 'Kentucky',      lat: 36.99,  lng: -86.44, zip: '42101' },
  // Louisiana
  { name: 'New Orleans',  state: 'LA', stateName: 'Louisiana',     lat: 29.95,  lng: -90.07, zip: '70112' },
  { name: 'Baton Rouge',  state: 'LA', stateName: 'Louisiana',     lat: 30.45,  lng: -91.13, zip: '70801' },
  { name: 'Shreveport',   state: 'LA', stateName: 'Louisiana',     lat: 32.52,  lng: -93.75, zip: '71101' },
  // Maryland
  { name: 'Baltimore',    state: 'MD', stateName: 'Maryland',      lat: 39.29,  lng: -76.61, zip: '21201' },
  { name: 'Frederick',    state: 'MD', stateName: 'Maryland',      lat: 39.41,  lng: -77.41, zip: '21701' },
  { name: 'Rockville',    state: 'MD', stateName: 'Maryland',      lat: 39.08,  lng: -77.15, zip: '20850' },
  // Massachusetts
  { name: 'Boston',       state: 'MA', stateName: 'Massachusetts', lat: 42.36,  lng: -71.06, zip: '02108' },
  { name: 'Worcester',    state: 'MA', stateName: 'Massachusetts', lat: 42.26,  lng: -71.80, zip: '01608' },
  { name: 'Springfield',  state: 'MA', stateName: 'Massachusetts', lat: 42.10,  lng: -72.59, zip: '01103' },
  // Michigan
  { name: 'Detroit',      state: 'MI', stateName: 'Michigan',      lat: 42.33,  lng: -83.05, zip: '48226' },
  { name: 'Grand Rapids', state: 'MI', stateName: 'Michigan',      lat: 42.96,  lng: -85.67, zip: '49503' },
  { name: 'Lansing',      state: 'MI', stateName: 'Michigan',      lat: 42.73,  lng: -84.55, zip: '48933' },
  { name: 'Ann Arbor',    state: 'MI', stateName: 'Michigan',      lat: 42.28,  lng: -83.74, zip: '48104' },
  // Minnesota
  { name: 'Minneapolis',  state: 'MN', stateName: 'Minnesota',     lat: 44.98,  lng: -93.27, zip: '55401' },
  { name: 'Saint Paul',   state: 'MN', stateName: 'Minnesota',     lat: 44.95,  lng: -93.09, zip: '55101' },
  { name: 'Rochester',    state: 'MN', stateName: 'Minnesota',     lat: 44.02,  lng: -92.47, zip: '55901' },
  // Mississippi
  { name: 'Jackson',      state: 'MS', stateName: 'Mississippi',   lat: 32.30,  lng: -90.18, zip: '39201' },
  { name: 'Biloxi',       state: 'MS', stateName: 'Mississippi',   lat: 30.40,  lng: -88.88, zip: '39530' },
  // Missouri
  { name: 'Kansas City',  state: 'MO', stateName: 'Missouri',      lat: 39.10,  lng: -94.58, zip: '64106' },
  { name: 'St. Louis',    state: 'MO', stateName: 'Missouri',      lat: 38.63,  lng: -90.20, zip: '63101' },
  { name: 'Springfield',  state: 'MO', stateName: 'Missouri',      lat: 37.21,  lng: -93.30, zip: '65806' },
  // Nevada
  { name: 'Las Vegas',    state: 'NV', stateName: 'Nevada',        lat: 36.17,  lng: -115.14,zip: '89101' },
  { name: 'Henderson',    state: 'NV', stateName: 'Nevada',        lat: 36.04,  lng: -114.98,zip: '89002' },
  { name: 'Reno',         state: 'NV', stateName: 'Nevada',        lat: 39.53,  lng: -119.81,zip: '89501' },
  // New Jersey
  { name: 'Newark',       state: 'NJ', stateName: 'New Jersey',    lat: 40.74,  lng: -74.17, zip: '07102' },
  { name: 'Jersey City',  state: 'NJ', stateName: 'New Jersey',    lat: 40.72,  lng: -74.04, zip: '07302' },
  { name: 'Trenton',      state: 'NJ', stateName: 'New Jersey',    lat: 40.22,  lng: -74.76, zip: '08608' },
  // New Mexico
  { name: 'Albuquerque',  state: 'NM', stateName: 'New Mexico',    lat: 35.08,  lng: -106.65,zip: '87101' },
  { name: 'Santa Fe',     state: 'NM', stateName: 'New Mexico',    lat: 35.69,  lng: -105.94,zip: '87501' },
  // New York
  { name: 'New York City',state: 'NY', stateName: 'New York',      lat: 40.71,  lng: -74.01, zip: '10001' },
  { name: 'Buffalo',      state: 'NY', stateName: 'New York',      lat: 42.89,  lng: -78.88, zip: '14201' },
  { name: 'Rochester',    state: 'NY', stateName: 'New York',      lat: 43.16,  lng: -77.61, zip: '14604' },
  { name: 'Albany',       state: 'NY', stateName: 'New York',      lat: 42.65,  lng: -73.75, zip: '12207' },
  { name: 'Syracuse',     state: 'NY', stateName: 'New York',      lat: 43.05,  lng: -76.15, zip: '13202' },
  // North Carolina
  { name: 'Charlotte',    state: 'NC', stateName: 'North Carolina',lat: 35.22,  lng: -80.84, zip: '28202' },
  { name: 'Raleigh',      state: 'NC', stateName: 'North Carolina',lat: 35.78,  lng: -78.64, zip: '27601' },
  { name: 'Greensboro',   state: 'NC', stateName: 'North Carolina',lat: 36.07,  lng: -79.79, zip: '27401' },
  { name: 'Durham',       state: 'NC', stateName: 'North Carolina',lat: 35.99,  lng: -78.90, zip: '27701' },
  { name: 'Winston-Salem',state: 'NC', stateName: 'North Carolina',lat: 36.10,  lng: -80.24, zip: '27101' },
  { name: 'Fayetteville', state: 'NC', stateName: 'North Carolina',lat: 35.05,  lng: -78.88, zip: '28301' },
  // Ohio
  { name: 'Columbus',     state: 'OH', stateName: 'Ohio',          lat: 39.96,  lng: -82.99, zip: '43215' },
  { name: 'Cleveland',    state: 'OH', stateName: 'Ohio',          lat: 41.50,  lng: -81.69, zip: '44113' },
  { name: 'Cincinnati',   state: 'OH', stateName: 'Ohio',          lat: 39.10,  lng: -84.51, zip: '45202' },
  { name: 'Toledo',       state: 'OH', stateName: 'Ohio',          lat: 41.66,  lng: -83.56, zip: '43604' },
  { name: 'Akron',        state: 'OH', stateName: 'Ohio',          lat: 41.08,  lng: -81.52, zip: '44308' },
  // Oklahoma
  { name: 'Oklahoma City',state: 'OK', stateName: 'Oklahoma',      lat: 35.47,  lng: -97.52, zip: '73102' },
  { name: 'Tulsa',        state: 'OK', stateName: 'Oklahoma',      lat: 36.15,  lng: -95.99, zip: '74103' },
  // Oregon
  { name: 'Portland',     state: 'OR', stateName: 'Oregon',        lat: 45.52,  lng: -122.68,zip: '97201' },
  { name: 'Salem',        state: 'OR', stateName: 'Oregon',        lat: 44.94,  lng: -123.03,zip: '97301' },
  { name: 'Eugene',       state: 'OR', stateName: 'Oregon',        lat: 44.05,  lng: -123.09,zip: '97401' },
  // Pennsylvania
  { name: 'Philadelphia', state: 'PA', stateName: 'Pennsylvania',  lat: 39.95,  lng: -75.17, zip: '19107' },
  { name: 'Pittsburgh',   state: 'PA', stateName: 'Pennsylvania',  lat: 40.44,  lng: -79.99, zip: '15222' },
  { name: 'Allentown',    state: 'PA', stateName: 'Pennsylvania',  lat: 40.60,  lng: -75.49, zip: '18101' },
  { name: 'Erie',         state: 'PA', stateName: 'Pennsylvania',  lat: 42.13,  lng: -80.08, zip: '16501' },
  // South Carolina
  { name: 'Charleston',   state: 'SC', stateName: 'South Carolina',lat: 32.78,  lng: -79.94, zip: '29401' },
  { name: 'Columbia',     state: 'SC', stateName: 'South Carolina',lat: 34.00,  lng: -81.03, zip: '29201' },
  { name: 'Greenville',   state: 'SC', stateName: 'South Carolina',lat: 34.85,  lng: -82.40, zip: '29601' },
  { name: 'Spartanburg',  state: 'SC', stateName: 'South Carolina',lat: 34.95,  lng: -81.93, zip: '29301' },
  { name: 'Myrtle Beach', state: 'SC', stateName: 'South Carolina',lat: 33.69,  lng: -78.89, zip: '29577' },
  // Tennessee
  { name: 'Nashville',    state: 'TN', stateName: 'Tennessee',     lat: 36.17,  lng: -86.78, zip: '37201' },
  { name: 'Memphis',      state: 'TN', stateName: 'Tennessee',     lat: 35.15,  lng: -90.05, zip: '38103' },
  { name: 'Knoxville',    state: 'TN', stateName: 'Tennessee',     lat: 35.96,  lng: -83.92, zip: '37902' },
  { name: 'Chattanooga',  state: 'TN', stateName: 'Tennessee',     lat: 35.05,  lng: -85.31, zip: '37402' },
  // Texas
  { name: 'Houston',      state: 'TX', stateName: 'Texas',         lat: 29.76,  lng: -95.37, zip: '77002' },
  { name: 'San Antonio',  state: 'TX', stateName: 'Texas',         lat: 29.42,  lng: -98.49, zip: '78205' },
  { name: 'Dallas',       state: 'TX', stateName: 'Texas',         lat: 32.78,  lng: -96.80, zip: '75201' },
  { name: 'Austin',       state: 'TX', stateName: 'Texas',         lat: 30.27,  lng: -97.74, zip: '78701' },
  { name: 'Fort Worth',   state: 'TX', stateName: 'Texas',         lat: 32.72,  lng: -97.32, zip: '76102' },
  { name: 'El Paso',      state: 'TX', stateName: 'Texas',         lat: 31.76,  lng: -106.49,zip: '79901' },
  // Utah
  { name: 'Salt Lake City',state:'UT', stateName: 'Utah',          lat: 40.76,  lng: -111.89,zip: '84101' },
  { name: 'West Valley',  state: 'UT', stateName: 'Utah',          lat: 40.69,  lng: -112.00,zip: '84120' },
  { name: 'Provo',        state: 'UT', stateName: 'Utah',          lat: 40.23,  lng: -111.66,zip: '84601' },
  // Virginia
  { name: 'Virginia Beach',state:'VA', stateName: 'Virginia',      lat: 36.85,  lng: -75.98, zip: '23451' },
  { name: 'Norfolk',      state: 'VA', stateName: 'Virginia',      lat: 36.85,  lng: -76.29, zip: '23510' },
  { name: 'Richmond',     state: 'VA', stateName: 'Virginia',      lat: 37.54,  lng: -77.43, zip: '23219' },
  { name: 'Arlington',    state: 'VA', stateName: 'Virginia',      lat: 38.88,  lng: -77.10, zip: '22201' },
  { name: 'Roanoke',      state: 'VA', stateName: 'Virginia',      lat: 37.27,  lng: -79.94, zip: '24011' },
  // Washington
  { name: 'Seattle',      state: 'WA', stateName: 'Washington',    lat: 47.61,  lng: -122.33,zip: '98101' },
  { name: 'Spokane',      state: 'WA', stateName: 'Washington',    lat: 47.66,  lng: -117.43,zip: '99201' },
  { name: 'Tacoma',       state: 'WA', stateName: 'Washington',    lat: 47.25,  lng: -122.44,zip: '98401' },
  // Wisconsin
  { name: 'Milwaukee',    state: 'WI', stateName: 'Wisconsin',     lat: 43.04,  lng: -87.91, zip: '53202' },
  { name: 'Madison',      state: 'WI', stateName: 'Wisconsin',     lat: 43.07,  lng: -89.40, zip: '53703' },
  { name: 'Green Bay',    state: 'WI', stateName: 'Wisconsin',     lat: 44.51,  lng: -88.02, zip: '54301' },
]

/** Pick a random city (optionally filtered by state) */
export function randomCity(stateCode?: string): USCity {
  const pool = stateCode ? US_CITIES.filter(c => c.state === stateCode) : US_CITIES
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Pick two cities that are reasonably far apart for a delivery route */
export function randomCityPair(): { pickup: USCity; dropoff: USCity } {
  const pickup = randomCity()
  // Try to find a city in the same state first (intrastate), otherwise use any
  const sameState = US_CITIES.filter(c => c.state === pickup.state && c.name !== pickup.name)
  const dropoff = sameState.length > 0 && Math.random() > 0.35
    ? sameState[Math.floor(Math.random() * sameState.length)]
    : US_CITIES.filter(c => c.name !== pickup.name)[Math.floor(Math.random() * (US_CITIES.length - 1))]
  return { pickup, dropoff }
}

/** Get state name from code */
export function getStateName(code: string): string {
  return US_STATES.find(s => s.code === code)?.name ?? code
}
