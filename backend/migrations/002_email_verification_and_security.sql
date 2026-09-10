-- Migration 002: Add email verification and enable Row Level Security
-- Created: 2026-09-10

-- Create users table to track custom user data and email verification
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id OR id IS NULL);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id);

-- Enable RLS on all goal tables with policies allowing users to access their own data
ALTER TABLE public.big_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own big goals" ON public.big_goals
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.yearly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own yearly goals" ON public.yearly_goals
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own monthly goals" ON public.monthly_goals
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own weekly goals" ON public.weekly_goals
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own daily goals" ON public.daily_goals
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own time blocks" ON public.time_blocks
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own gratitude entries" ON public.gratitude_entries
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.reflection_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own reflection entries" ON public.reflection_entries
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.idea_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own idea folders" ON public.idea_folders
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own ideas" ON public.ideas
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.special_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own special dates" ON public.special_dates
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own settings" ON public.user_settings
  FOR ALL USING (auth.uid()::text = user_id);

ALTER TABLE public.health_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own health sessions" ON public.health_sessions
  FOR ALL USING (auth.uid()::text = user_id);
