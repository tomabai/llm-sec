import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId, levelId } = await req.json()

    if (!userId || !levelId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or levelId' }),
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Use upsert to handle both new and existing progress
    // ignoreDuplicates will make it succeed silently if record exists
    const { data, error } = await supabase
      .from('level_progress')
      .upsert(
        {
          user_id: userId,
          level_id: levelId,
          started_at: new Date().toISOString(),
          is_completed: false,
          flag_captured: false
        },
        {
          onConflict: 'user_id,level_id',
          ignoreDuplicates: true
        }
      )
      .select()

    // If ignoreDuplicates and no data returned, fetch existing record
    if (!error && (!data || data.length === 0)) {
      const { data: existing, error: fetchError } = await supabase
        .from('level_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .single()

      if (fetchError) {
        console.error('Failed to fetch existing level:', fetchError)
        return new Response(
          JSON.stringify({ error: fetchError.message }),
          { status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data: existing }),
        { status: 200 }
      )
    }

    if (error) {
      console.error('Failed to start level:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Start level error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
