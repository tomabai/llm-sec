// Database types for October CTF Challenge
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ctf_users: {
        Row: {
          id: string
          username: string
          email: string | null
          created_at: string
          updated_at: string
          display_name: string | null
          avatar_url: string | null
          total_flags_captured: number
          total_hints_used: number
          total_time_spent: number
        }
        Insert: {
          id?: string
          username: string
          email?: string | null
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          total_flags_captured?: number
          total_hints_used?: number
          total_time_spent?: number
        }
        Update: {
          id?: string
          username?: string
          email?: string | null
          created_at?: string
          updated_at?: string
          display_name?: string | null
          avatar_url?: string | null
          total_flags_captured?: number
          total_hints_used?: number
          total_time_spent?: number
        }
      }
      level_progress: {
        Row: {
          id: string
          user_id: string
          level_id: string
          started_at: string
          completed_at: string | null
          is_completed: boolean
          attempts: number
          hints_used: number
          time_spent: number
          flag_captured: boolean
          flag_captured_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          level_id: string
          started_at?: string
          completed_at?: string | null
          is_completed?: boolean
          attempts?: number
          hints_used?: number
          time_spent?: number
          flag_captured?: boolean
          flag_captured_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          level_id?: string
          started_at?: string
          completed_at?: string | null
          is_completed?: boolean
          attempts?: number
          hints_used?: number
          time_spent?: number
          flag_captured?: boolean
          flag_captured_at?: string | null
          metadata?: Json
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          level_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at: string
          metadata: Json
          tools_called: string[] | null
          tool_outputs: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          level_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at?: string
          metadata?: Json
          tools_called?: string[] | null
          tool_outputs?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          level_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          created_at?: string
          metadata?: Json
          tools_called?: string[] | null
          tool_outputs?: Json | null
        }
      }
      certificates: {
        Row: {
          id: string
          user_id: string
          certificate_number: string
          issued_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          certificate_number: string
          issued_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          certificate_number?: string
          issued_at?: string
          metadata?: Json
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_flags_captured: number
          total_hints_used: number
          total_time_spent: number
          levels_completed: number
          first_flag_at: string | null
          last_flag_at: string | null
          score: number
        }
      }
    }
    Functions: {
      get_user_rank: {
        Args: { p_user_id: string }
        Returns: {
          rank: number
          total_users: number
          percentile: number
        }[]
      }
    }
  }
}

// Helper types for easier use
export type CTFUser = Database['public']['Tables']['ctf_users']['Row']
export type CTFUserInsert = Database['public']['Tables']['ctf_users']['Insert']
export type CTFUserUpdate = Database['public']['Tables']['ctf_users']['Update']

export type LevelProgress = Database['public']['Tables']['level_progress']['Row']
export type LevelProgressInsert = Database['public']['Tables']['level_progress']['Insert']
export type LevelProgressUpdate = Database['public']['Tables']['level_progress']['Update']

export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']
export type ChatMessageUpdate = Database['public']['Tables']['chat_messages']['Update']

export type Certificate = Database['public']['Tables']['certificates']['Row']
export type CertificateInsert = Database['public']['Tables']['certificates']['Insert']
export type CertificateUpdate = Database['public']['Tables']['certificates']['Update']

export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row']

export type UserRank = {
  rank: number
  total_users: number
  percentile: number
}
