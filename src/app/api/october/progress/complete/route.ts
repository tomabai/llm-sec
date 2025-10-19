import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId, levelId, hintsUsed, timeSpent } = await req.json()

    if (!userId || !levelId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or levelId' }),
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const now = new Date().toISOString()

    // Update progress to completed
    const { data, error } = await supabase
      .from('level_progress')
      .update({
        is_completed: true,
        flag_captured: true,
        flag_captured_at: now,
        completed_at: now,
        hints_used: hintsUsed || 0,
        time_spent: timeSpent || 0
      })
      .eq('user_id', userId)
      .eq('level_id', levelId)
      .select()
      .single()

    if (error) {
      console.error('Failed to complete level:', error)
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
    console.error('Complete level error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
}
