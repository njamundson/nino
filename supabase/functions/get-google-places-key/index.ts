import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY")
  
  if (!GOOGLE_PLACES_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Google Places API key not configured" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    )
  }

  return new Response(
    JSON.stringify({ GOOGLE_PLACES_API_KEY }),
    { 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      } 
    }
  )
})