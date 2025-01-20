import { serve } from 'https://deno.fresh.dev/server.ts'

serve(async (req) => {
  const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
  
  if (!GOOGLE_PLACES_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Google Places API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ GOOGLE_PLACES_API_KEY }),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
      } 
    }
  )
})