import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { lat, lng } = await req.json()
    const apiKey = Deno.env.get('OPENCAGE_API_KEY')
    
    console.log('Request received for coordinates:', { lat, lng })
    console.log('API Key status:', apiKey ? 'Present' : 'Missing')

    if (!apiKey) {
      throw new Error('OpenCage API key not found in environment variables')
    }

    if (!lat || !lng) {
      throw new Error('Invalid coordinates provided')
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en`
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
      console.warn('No results found for coordinates')
      throw new Error('No location data found for these coordinates')
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error in geocode function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})