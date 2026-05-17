"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MapPin, Calendar, Clock, Users, Car, FileText, Phone, User, Tag, Percent, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { TripData } from "@/app/trips/page"

interface Destination {
  id: string
  name: string
  distance_km: number
  price_usd: number
  latitude: number
  longitude: number
}

const SERVICE_TYPES = [
  { id: "turistico", name: "Servicio Turistico", description: "Tours y traslados a destinos turisticos" },
  { id: "interdepartamental", name: "Viajes Interdepartamentales", description: "Traslados entre departamentos" },
  { id: "local", name: "Traslados Locales", description: "Movilidad rapida dentro de Rivas" },
  { id: "programada", name: "Recogida Programada", description: "Recogida en hoteles, terminales o aeropuertos" }
]

const PRICE_PER_KM = 5

interface TripBookingFormProps {
  onBook: (data: TripData) => void
}

export function TripBookingForm({ onBook }: TripBookingFormProps) {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loadingDestinations, setLoadingDestinations] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [submitError, setSubmitError] = useState("")
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [serviceType, setServiceType] = useState("")
  const [notes, setNotes] = useState("")

  // Fetch destinations from API
  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch("/api/destinations")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setDestinations(data)
        }
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setLoadingDestinations(false)
      }
    }
    fetchDestinations()
  }, [])

  // Cargar datos del localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName")
    const savedPhone = localStorage.getItem("userPhone")
    if (savedName) setName(savedName)
    if (savedPhone) setPhone(savedPhone)
  }, [])

  // Cargar tipo de servicio desde URL params
  useEffect(() => {
    const serviceParam = searchParams.get("service")
    if (serviceParam && SERVICE_TYPES.find(s => s.id === serviceParam)) {
      setServiceType(serviceParam)
    } else {
      setServiceType("turistico")
    }
  }, [searchParams])

  const selectedDestination = useMemo(() => {
    return destinations.find(d => d.id === destination)
  }, [destination, destinations])

  const estimatedPrice = useMemo(() => {
    if (!selectedDestination) return null
    return selectedDestination.price_usd
  }, [selectedDestination])

  const finalPrice = useMemo(() => {
    if (!estimatedPrice) return null
    const discount = estimatedPrice * (couponDiscount / 100)
    return estimatedPrice - discount
  }, [estimatedPrice, couponDiscount])

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) return
    
    setValidatingCoupon(true)
    setCouponError("")
    
    try {
      const response = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      })
      
      const data = await response.json()
      
      if (response.ok && data.valid) {
        setCouponApplied(code)
        setCouponDiscount(data.discount_percentage)
        setCouponError("")
      } else {
        setCouponError(data.error || "Cupon invalido o expirado")
        setCouponApplied(null)
        setCouponDiscount(0)
      }
    } catch (error) {
      setCouponError("Error al validar el cupon")
    } finally {
      setValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode("")
    setCouponApplied(null)
    setCouponDiscount(0)
    setCouponError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitError("")
    
    try {
      // Save user info to localStorage
      localStorage.setItem("userName", name)
      localStorage.setItem("userPhone", phone)
      
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          origin,
          destination: selectedDestination?.name || destination,
          destinationId: selectedDestination?.id,
          distanceKm: selectedDestination?.distance_km || 0,
          priceUsd: estimatedPrice || 0,
          discountCode: couponApplied,
          discountAmount: couponApplied ? (estimatedPrice || 0) * (couponDiscount / 100) : 0,
          finalPrice: finalPrice || estimatedPrice || 0,
          passengers: parseInt(passengers),
          tripDate: date,
          tripTime: time,
          notes: notes || null,
          // For demo purposes, include passenger info
          passengerName: name,
          passengerPhone: phone
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Error al crear el viaje")
      }
      
      // Call onBook with the trip data including driver info
      onBook({
        id: data.trip.id,
        confirmationCode: data.trip.confirmation_code,
        name,
        phone,
        origin,
        destination: selectedDestination?.name || destination,
        date,
        time,
        passengers: parseInt(passengers),
        serviceType,
        notes,
        priceUsd: estimatedPrice || 0,
        finalPrice: finalPrice || estimatedPrice || 0,
        distanceKm: selectedDestination?.distance_km || 0,
        status: data.trip.status,
        demoDriver: data.trip.demo_driver
      })
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Error al crear el viaje")
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="shadow-lg rounded-lg overflow-hidden bg-white border">
        <div className="bg-[#1a5276] text-white px-6 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-xl">
            <Car className="w-6 h-6" />
            Formulario de Reservacion
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}

            {/* Service Type Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1a5276] border-b pb-2">Tipo de Servicio</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setServiceType(service.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      serviceType === service.id
                        ? "border-amber-500 bg-amber-50 text-[#1a5276]"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <Car className={`w-6 h-6 mx-auto mb-1 ${serviceType === service.id ? "text-amber-500" : "text-gray-400"}`} />
                    <p className="text-xs font-medium leading-tight">{service.name}</p>
                  </button>
                ))}
              </div>
              {serviceType && (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  {SERVICE_TYPES.find(s => s.id === serviceType)?.description}
                </p>
              )}
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1a5276] border-b pb-2">Informacion Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Juan Perez"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+505 8888-8888"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1a5276] border-b pb-2">Detalles del Viaje</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Punto de Origen</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none z-10" />
                    <input
                      id="origin"
                      type="text"
                      placeholder="Hotel, direccion, etc."
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-500 pointer-events-none z-10" />
                    <Select value={destination} onValueChange={setDestination} disabled={loadingDestinations}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={loadingDestinations ? "Cargando destinos..." : "Selecciona destino"} />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name} ({dest.distance_km} km - ${dest.price_usd})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      id="date"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      id="time"
                      type="time"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Pasajeros</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <Select value={passengers} onValueChange={setPassengers}>
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "pasajero" : "pasajeros"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1a5276] border-b pb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Cupon de Descuento
              </h3>
              
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">
                      Cupon {couponApplied} aplicado - {couponDiscount}% de descuento
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                    <input
                      type="text"
                      placeholder="Ingresa tu codigo de cupon"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10 uppercase"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || validatingCoupon}
                  >
                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
                  </Button>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-sm">{couponError}</p>
              )}
              <p className="text-xs text-gray-500">
                Cupones disponibles: BIENVENIDO10, PACIFIC15, VERANO20, TURISTA10, AEROPUERTO15
              </p>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales (opcional)</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <Textarea
                  id="notes"
                  placeholder="Equipaje extra, necesidades especiales, instrucciones de recogida..."
                  className="pl-10 min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Price Estimate */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Precio estimado:</p>
                  {couponApplied && estimatedPrice ? (
                    <div>
                      <p className="text-xl text-gray-400 line-through">
                        ${estimatedPrice.toFixed(2)} USD
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        ${finalPrice?.toFixed(2)} USD
                      </p>
                      <p className="text-sm text-green-600">
                        Ahorraste ${(estimatedPrice - (finalPrice || 0)).toFixed(2)} USD
                      </p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-[#1a5276]">
                      {estimatedPrice ? `$${estimatedPrice.toFixed(2)} USD` : "Selecciona un destino"}
                    </p>
                  )}
                  {selectedDestination && (
                    <p className="text-sm text-gray-500 mt-1">
                      Distancia: {selectedDestination.distance_km} km x $5/km
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="bg-[#1a5276] text-white px-4 py-2 rounded-lg">
                    <p className="text-xs">Tarifa</p>
                    <p className="font-bold">$5/km</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                El precio final puede variar segun condiciones de la ruta. Contactanos para cotizaciones especiales.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 text-lg"
              disabled={isLoading || !destination || !serviceType || !name || !phone || !origin || !date || !time}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Procesando reserva...
                </>
              ) : (
                "Confirmar Reservacion"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
