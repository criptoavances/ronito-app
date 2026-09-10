-- Migration 003: Email marketing and automation
-- Created: 2026-09-10

-- Email sequences: tracks which users are in which sequences
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  sequence_name TEXT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active', -- active, paused, completed
  current_email_index INTEGER DEFAULT 0,
  last_sent_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_sequences_user ON public.email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON public.email_sequences(status);

-- Email events: tracks opens, clicks, bounces for analytics
CREATE TABLE IF NOT EXISTS public.email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- sent, opened, clicked, bounced, unsubscribed
  email_subject TEXT,
  sequence_name TEXT,
  email_index INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_events_user ON public.email_events(user_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON public.email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created ON public.email_events(created_at);

-- Enable RLS
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access their own sequences" ON public.email_sequences
  FOR ALL USING (auth.uid()::text = user_id);

CREATE POLICY "Users can access their own events" ON public.email_events
  FOR ALL USING (auth.uid()::text = user_id);
