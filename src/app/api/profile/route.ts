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

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (userError) throw userError;

    // Get provider data if it exists
    const { data: providerData, error: providerError } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    // We don't throw an error if provider data doesn't exist, as the user might not have created a provider profile yet

    return NextResponse.json({
      user: userData,
      provider: providerData || null,
    });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
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

    // Update user data
    if (json.user) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .update({
          name: json.user.name,
        })
        .eq("id", session.user.id)
        .select();

      if (userError) throw userError;
    }

    // Update or create provider data
    if (json.provider) {
      // Check if provider exists
      const { data: existingProvider } = await supabase
        .from("providers")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (existingProvider) {
        // Update existing provider
        const { data: providerData, error: providerError } = await supabase
          .from("providers")
          .update({
            name: json.provider.name,
            email: json.provider.email,
            phone: json.provider.phone,
            address: json.provider.address,
            description: json.provider.description,
            website: json.provider.website,
            logo_url: json.provider.logo_url,
            slug: json.provider.slug,
          })
          .eq("id", existingProvider.id)
          .select();

        if (providerError) throw providerError;
      } else {
        // Create new provider
        const { data: providerData, error: providerError } = await supabase
          .from("providers")
          .insert({
            user_id: session.user.id,
            name: json.provider.name,
            email: json.provider.email || session.user.email,
            phone: json.provider.phone,
            address: json.provider.address,
            description: json.provider.description,
            website: json.provider.website,
            logo_url: json.provider.logo_url,
            slug: json.provider.slug,
          })
          .select();

        if (providerError) throw providerError;
      }
    }

    // Get updated data
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    const { data: providerData } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    return NextResponse.json({
      user: userData,
      provider: providerData || null,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
