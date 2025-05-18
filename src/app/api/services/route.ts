import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("provider_id");

  const supabase = createClient();

  try {
    if (providerId) {
      // Get services for a specific provider
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", providerId);

      if (error) throw error;

      return NextResponse.json({ services: data });
    } else {
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

      // Get all services for this provider
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", provider.id);

      if (error) throw error;

      return NextResponse.json({ services: data });
    }
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const json = await request.json();

    // Validate required fields
    if (!json.name || json.duration === undefined || json.price === undefined) {
      return NextResponse.json(
        { error: "Name, duration, and price are required" },
        { status: 400 },
      );
    }

    // Create the service
    const { data, error } = await supabase
      .from("services")
      .insert({
        provider_id: provider.id,
        name: json.name,
        description: json.description || null,
        duration: json.duration,
        price: json.price,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ service: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
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

    if (!json.id) {
      return NextResponse.json(
        { error: "Service ID is required" },
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

    // Update the service
    const updateData: any = {};
    if (json.name !== undefined) updateData.name = json.name;
    if (json.description !== undefined)
      updateData.description = json.description;
    if (json.duration !== undefined) updateData.duration = json.duration;
    if (json.price !== undefined) updateData.price = json.price;

    const { data, error } = await supabase
      .from("services")
      .update(updateData)
      .eq("id", json.id)
      .eq("provider_id", provider.id) // Ensure the service belongs to this provider
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return NextResponse.json(
        {
          error: "Service not found or you do not have permission to update it",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ service: data[0] });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("id");

  if (!serviceId) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 },
    );
  }

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

    // Delete the service
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId)
      .eq("provider_id", provider.id); // Ensure the service belongs to this provider

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
