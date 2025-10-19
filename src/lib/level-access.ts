// Server-side level access validation
import { createServerClient } from './supabase'

export async function validateLevelAccess(
  userId: string | null,
  requestedLevel: number
): Promise<{ allowed: boolean; error?: string }> {
  // Level 1 is always accessible
  if (requestedLevel === 1) {
    return { allowed: true }
  }

  // All other levels require authentication
  if (!userId) {
    return {
      allowed: false,
      error: 'You must register to access levels beyond Level 1. Please visit /october/register'
    }
  }

  try {
    const supabase = createServerClient()

    // Get user's completed levels
    const { data: progress, error } = await supabase
      .from('level_progress')
      .select('level_id, is_completed')
      .eq('user_id', userId)
      .eq('is_completed', true)

    if (error) {
      console.error('Failed to check level progress:', error)
      return {
        allowed: false,
        error: 'Failed to verify level access. Please try again.'
      }
    }

    // Get all completed level numbers
    const completedLevels = (progress || []).map(p => parseInt(p.level_id))

    // User must have completed the previous level
    const previousLevel = requestedLevel - 1
    const hasPreviousLevel = completedLevels.includes(previousLevel)

    if (!hasPreviousLevel) {
      return {
        allowed: false,
        error: `You must complete Level ${previousLevel} before accessing Level ${requestedLevel}`
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Level access validation error:', error)
    return {
      allowed: false,
      error: 'An error occurred while verifying level access'
    }
  }
}
