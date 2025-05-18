import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  const supabase = createClient();

  try {
    if (slug) {
      // Get a specific provider by slug
      const { data: provider, error: providerError } = await supabase
        .from("providers")
        .select("*")
        .eq("slug", slug)
        .single();

      if (providerError) throw providerError;

      if (!provider) {
        return NextResponse.json(
          { error: "Provider not found" },
          { status: 404 },
        );
      }

      // Get the provider's services
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", provider.id);

      if (servicesError) throw servicesError;

      return NextResponse.json({ provider, services });
    } else {
      // Get all providers
      const { data: providers, error } = await supabase
        .from("providers")
        .select("*");

      if (error) throw error;

      return NextResponse.json({ providers });
    }
  } catch (error: any) {
    console.error("Error fetching providers:", error);
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

    const json = await request.json();

    // Validate required fields
    if (!json.name || !json.email || !json.slug) {
      return NextResponse.json(
        { error: "Name, email, and slug are required" },
        { status: 400 },
      );
    }

    // Check if slug is already taken
    const { data: existingProvider } = await supabase
      .from("providers")
      .select("id")
      .eq("slug", json.slug)
      .single();

    if (existingProvider) {
      return NextResponse.json(
        { error: "This URL slug is already taken" },
        { status: 400 },
      );
    }

    // Create the provider
    const { data, error } = await supabase
      .from("providers")
      .insert({
        user_id: session.user.id,
        name: json.name,
        email: json.email,
        phone: json.phone || null,
        address: json.address || null,
        description: json.description || null,
        website: json.website || null,
        logo_url: json.logo_url || null,
        slug: json.slug,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ provider: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating provider:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
