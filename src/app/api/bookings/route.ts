import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();

  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's provider ID
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: "No provider profile found for this user" },
        { status: 404 },
      );
    }

    // Get all bookings for this provider
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        services:service_id (name, duration, price)
      `,
      )
      .eq("provider_id", provider.id)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const json = await request.json();

    // Validate required fields
    if (
      !json.provider_id ||
      !json.service_id ||
      !json.customer_name ||
      !json.customer_email ||
      !json.customer_phone ||
      !json.booking_date ||
      !json.booking_time
    ) {
      return NextResponse.json(
        { error: "Missing required booking information" },
        { status: 400 },
      );
    }

    // Create the booking
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        provider_id: json.provider_id,
        service_id: json.service_id,
        customer_name: json.customer_name,
        customer_email: json.customer_email,
        customer_phone: json.customer_phone,
        booking_date: json.booking_date,
        booking_time: json.booking_time,
        status: "pending",
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ booking: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = createClient();

  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();

    if (!json.id || !json.status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 },
      );
    }

    // Get the user's provider ID
    const { data: provider } = await supabase
      .from("providers")
      .select("id")
      .eq("user_id", session.user.id)
      .single();

    if (!provider) {
      return NextResponse.json(
        { error: "No provider profile found for this user" },
        { status: 404 },
      );
    }

    // Update the booking status
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: json.status })
      .eq("id", json.id)
      .eq("provider_id", provider.id) // Ensure the booking belongs to this provider
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return NextResponse.json(
        {
          error: "Booking not found or you do not have permission to update it",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ booking: data[0] });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
