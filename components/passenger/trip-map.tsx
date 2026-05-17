"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet with Next.js
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  })
}

const originIcon = createIcon("#22c55e") // green
const destinationIcon = createIcon("#ef4444") // red
const taxiIcon = createIcon("#f59e0b") // amber

// Rivas, Nicaragua coordinates
const RIVAS_CENTER: [number, number] = [11.4392, -85.8346]

// Common destinations in Rivas area
const DESTINATIONS: Record<string, [number, number]> = {
  "San Juan del Sur": [11.2533, -85.8689],
  "Playa Maderas": [11.2833, -85.8500],
  "Playa Gigante": [11.3833, -86.0333],
  "Playa Marsella": [11.2667, -85.8500],
  "Tola": [11.4333, -85.9333],
  "Rivas Centro": [11.4392, -85.8346],
  "Granada": [11.9289, -85.9560],
  "Managua": [12.1150, -86.2362],
  "Aeropuerto Internacional": [12.1414, -86.1682],
  "default": [11.3500, -85.8500]
}

// Component to fit bounds
function FitBounds({ origin, destination }: { origin: [number, number]; destination: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    const bounds = L.latLngBounds([origin, destination])
    map.fitBounds(bounds, { padding: [50, 50] })
  }, [map, origin, destination])
  
  return null
}

// Animated taxi marker
function AnimatedTaxi({ route }: { route: [number, number][] }) {
  const [position, setPosition] = useState(0)
  const map = useMap()
  
  useEffect(() => {
    if (route.length < 2) return
    
    const interval = setInterval(() => {
      setPosition((prev) => {
        const next = prev + 0.01
        return next >= 1 ? 0 : next
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [route])
  
  if (route.length < 2) return null
  
  // Interpolate position along route
  const totalLength = route.length - 1
  const segmentIndex = Math.floor(position * totalLength)
  const segmentProgress = (position * totalLength) % 1
  
  const startPoint = route[Math.min(segmentIndex, route.length - 1)]
  const endPoint = route[Math.min(segmentIndex + 1, route.length - 1)]
  
  const currentLat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress
  const currentLng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress
  
  return (
    <Marker position={[currentLat, currentLng]} icon={taxiIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold">Tu Taxi</p>
          <p className="text-xs text-gray-500">En camino...</p>
        </div>
      </Popup>
    </Marker>
  )
}

interface TripMapProps {
  origin: string
  destination: string
}

export function TripMap({ origin, destination }: TripMapProps) {
  const originCoords = RIVAS_CENTER // Default to Rivas center for origin
  const destCoords = DESTINATIONS[destination] || DESTINATIONS["default"]
  
  // Create a simple route (straight line with some waypoints for realism)
  const route: [number, number][] = [
    originCoords,
    [
      (originCoords[0] + destCoords[0]) / 2 + (Math.random() * 0.02 - 0.01),
      (originCoords[1] + destCoords[1]) / 2 + (Math.random() * 0.02 - 0.01)
    ],
    destCoords
  ]

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border relative z-0">
      <MapContainer
        center={RIVAS_CENTER}
        zoom={10}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds origin={originCoords} destination={destCoords} />
        
        {/* Route line */}
        <Polyline
          positions={route}
          pathOptions={{
            color: "#1a5276",
            weight: 4,
            opacity: 0.7,
            dashArray: "10, 10"
          }}
        />
        
        {/* Origin marker */}
        <Marker position={originCoords} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-green-600">Punto de Recogida</p>
              <p className="text-sm">{origin}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Destination marker */}
        <Marker position={destCoords} icon={destinationIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold text-red-600">Destino</p>
              <p className="text-sm">{destination}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Animated taxi */}
        <AnimatedTaxi route={route} />
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Origen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Destino</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span>Tu Taxi</span>
          </div>
        </div>
      </div>
    </div>
  )
}
