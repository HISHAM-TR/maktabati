
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configure CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Initialize Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if owner already exists
    const { data: existingOwners, error: checkError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("role", "owner");

    if (checkError) {
      throw checkError;
    }

    if (existingOwners && existingOwners.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: "Owner account already exists",
          exists: true
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Default owner credentials
    const email = "admin@admin.com";
    const password = "123456";
    const name = "مدير النظام";

    // Create owner user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error("Failed to create user");
    }

    // Set owner role (normally would happen via trigger but let's be explicit)
    const { error: roleError } = await supabase
      .from("user_roles")
      .update({ role: "owner" })
      .eq("user_id", userData.user.id);

    if (roleError) {
      throw roleError;
    }

    // Ensure the user profile is created if not already exists
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();
      
    if (profileError) {
      // Create the profile if it doesn't exist
      const { error: insertProfileError } = await supabase
        .from("profiles")
        .insert({
          id: userData.user.id,
          name: name,
          avatar_url: null
        });
        
      if (insertProfileError) {
        throw insertProfileError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Owner account created successfully",
        email,
        password,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating owner account:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create owner account" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
