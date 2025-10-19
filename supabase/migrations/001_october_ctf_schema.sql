-- October CTF Challenge Schema
-- This schema tracks user progress, flags captured, and leaderboard data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for CTF participants
CREATE TABLE IF NOT EXISTS public.ctf_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Profile info
  display_name TEXT,
  avatar_url TEXT,

  -- Stats
  total_flags_captured INTEGER DEFAULT 0,
  total_hints_used INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds

  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Level progress tracking
CREATE TABLE IF NOT EXISTS public.level_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.ctf_users(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,

  -- Progress status
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,

  -- Attempt tracking
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds

  -- Flag capture
  flag_captured BOOLEAN DEFAULT FALSE,
  flag_captured_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  UNIQUE(user_id, level_id)
);

-- Chat messages for analysis and replay
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.ctf_users(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',

  -- Tool calls (for agent challenges)
  tools_called TEXT[],
  tool_outputs JSONB
);

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  u.id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.total_flags_captured,
  u.total_hints_used,
  u.total_time_spent,
  COUNT(DISTINCT lp.level_id) FILTER (WHERE lp.is_completed = TRUE) as levels_completed,
  MIN(lp.completed_at) as first_flag_at,
  MAX(lp.completed_at) as last_flag_at,
  -- Calculate score: flags * 1000 - (hints * 50) - (time in minutes)
  (u.total_flags_captured * 1000 - u.total_hints_used * 50 - (u.total_time_spent / 60))::INTEGER as score
FROM public.ctf_users u
LEFT JOIN public.level_progress lp ON u.id = lp.user_id
GROUP BY u.id, u.username, u.display_name, u.avatar_url, u.total_flags_captured, u.total_hints_used, u.total_time_spent
ORDER BY score DESC, u.total_flags_captured DESC, u.total_time_spent ASC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_level_progress_user_id ON public.level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_level_id ON public.level_progress(level_id);
CREATE INDEX IF NOT EXISTS idx_level_progress_completed ON public.level_progress(is_completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_level ON public.chat_messages(user_id, level_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Row Level Security (RLS)
ALTER TABLE public.ctf_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ctf_users
CREATE POLICY "Users can view all profiles" ON public.ctf_users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.ctf_users
  FOR UPDATE USING (auth.uid()::TEXT = id::TEXT);

CREATE POLICY "Anyone can create a user profile" ON public.ctf_users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for level_progress
CREATE POLICY "Users can view own progress" ON public.level_progress
  FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Users can insert own progress" ON public.level_progress
  FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Users can update own progress" ON public.level_progress
  FOR UPDATE USING (auth.uid()::TEXT = user_id::TEXT);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY "Users can insert own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);

-- Function to update user stats when level is completed
CREATE OR REPLACE FUNCTION update_user_stats_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
    UPDATE public.ctf_users
    SET
      total_flags_captured = total_flags_captured + 1,
      total_hints_used = total_hints_used + NEW.hints_used,
      total_time_spent = total_time_spent + NEW.time_spent,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER UPDATE ON public.level_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_completion();

-- Function to get user rank
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id UUID)
RETURNS TABLE (
  rank BIGINT,
  total_users BIGINT,
  percentile NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_users AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY
        (total_flags_captured * 1000 - total_hints_used * 50 - (total_time_spent / 60))::INTEGER DESC,
        total_flags_captured DESC,
        total_time_spent ASC
      ) as user_rank
    FROM public.ctf_users
  ),
  user_stats AS (
    SELECT
      user_rank as rank,
      (SELECT COUNT(*) FROM public.ctf_users) as total_users
    FROM ranked_users
    WHERE id = p_user_id
  )
  SELECT
    rank::BIGINT,
    total_users::BIGINT,
    ROUND((rank::NUMERIC / NULLIF(total_users, 0)::NUMERIC) * 100, 2) as percentile
  FROM user_stats;
END;
$$ LANGUAGE plpgsql;
