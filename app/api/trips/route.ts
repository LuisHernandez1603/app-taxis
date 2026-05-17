import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface DemoDriver {
  id: string
  first_name: string
  last_name: string
  phone: string
  vehicle_brand: string
  vehicle_model: string
  vehicle_color: string
  vehicle_plate: string
  rating: number
  total_trips: number
  current_latitude: number | null
  current_longitude: number | null
  current_location: string | null
  status: string
}

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 111 // Approximate km per degree
  const dLat = lat2 - lat1
  const dLng = lng2 - lng1
  return Math.sqrt(dLat * dLat + dLng * dLng) * R
}

// GET all trips for the current user or all trips without auth (for demo)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const passengerEmail = searchParams.get("email")

    let query = supabase
      .from("trips")
      .select(`
        *,
        demo_driver:demo_drivers(
          id,
          first_name,
          last_name,
          phone,
          vehicle_brand,
          vehicle_model,
          vehicle_year,
          vehicle_color,
          vehicle_plate,
          rating,
          total_trips,
          total_cancelled_trips,
          current_location
        )
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    // Filter by passenger email if provided (for non-authenticated users)
    if (passengerEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", passengerEmail)
        .single()
      
      if (profile) {
        query = query.eq("passenger_id", profile.id)
      }
    } else {
      // Try to get authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        query = query.eq("passenger_id", user.id)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ trips: data || [] })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// CREATE a new trip
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const tripData = await request.json()

    // Get user ID - either from auth or from provided email
    let passengerId: string | null = null
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      passengerId = user.id
    } else if (tripData.passengerEmail) {
      // For demo: find or create profile by email
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", tripData.passengerEmail)
        .single()
      
      if (existingProfile) {
        passengerId = existingProfile.id
      }
    }

    if (!passengerId) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    // Generate confirmation code
    const confirmationCode = `PCT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Find the best available driver (closest one if coordinates provided)
    const { data: availableDrivers } = await supabase
      .from("demo_drivers")
      .select("*")
      .eq("status", "available")
      .eq("is_verified", true)

    let selectedDriver: DemoDriver | null = null

    if (availableDrivers && availableDrivers.length > 0) {
      // If origin coordinates provided, find closest driver
      if (tripData.originLat && tripData.originLng) {
        const driversWithDistance = availableDrivers.map((driver: DemoDriver) => ({
          ...driver,
          distance: driver.current_latitude && driver.current_longitude
            ? calculateDistance(
                tripData.originLat,
                tripData.originLng,
                driver.current_latitude,
                driver.current_longitude
              )
            : Infinity
        })).sort((a, b) => a.distance - b.distance)
        
        selectedDriver = driversWithDistance[0]
      } else {
        // Just pick the highest-rated available driver
        selectedDriver = availableDrivers.sort((a: DemoDriver, b: DemoDriver) => b.rating - a.rating)[0]
      }
    }

    const { data, error } = await supabase
      .from("trips")
      .insert({
        confirmation_code: confirmationCode,
        passenger_id: passengerId,
        demo_driver_id: selectedDriver?.id || null,
        service_type: tripData.serviceType,
        origin: tripData.origin,
        destination: tripData.destination,
        destination_id: tripData.destinationId || null,
        distance_km: tripData.distanceKm,
        price_usd: tripData.priceUsd,
        discount_code: tripData.discountCode || null,
        discount_amount: tripData.discountAmount || 0,
        final_price: tripData.finalPrice,
        passengers: tripData.passengers || 1,
        trip_date: tripData.tripDate,
        trip_time: tripData.tripTime,
        notes: tripData.notes || null,
        status: selectedDriver ? "confirmed" : "pending"
      })
      .select(`
        *,
        demo_driver:demo_drivers(
          id,
          first_name,
          last_name,
          phone,
          vehicle_brand,
          vehicle_model,
          vehicle_year,
          vehicle_color,
          vehicle_plate,
          rating,
          total_trips,
          current_location
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update driver status if assigned
    if (selectedDriver) {
      await supabase
        .from("demo_drivers")
        .update({ status: "busy", updated_at: new Date().toISOString() })
        .eq("id", selectedDriver.id)
    }

    return NextResponse.json({ 
      message: "Viaje creado exitosamente",
      trip: data,
      driverAssigned: !!selectedDriver
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
