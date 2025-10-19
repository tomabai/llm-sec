# Supabase Setup for October CTF Challenge

This directory contains the database schema and migration files for the October Cybersecurity Awareness Month CTF challenge.

## Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a database password and region
3. Wait for the project to be provisioned

### 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Update Environment Variables

Edit your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run the Migration

Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/001_october_ctf_schema.sql`
4. Paste and run the SQL

Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Database Schema

### Tables

#### `ctf_users`
Stores CTF participant information and overall stats.

- `id`: UUID (primary key)
- `username`: Unique username
- `email`: Optional email
- `display_name`: Display name for leaderboard
- `avatar_url`: Optional avatar image
- `total_flags_captured`: Total number of flags captured
- `total_hints_used`: Total hints used across all levels
- `total_time_spent`: Total time spent in seconds

#### `level_progress`
Tracks user progress for each level.

- `id`: UUID (primary key)
- `user_id`: Reference to ctf_users
- `level_id`: Level identifier (e.g., "1", "2", "3")
- `started_at`: When the user started the level
- `completed_at`: When the user completed the level
- `is_completed`: Boolean flag
- `attempts`: Number of attempts
- `hints_used`: Number of hints used for this level
- `time_spent`: Time spent on this level in seconds
- `flag_captured`: Whether the flag was captured
- `flag_captured_at`: Timestamp of flag capture
- `metadata`: Additional JSON metadata

#### `chat_messages`
Stores chat messages for analysis and replay.

- `id`: UUID (primary key)
- `user_id`: Reference to ctf_users
- `level_id`: Level identifier
- `role`: 'user' | 'assistant' | 'system'
- `content`: Message content
- `created_at`: Timestamp
- `metadata`: Additional JSON metadata
- `tools_called`: Array of tool names called by the agent
- `tool_outputs`: JSON object with tool outputs

### Views

#### `leaderboard`
Pre-computed leaderboard with scores and rankings.

Scoring formula:
```
score = (flags_captured * 1000) - (hints_used * 50) - (time_spent_minutes)
```

### Functions

#### `get_user_rank(user_id)`
Returns the user's rank, total users, and percentile.

#### `update_user_stats_on_completion()`
Trigger function that automatically updates user stats when a level is completed.

## Row Level Security (RLS)

The database uses Row Level Security to ensure users can only:
- View their own progress and messages
- Update their own profile
- View all user profiles (for leaderboard)

## Usage Examples

See `/src/lib/supabase.ts` for helper functions:

```typescript
import { createBrowserClient, supabaseHelpers } from '@/lib/supabase'

const supabase = createBrowserClient()

// Create or get user
const user = await supabaseHelpers.getOrCreateUser(supabase, 'username')

// Start a level
await supabaseHelpers.startLevel(supabase, user.id, '1')

// Capture a flag
await supabaseHelpers.captureFlag(supabase, user.id, '1', 2, 300)

// Get leaderboard
const leaderboard = await supabaseHelpers.getLeaderboard(supabase, 50)

// Get user rank
const rank = await supabaseHelpers.getUserRank(supabase, user.id)
```

## Maintenance

### Backup

Always backup your database before running new migrations:

```bash
supabase db dump -f backup.sql
```

### Reset Database (Development Only)

```bash
supabase db reset
```

## Security Notes

- Never commit `.env.local` to version control
- The `service_role` key has admin access - keep it secret
- The `anon` key is safe to expose in client-side code
- RLS policies protect user data
- Always validate user input before database queries
