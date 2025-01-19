import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Geocoding function started")

serve(async (req) => {
  try {
    const { lat, lng, query } = await req.json()
    const apiKey = Deno.env.get('OPENCAGE_API_KEY')
    
    console.log('Request received:', { lat, lng, query })
    console.log('API Key status:', apiKey ? 'Present' : 'Missing')

    if (!apiKey) {
      throw new Error('OpenCage API key not found in environment variables')
    }

    let url: string;
    
    if (query) {
      // Forward geocoding (search by query)
      url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&language=en&limit=5`
    } else if (lat && lng) {
      // Reverse geocoding (coordinates to address)
      url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en`
    } else {
      throw new Error('Invalid request: must provide either coordinates or search query')
    }

    console.log('Making request to OpenCage API')

    const response = await fetch(url)
    const data = await response.json()
    
    console.log('OpenCage API response status:', response.status)
    console.log('OpenCage API response:', data)

    if (data.status?.code === 401 || data.status?.code === 403) {
      console.error('API Key authentication failed:', data.status)
      throw new Error('OpenCage API key authentication failed')
    }

    if (!response.ok) {
      console.error('OpenCage API error:', data.status)
      throw new Error(`OpenCage API error: ${data.status?.message || response.statusText}`)
    }

    if (!data.results || data.results.length === 0) {
      console.warn('No results found')
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Error in geocoding function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
})