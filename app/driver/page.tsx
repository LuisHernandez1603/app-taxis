"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { 
  Car, 
  Star, 
  MapPin, 
  Fuel, 
  Clock, 
  User, 
  Phone,
  Calendar,
  DollarSign,
  XCircle,
  CheckCircle,
  MessageSquare,
  BarChart3,
  RefreshCw,
  LogOut,
  Home
} from "lucide-react"
import Link from "next/link"

interface Driver {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  vehicle_brand: string
  vehicle_model: string
  vehicle_year: number
  vehicle_color: string
  vehicle_plate: string
  status: string
  rating: number
  total_trips: number
  total_cancelled_trips: number
  current_location: string
}

interface Review {
  id: string
  passenger_name: string
  rating: number
  comment: string
  created_at: string
}

interface FuelRecord {
  id: string
  date: string
  amount_usd: number
  gallons: number
  odometer_start: number
  odometer_end: number
  notes: string
}

export default function DriverDashboard() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([])
  const [fuelSummary, setFuelSummary] = useState({ totalAmount: 0, totalGallons: 0, recordCount: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [loadingFuel, setLoadingFuel] = useState(false)
  const [savingFuel, setSavingFuel] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  // Fuel form state
  const [fuelDate, setFuelDate] = useState(new Date().toISOString().split('T')[0])
  const [fuelAmount, setFuelAmount] = useState("")
  const [fuelGallons, setFuelGallons] = useState("")
  const [fuelOdometerStart, setFuelOdometerStart] = useState("")
  const [fuelOdometerEnd, setFuelOdometerEnd] = useState("")
  const [fuelNotes, setFuelNotes] = useState("")
  const [fuelError, setFuelError] = useState("")
  const [fuelSuccess, setFuelSuccess] = useState(false)

  // Fetch drivers
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch("/api/demo-drivers")
        const data = await response.json()
        if (Array.isArray(data)) {
          setDrivers(data)
          // Check for saved driver email from login
          const savedDriverEmail = localStorage.getItem("driverEmail")
          const savedDriverId = localStorage.getItem("selectedDriverId")
          
          let driver = null
          if (savedDriverEmail) {
            driver = data.find((d: Driver) => d.email === savedDriverEmail)
          } else if (savedDriverId) {
            driver = data.find((d: Driver) => d.id === savedDriverId)
          }
          
          if (!driver && data.length > 0) {
            driver = data[0]
          }
          
          if (driver) {
            setSelectedDriver(driver)
            localStorage.setItem("selectedDriverId", driver.id)
          }
        }
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  // Fetch reviews when driver selected
  useEffect(() => {
    if (!selectedDriver) return
    
    async function fetchReviews() {
      setLoadingReviews(true)
      try {
        const response = await fetch(`/api/driver-reviews?driverId=${selectedDriver.id}`)
        const data = await response.json()
        if (Array.isArray(data)) {
          setReviews(data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoadingReviews(false)
      }
    }
    fetchReviews()
  }, [selectedDriver])

  // Fetch fuel records when driver selected
  useEffect(() => {
    if (!selectedDriver) return
    
    async function fetchFuelRecords() {
      setLoadingFuel(true)
      try {
        const response = await fetch(`/api/fuel-consumption?driverId=${selectedDriver.id}`)
        const data = await response.json()
        if (data.records) {
          setFuelRecords(data.records)
          setFuelSummary(data.summary)
        }
      } catch (error) {
        console.error("Error fetching fuel records:", error)
      } finally {
        setLoadingFuel(false)
      }
    }
    fetchFuelRecords()
  }, [selectedDriver])

  const handleDriverChange = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId)
    if (driver) {
      setSelectedDriver(driver)
      localStorage.setItem("selectedDriverId", driver.id)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedDriver) return
    
    setUpdatingStatus(true)
    try {
      const response = await fetch("/api/demo-drivers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: selectedDriver.id,
          status: newStatus
        })
      })
      
      if (response.ok) {
        const updatedDriver = await response.json()
        setSelectedDriver(updatedDriver)
        setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d))
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleSaveFuel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDriver || !fuelAmount) return
    
    setSavingFuel(true)
    setFuelError("")
    setFuelSuccess(false)
    
    try {
      const response = await fetch("/api/fuel-consumption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: selectedDriver.id,
          date: fuelDate,
          amountUsd: parseFloat(fuelAmount),
          gallons: fuelGallons ? parseFloat(fuelGallons) : null,
          odometerStart: fuelOdometerStart ? parseInt(fuelOdometerStart) : null,
          odometerEnd: fuelOdometerEnd ? parseInt(fuelOdometerEnd) : null,
          notes: fuelNotes || null
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error)
      }
      
      setFuelSuccess(true)
      setFuelAmount("")
      setFuelGallons("")
      setFuelOdometerStart("")
      setFuelOdometerEnd("")
      setFuelNotes("")
      
      // Refresh fuel records
      const refreshResponse = await fetch(`/api/fuel-consumption?driverId=${selectedDriver.id}`)
      const refreshData = await refreshResponse.json()
      if (refreshData.records) {
        setFuelRecords(refreshData.records)
        setFuelSummary(refreshData.summary)
      }
    } catch (error) {
      setFuelError(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setSavingFuel(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-10 h-10 text-[#1a5276] mx-auto" />
          <p className="mt-4 text-gray-600">Cargando panel del conductor...</p>
        </div>
      </div>
    )
  }

  if (!selectedDriver) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No hay conductores disponibles</p>
          <Link href="/">
            <Button className="mt-4 bg-[#1a5276]">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#1a5276] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-xl">Pacific Coast Taxi</h1>
                <p className="text-sm text-blue-200">Panel del Conductor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={selectedDriver.id} onValueChange={handleDriverChange}>
                <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Link href="/">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Home className="w-4 h-4 mr-2" />
                  Inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Driver Info Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#1a5276] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedDriver.first_name} {selectedDriver.last_name}
                  </h2>
                  <p className="text-gray-600">{selectedDriver.email}</p>
                  <a href={`tel:${selectedDriver.phone}`} className="text-[#1a5276] flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {selectedDriver.phone}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-700">{selectedDriver.rating}</span>
                  </div>
                  <p className="text-sm text-yellow-600">Calificacion</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-700">{selectedDriver.total_trips}</span>
                  </div>
                  <p className="text-sm text-green-600">Viajes Completados</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-2xl font-bold text-red-700">{selectedDriver.total_cancelled_trips}</span>
                  </div>
                  <p className="text-sm text-red-600">Cancelados</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{selectedDriver.current_location || "Sin ubicacion"}</p>
                </div>
              </div>
            </div>

            {/* Vehicle & Status */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between border-t pt-6">
              <div className="flex items-center gap-4">
                <Car className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedDriver.vehicle_brand} {selectedDriver.vehicle_model} ({selectedDriver.vehicle_year})
                  </p>
                  <p className="text-gray-600">
                    Color: {selectedDriver.vehicle_color} | Placa: <span className="font-mono">{selectedDriver.vehicle_plate}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Label>Estado:</Label>
                <Select 
                  value={selectedDriver.status} 
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Disponible
                      </span>
                    </SelectItem>
                    <SelectItem value="busy">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        Ocupado
                      </span>
                    </SelectItem>
                    <SelectItem value="offline">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                        Desconectado
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {updatingStatus && <Spinner className="w-4 h-4" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Resenas ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex items-center gap-2">
              <Fuel className="w-4 h-4" />
              Consumo de Gasolina
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Resenas de Pasajeros
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <Spinner className="w-8 h-8 mx-auto text-[#1a5276]" />
                    <p className="mt-2 text-gray-500">Cargando resenas...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aun no tienes resenas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{review.passenger_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString("es-NI")}
                              </span>
                            </div>
                          </div>
                          <Badge className={
                            review.rating >= 4 ? "bg-green-100 text-green-700" :
                            review.rating >= 3 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }>
                            {review.rating}/5
                          </Badge>
                        </div>
                        {review.comment && (
                          <p className="mt-3 text-gray-600 italic">&quot;{review.comment}&quot;</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fuel Tab */}
          <TabsContent value="fuel">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fuel Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-[#1a5276]" />
                    Registrar Consumo de Gasolina
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveFuel} className="space-y-4">
                    {fuelError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {fuelError}
                      </div>
                    )}
                    {fuelSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                        Registro guardado exitosamente!
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="fuel-date">Fecha</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="fuel-date"
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                          value={fuelDate}
                          onChange={(e) => setFuelDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fuel-amount">Monto (USD) *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="fuel-amount"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="25.00"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                            value={fuelAmount}
                            onChange={(e) => setFuelAmount(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fuel-gallons">Galones</Label>
                        <div className="relative">
                          <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="fuel-gallons"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="5.5"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10"
                            value={fuelGallons}
                            onChange={(e) => setFuelGallons(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="odometer-start">Odometro Inicio (km)</Label>
                        <input
                          id="odometer-start"
                          type="number"
                          min="0"
                          placeholder="125000"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={fuelOdometerStart}
                          onChange={(e) => setFuelOdometerStart(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="odometer-end">Odometro Final (km)</Label>
                        <input
                          id="odometer-end"
                          type="number"
                          min="0"
                          placeholder="125350"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={fuelOdometerEnd}
                          onChange={(e) => setFuelOdometerEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuel-notes">Notas</Label>
                      <Textarea
                        id="fuel-notes"
                        placeholder="Gasolinera, tipo de gasolina, observaciones..."
                        value={fuelNotes}
                        onChange={(e) => setFuelNotes(e.target.value)}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#1a5276] hover:bg-[#154360]"
                      disabled={savingFuel || !fuelAmount}
                    >
                      {savingFuel ? (
                        <>
                          <Spinner className="w-4 h-4 mr-2" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Fuel className="w-4 h-4 mr-2" />
                          Guardar Registro
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Fuel Summary & History */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#1a5276]" />
                      Resumen de Consumo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-blue-700">${fuelSummary.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-blue-600">Total Gastado</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-4 text-center">
                        <Fuel className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-amber-700">{fuelSummary.totalGallons.toFixed(1)}</p>
                        <p className="text-sm text-amber-600">Galones</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <Calendar className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-green-700">{fuelSummary.recordCount}</p>
                        <p className="text-sm text-green-600">Registros</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Historial Reciente
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (selectedDriver) {
                            fetch(`/api/fuel-consumption?driverId=${selectedDriver.id}`)
                              .then(r => r.json())
                              .then(data => {
                                if (data.records) {
                                  setFuelRecords(data.records)
                                  setFuelSummary(data.summary)
                                }
                              })
                          }
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingFuel ? (
                      <div className="text-center py-4">
                        <Spinner className="w-6 h-6 mx-auto text-[#1a5276]" />
                      </div>
                    ) : fuelRecords.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No hay registros de gasolina
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {fuelRecords.slice(0, 10).map((record) => (
                          <div key={record.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <p className="font-medium text-gray-800">
                                {new Date(record.date).toLocaleDateString("es-NI", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short"
                                })}
                              </p>
                              {record.gallons && (
                                <p className="text-sm text-gray-500">{record.gallons} galones</p>
                              )}
                            </div>
                            <p className="text-lg font-bold text-[#1a5276]">
                              ${record.amount_usd.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
