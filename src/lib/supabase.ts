// Supabase client for October CTF Challenge
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Browser client (for client-side operations)
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// Server client (for server-side operations with service role)
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  })
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Create or get user by username
  async getOrCreateUser(client: ReturnType<typeof createBrowserClient>, username: string) {
    const { data: existingUser, error: fetchError } = await client
      .from('ctf_users')
      .select('*')
      .eq('username', username)
      .single()

    if (existingUser) return existingUser

    const { data: newUser, error: createError } = await client
      .from('ctf_users')
      .insert({ username })
      .select()
      .single()

    if (createError) throw createError
    return newUser
  },

  // Start or continue level progress
  async startLevel(
    client: ReturnType<typeof createBrowserClient>,
    userId: string,
    levelId: string
  ) {
    const { data, error } = await client
      .from('level_progress')
      .upsert(
        {
          user_id: userId,
          level_id: levelId,
          started_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id,level_id',
          ignoreDuplicates: true
        }
      )
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Capture flag
  async captureFlag(
    client: ReturnType<typeof createBrowserClient>,
    userId: string,
    levelId: string,
    hintsUsed: number,
    timeSpent: number
  ) {
    const now = new Date().toISOString()

    const { data, error } = await client
      .from('level_progress')
      .update({
        is_completed: true,
        flag_captured: true,
        flag_captured_at: now,
        completed_at: now,
        hints_used: hintsUsed,
        time_spent: timeSpent
      })
      .eq('user_id', userId)
      .eq('level_id', levelId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Save chat message
  async saveChatMessage(
    client: ReturnType<typeof createBrowserClient>,
    userId: string,
    levelId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>,
    toolsCalled?: string[],
    toolOutputs?: Record<string, any>
  ) {
    const { data, error } = await client
      .from('chat_messages')
      .insert({
        user_id: userId,
        level_id: levelId,
        role,
        content,
        metadata: metadata || {},
        tools_called: toolsCalled || null,
        tool_outputs: toolOutputs || null
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get user progress
  async getUserProgress(client: ReturnType<typeof createBrowserClient>, userId: string) {
    const { data, error } = await client
      .from('level_progress')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get leaderboard
  async getLeaderboard(client: ReturnType<typeof createBrowserClient>, limit: number = 100) {
    const { data, error } = await client
      .from('leaderboard')
      .select('*')
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Get user rank
  async getUserRank(client: ReturnType<typeof createBrowserClient>, userId: string) {
    const { data, error } = await client.rpc('get_user_rank', {
      p_user_id: userId
    })

    if (error) throw error
    return data?.[0] || null
  },

  // Get user certificate
  async getCertificate(client: ReturnType<typeof createBrowserClient>, userId: string) {
    const { data, error } = await client
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // Ignore "not found" error
    return data || null
  },

  // Check if user is eligible for certificate (all 5 levels completed)
  async isEligibleForCertificate(client: ReturnType<typeof createBrowserClient>, userId: string) {
    const { count } = await client
      .from('level_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_completed', true)

    return count === 5
  }
}
