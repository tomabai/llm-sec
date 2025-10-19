import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Database configuration missing' }),
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if certificate already exists
    const { data: existingCert, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingCert) {
      // Get user info for display
      const { data: user } = await supabase
        .from('ctf_users')
        .select('*')
        .eq('id', userId)
        .single()

      return new Response(
        JSON.stringify({
          has_certificate: true,
          certificate: existingCert,
          user
        }),
        { status: 200 }
      )
    }

    // Check if user is eligible (all 5 levels completed)
    const { count: completedLevels } = await supabase
      .from('level_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', true)

    const isEligible = completedLevels === 5

    return new Response(
      JSON.stringify({
        has_certificate: false,
        is_eligible: isEligible,
        completed_levels: completedLevels || 0
      }),
      { status: 200 }
    )

  } catch (error) {
    console.error('Certificate GET error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Database configuration missing' }),
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingCert) {
      return new Response(
        JSON.stringify({ error: 'Certificate already issued' }),
        { status: 400 }
      )
    }

    // Verify user completed all 5 levels
    const { data: progress } = await supabase
      .from('level_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true)

    if (!progress || progress.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Must complete all 5 levels to earn certificate' }),
        { status: 400 }
      )
    }

    // Get user info
    const { data: user } = await supabase
      .from('ctf_users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      )
    }

    // Get user rank
    const { data: rankData } = await supabase.rpc('get_user_rank', {
      p_user_id: userId
    })

    // Get total stats
    const totalTime = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0)
    const totalHints = progress.reduce((sum, p) => sum + (p.hints_used || 0), 0)

    // Generate unique certificate number
    const { count: totalCerts } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })

    const certNumber = `AIASEC-OCT2025-${String((totalCerts || 0) + 1).padStart(4, '0')}`

    // Create certificate
    const { data: certificate, error: createError } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        certificate_number: certNumber,
        metadata: {
          display_name: user.display_name || user.username,
          username: user.username,
          completed_at: new Date().toISOString(),
          total_time: totalTime,
          total_hints: totalHints,
          rank: rankData?.[0]?.rank || null,
          total_users: rankData?.[0]?.total_users || null
        }
      })
      .select()
      .single()

    if (createError) {
      console.error('Certificate creation error:', createError)
      return new Response(
        JSON.stringify({ error: 'Failed to create certificate' }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        certificate,
        user
      }),
      { status: 201 }
    )

  } catch (error) {
    console.error('Certificate POST error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
