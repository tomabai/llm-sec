import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Database configuration missing' }),
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get total active challengers (total registered users in ctf_users)
    const { count: activeChallengers } = await supabase
      .from('ctf_users')
      .select('*', { count: 'exact', head: true })

    // Get total flags captured (completed levels)
    const { count: flagsCaptured } = await supabase
      .from('level_progress')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', true)

    // Get top 3 from leaderboard table/view (which has accurate scores pre-calculated)
    const { data: top3Data, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(3)

    if (leaderboardError) {
      console.error('Leaderboard error:', leaderboardError)
      return new Response(
        JSON.stringify({
          active_challengers: activeChallengers || 0,
          flags_captured: flagsCaptured || 0,
          top_3: []
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
          }
        }
      )
    }

    // Format top 3 data
    const top3 = (top3Data || []).map((entry: any, index: number) => ({
      rank: index + 1,
      display_name: entry.display_name || entry.username,
      username: entry.username,
      score: entry.score,
      levels_completed: entry.total_flags_captured,
      flags: [] // Could populate this if needed
    }))

    return new Response(
      JSON.stringify({
        active_challengers: activeChallengers || 0,
        flags_captured: flagsCaptured || 0,
        top_3: top3
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
        }
      }
    )
  } catch (error) {
    console.error('Stats API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
