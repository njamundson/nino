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
    
    console.log('Received coordinates:', { lat, lng })
    console.log('API Key exists:', !!apiKey)

    if (!apiKey) {
      throw new Error('OpenCage API key not configured')
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&language=en`
    console.log('Fetching from URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    
    console.log('OpenCage API response:', data)

    if (data.status?.code === 401) {
      throw new Error('Invalid API key or API key has expired')
    }

    if (!response.ok) {
      throw new Error(`OpenCage API error: ${data.status?.message || response.statusText}`)
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
        details: error.toString()
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