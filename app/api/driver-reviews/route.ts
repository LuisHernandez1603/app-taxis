import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET reviews for a driver
export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const driverId = searchParams.get("driverId")

  if (!driverId) {
    // Get all reviews with driver info
    const { data, error } = await supabase
      .from("driver_reviews")
      .select(`
        *,
        demo_drivers (
          first_name,
          last_name,
          vehicle_brand,
          vehicle_model
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from("driver_reviews")
    .select("*")
    .eq("demo_driver_id", driverId)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST a new review
export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { driverId, tripId, passengerName, passengerEmail, rating, comment } = body

  if (!driverId || !passengerName || !rating) {
    return NextResponse.json(
      { error: "driverId, passengerName, and rating are required" },
      { status: 400 }
    )
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("driver_reviews")
    .insert({
      demo_driver_id: driverId,
      trip_id: tripId || null,
      passenger_name: passengerName,
      passenger_email: passengerEmail || null,
      rating,
      comment: comment || null
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // The trigger will automatically update the driver's rating

  return NextResponse.json(data, { status: 201 })
}
