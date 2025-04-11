
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for the API
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

    // Tables are already created via SQL migration
    // This function just performs a simple check to make sure tables exist
    // and returns some basic information
    
    // Get table counts
    const { data: profilesCount, error: profilesError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
      
    const { data: userRolesCount, error: userRolesError } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true });
      
    const { data: librariesCount, error: librariesError } = await supabase
      .from("libraries")
      .select("*", { count: "exact", head: true });
      
    const { data: booksCount, error: booksError } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true });
      
    const { data: settingsCount, error: settingsError } = await supabase
      .from("site_settings")
      .select("*", { count: "exact", head: true });
      
    const { data: linksCount, error: linksError } = await supabase
      .from("social_links")
      .select("*", { count: "exact", head: true });
      
    const { data: ticketsCount, error: ticketsError } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true });
      
    const { data: responsesCount, error: responsesError } = await supabase
      .from("ticket_responses")
      .select("*", { count: "exact", head: true });

    // Return information about the tables
    return new Response(
      JSON.stringify({
        success: true,
        message: "Tables verified",
        tables: {
          profiles: { 
            exists: !profilesError, 
            count: profilesCount?.length || 0 
          },
          user_roles: { 
            exists: !userRolesError, 
            count: userRolesCount?.length || 0 
          },
          libraries: { 
            exists: !librariesError, 
            count: librariesCount?.length || 0 
          },
          books: { 
            exists: !booksError, 
            count: booksCount?.length || 0 
          },
          site_settings: { 
            exists: !settingsError, 
            count: settingsCount?.length || 0 
          },
          social_links: { 
            exists: !linksError, 
            count: linksCount?.length || 0 
          },
          tickets: { 
            exists: !ticketsError, 
            count: ticketsCount?.length || 0 
          },
          ticket_responses: { 
            exists: !responsesError, 
            count: responsesCount?.length || 0 
          },
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in setup-db-tables:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to setup database tables" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
