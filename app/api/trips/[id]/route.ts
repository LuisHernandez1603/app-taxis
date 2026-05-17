import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET a single trip by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
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
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ trip: data })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// UPDATE a trip (cancel, update status, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const updates = await request.json()

    // Get the trip first to get driver info
    const { data: existingTrip } = await supabase
      .from("trips")
      .select("demo_driver_id, status")
      .eq("id", id)
      .single()

    // If cancelling, add cancellation details
    if (updates.status === "cancelled") {
      updates.cancelled_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("trips")
      .update(updates)
      .eq("id", id)
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
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If trip was cancelled or completed, free up the driver
    if ((updates.status === "cancelled" || updates.status === "completed") && existingTrip?.demo_driver_id) {
      await supabase
        .from("demo_drivers")
        .update({ status: "available", updated_at: new Date().toISOString() })
        .eq("id", existingTrip.demo_driver_id)

      // Increment completed trips if completed
      if (updates.status === "completed") {
        await supabase.rpc("increment_driver_trips_count", { driver_id: existingTrip.demo_driver_id })
      }
    }

    return NextResponse.json({ 
      message: "Viaje actualizado exitosamente",
      trip: data 
    })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
