import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ✅ CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
}

// ✅ JSON response helper
const jsonResponse = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  })

// ✅ Reuse Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
)

// Simulate network latency by delaying response

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    if (req.method === "GET") {
      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get("page") || "1")
      const limit = parseInt(url.searchParams.get("limit") || "40") // default to 10 items per page

      // Simulate a network delay (latency)

      // Fetch paginated properties from the database
      const { data: properties, error } = await supabase
        .from("properties")
        .select("id, title, location, type, status, custom_image, created_at,full_address,bhk,baths,sqft, description, area ")
        .order("created_at", { ascending: false })
        // .range((page - 1) * limit, page * limit - 1) // Paginate the results

      if (error) {
        console.error("GET properties error:", error)
        return jsonResponse({ error: "Failed to fetch properties" }, 500)
      }

      return jsonResponse({
        success: true,
        page,
        count: properties?.length ?? 0,
        properties: properties ?? []
      })
    }

    return jsonResponse({ error: "Method not allowed", allowed: ["GET", "OPTIONS"] }, 405)
  } catch (err) {
    console.error("Server error:", err)
    return jsonResponse({ error: "Internal server error" }, 500)
  }
})
