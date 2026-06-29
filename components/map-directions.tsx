"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation, Clock, Route } from "lucide-react"
import { estimateDriveTime } from "@/lib/calculator"

interface MapDirectionsProps {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  pickupCity: string
  dropoffCity: string
  distance: number
}

export function MapDirections({
  pickupLat, pickupLng, dropoffLat, dropoffLng,
  pickupCity, dropoffCity, distance
}: MapDirectionsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: string } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    // Add leaflet CSS dynamically
    const existingLink = document.getElementById('leaflet-css')
    if (!existingLink) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    let map: any

    const initMap = async () => {
      try {
        const L = await import('leaflet')

        // Fix default icon
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        if (!mapRef.current || mapInstanceRef.current) return

        const centerLat = (pickupLat + dropoffLat) / 2
        const centerLng = (pickupLng + dropoffLng) / 2

        map = L.map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: 7,
          zoomControl: true,
        })
        mapInstanceRef.current = map

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
        }).addTo(map)

        const pickupIcon = L.divIcon({
          html: `<div style="background:#10b981;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(16,185,129,0.4)"></div>`,
          iconSize: [14, 14],
          className: '',
        })

        const dropoffIcon = L.divIcon({
          html: `<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(239,68,68,0.4)"></div>`,
          iconSize: [14, 14],
          className: '',
        })

        L.marker([pickupLat, pickupLng], { icon: pickupIcon })
          .addTo(map)
          .bindPopup(`<b>📍 PICKUP</b><br/>${pickupCity}`)

        L.marker([dropoffLat, dropoffLng], { icon: dropoffIcon })
          .addTo(map)
          .bindPopup(`<b>🏁 DELIVERY</b><br/>${dropoffCity}`)

        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson`
          const res = await fetch(url)
          const data = await res.json()

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0]
            const coords = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])

            L.polyline(coords, { color: '#f97316', weight: 4, opacity: 0.85 }).addTo(map)

            const bounds = L.latLngBounds(coords)
            map.fitBounds(bounds, { padding: [40, 40] })

            const durationMin = Math.round(route.duration / 60)
            const h = Math.floor(durationMin / 60)
            const m = durationMin % 60
            setRouteInfo({
              distance: Math.round(route.distance / 1609.34 * 10) / 10,
              duration: h > 0 ? `${h}h ${m}m` : `${m} min`,
            })
          } else {
            L.polyline([[pickupLat, pickupLng], [dropoffLat, dropoffLng]], {
              color: '#f97316', weight: 3, opacity: 0.7, dashArray: '10, 8',
            }).addTo(map)
            const bounds = L.latLngBounds([[pickupLat, pickupLng], [dropoffLat, dropoffLng]])
            map.fitBounds(bounds, { padding: [50, 50] })
          }
        } catch {
          L.polyline([[pickupLat, pickupLng], [dropoffLat, dropoffLng]], {
            color: '#f97316', weight: 3, opacity: 0.7, dashArray: '10, 8',
          }).addTo(map)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Map error:', err)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng])

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl overflow-hidden border border-slate-700" style={{ height: '380px' }}>
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-slate-400 text-sm">Loading route map...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700">
          <Route className="h-4 w-4 text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">{routeInfo?.distance || distance} mi</p>
          <p className="text-slate-500 text-xs">Route Miles</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700">
          <Clock className="h-4 w-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">{routeInfo?.duration || estimateDriveTime(distance)}</p>
          <p className="text-slate-500 text-xs">Drive Time</p>
        </div>
        <div className="bg-slate-800/60 rounded-lg p-3 text-center border border-slate-700">
          <Navigation className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${dropoffLat},${dropoffLng}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 font-bold text-sm hover:underline"
          >
            Open GPS
          </a>
          <p className="text-slate-500 text-xs">Google Maps</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Pickup: {pickupCity}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Delivery: {dropoffCity}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-orange-500" />
          <span>Route</span>
        </div>
      </div>
    </div>
  )
}
