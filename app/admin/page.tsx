"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Users, Car, DollarSign, TrendingUp, Calendar, 
  MapPin, Clock, Star, Bell, Settings, LogOut,
  ChevronDown, Search, Filter, Download, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Trip {
  id: string
  passenger: string
  driver: string
  origin: string
  destination: string
  date: string
  time: string
  status: "completed" | "in-progress" | "cancelled" | "pending"
  amount: string
}

interface Driver {
  id: string
  name: string
  status: "online" | "offline" | "busy"
  trips: number
  rating: number
  earnings: string
}

const MOCK_TRIPS: Trip[] = [
  { id: "PCT-A1B2C3", passenger: "Maria Garcia", driver: "Juan Lopez", origin: "Hotel Victoriano", destination: "Playa Maderas", date: "2026-04-26", time: "10:30", status: "completed", amount: "$18" },
  { id: "PCT-D4E5F6", passenger: "Carlos Rodriguez", driver: "Pedro Martinez", origin: "Terminal Rivas", destination: "San Juan del Sur", date: "2026-04-26", time: "11:00", status: "completed", amount: "$15" },
  { id: "PCT-G7H8I9", passenger: "Ana Martinez", driver: "Jose Hernandez", origin: "Aeropuerto", destination: "Granada", date: "2026-04-26", time: "14:00", status: "in-progress", amount: "$45" },
  { id: "PCT-J1K2L3", passenger: "Luis Morales", driver: "Miguel Sanchez", origin: "Rivas Centro", destination: "Playa Gigante", date: "2026-04-26", time: "15:30", status: "pending", amount: "$22" },
  { id: "PCT-M4N5O6", passenger: "Sofia Ramirez", driver: "-", origin: "San Juan del Sur", destination: "Tola", date: "2026-04-26", time: "09:00", status: "cancelled", amount: "$12" },
]

const MOCK_DRIVERS: Driver[] = [
  { id: "1", name: "Juan Lopez", status: "online", trips: 234, rating: 4.9, earnings: "$4,520" },
  { id: "2", name: "Pedro Martinez", status: "busy", trips: 189, rating: 4.8, earnings: "$3,890" },
  { id: "3", name: "Jose Hernandez", status: "online", trips: 156, rating: 4.7, earnings: "$3,210" },
  { id: "4", name: "Miguel Sanchez", status: "offline", trips: 98, rating: 4.6, earnings: "$2,150" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "drivers">("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700",
      "in-progress": "bg-blue-100 text-blue-700",
      pending: "bg-amber-100 text-amber-700",
      cancelled: "bg-red-100 text-red-700",
      online: "bg-green-100 text-green-700",
      offline: "bg-gray-100 text-gray-700",
      busy: "bg-blue-100 text-blue-700"
    }
    return styles[status] || "bg-gray-100 text-gray-700"
  }

  const filteredTrips = MOCK_TRIPS.filter(trip => {
    const matchesSearch = trip.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trip.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d2d44] text-white z-50 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-04-03%20at%201.01.53%20PM-Photoroom-fj1m5LpFsMIQWOVTdC2t55J8S3dCBm.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-sm">PACIFIC COAST</p>
              <p className="text-xs text-white/70">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "overview" ? "bg-[#1a5276] text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Resumen General
            </button>
            <button
              onClick={() => setActiveTab("trips")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "trips" ? "bg-[#1a5276] text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Car className="w-5 h-5" />
              Viajes
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "drivers" ? "bg-[#1a5276] text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Users className="w-5 h-5" />
              Conductores
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-sm">Administrador</p>
              <p className="text-xs text-white/50">admin@pacificcoast.com</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesion
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1a5276]">
                {activeTab === "overview" && "Resumen General"}
                {activeTab === "trips" && "Gestion de Viajes"}
                {activeTab === "drivers" && "Conductores"}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-NI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Ingresos Hoy</p>
                        <p className="text-3xl font-bold text-[#1a5276]">$1,245</p>
                        <p className="text-xs text-green-500 mt-1">+12% vs ayer</p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-full">
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Viajes Hoy</p>
                        <p className="text-3xl font-bold text-[#1a5276]">48</p>
                        <p className="text-xs text-green-500 mt-1">+8% vs ayer</p>
                      </div>
                      <div className="p-4 bg-blue-100 rounded-full">
                        <Car className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Conductores Activos</p>
                        <p className="text-3xl font-bold text-[#1a5276]">12</p>
                        <p className="text-xs text-gray-500 mt-1">de 15 totales</p>
                      </div>
                      <div className="p-4 bg-amber-100 rounded-full">
                        <Users className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Calificacion Promedio</p>
                        <p className="text-3xl font-bold text-[#1a5276]">4.8</p>
                        <p className="text-xs text-gray-500 mt-1">de 5 estrellas</p>
                      </div>
                      <div className="p-4 bg-purple-100 rounded-full">
                        <Star className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ingresos de la Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                      {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"].map((day, i) => {
                        const heights = [60, 75, 45, 80, 90, 100, 70]
                        return (
                          <div key={day} className="flex flex-col items-center gap-2 flex-1">
                            <div
                              className="w-full bg-[#1a5276] rounded-t-md transition-all hover:bg-amber-500"
                              style={{ height: `${heights[i]}%` }}
                            />
                            <span className="text-xs text-gray-500">{day}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Destinos Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "San Juan del Sur", trips: 145, percentage: 100 },
                        { name: "Playa Maderas", trips: 89, percentage: 61 },
                        { name: "Playa Gigante", trips: 67, percentage: 46 },
                        { name: "Granada", trips: 45, percentage: 31 },
                        { name: "Managua", trips: 34, percentage: 23 }
                      ].map((dest) => (
                        <div key={dest.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{dest.name}</span>
                            <span className="text-gray-500">{dest.trips} viajes</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1a5276] rounded-full"
                              style={{ width: `${dest.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Trips */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Ultimos Viajes</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("trips")}>
                    Ver todos
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Pasajero</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_TRIPS.slice(0, 5).map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell className="font-mono text-sm">{trip.id}</TableCell>
                          <TableCell>{trip.passenger}</TableCell>
                          <TableCell>{trip.destination}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trip.status)}>
                              {trip.status === "completed" && "Completado"}
                              {trip.status === "in-progress" && "En curso"}
                              {trip.status === "pending" && "Pendiente"}
                              {trip.status === "cancelled" && "Cancelado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{trip.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trips Tab */}
          {activeTab === "trips" && (
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por pasajero o codigo..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="completed">Completados</SelectItem>
                        <SelectItem value="in-progress">En curso</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trips Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codigo</TableHead>
                        <TableHead>Pasajero</TableHead>
                        <TableHead>Conductor</TableHead>
                        <TableHead>Ruta</TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell className="font-mono text-sm">{trip.id}</TableCell>
                          <TableCell>{trip.passenger}</TableCell>
                          <TableCell>{trip.driver}</TableCell>
                          <TableCell className="max-w-[200px]">
                            <div className="text-sm">
                              <p className="truncate">{trip.origin}</p>
                              <p className="text-gray-500 truncate">→ {trip.destination}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{trip.date}</p>
                              <p className="text-gray-500">{trip.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(trip.status)}>
                              {trip.status === "completed" && "Completado"}
                              {trip.status === "in-progress" && "En curso"}
                              {trip.status === "pending" && "Pendiente"}
                              {trip.status === "cancelled" && "Cancelado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{trip.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Drivers Tab */}
          {activeTab === "drivers" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_DRIVERS.map((driver) => (
                  <Card key={driver.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-[#1a5276] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {driver.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <Badge className={getStatusBadge(driver.status)}>
                          {driver.status === "online" && "En linea"}
                          {driver.status === "offline" && "Desconectado"}
                          {driver.status === "busy" && "Ocupado"}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{driver.name}</h3>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Viajes totales</span>
                          <span className="font-medium">{driver.trips}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Calificacion</span>
                          <span className="font-medium flex items-center gap-1">
                            {driver.rating}
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ganancias</span>
                          <span className="font-medium text-green-600">{driver.earnings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
