-- Big Goal (WHY - top level motivation)
CREATE TABLE big_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  why TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Yearly Goals
CREATE TABLE yearly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Monthly Goals
CREATE TABLE monthly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  yearly_goal_id UUID REFERENCES yearly_goals(id),
  title TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Weekly Goals
CREATE TABLE weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  monthly_goal_id UUID REFERENCES monthly_goals(id),
  title TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  week_start DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily Goals (3 non-negotiable per day)
CREATE TABLE daily_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  weekly_goal_id UUID REFERENCES weekly_goals(id),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  goal_date DATE NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Time Blocks (work, personal, exercise, catch-all)
CREATE TABLE time_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#8B5CF6',
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  day_of_week INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gratitude Entries (morning)
CREATE TABLE gratitude_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  things TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Reflection Entries (evening)
CREATE TABLE reflection_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  what_done TEXT,
  what_didnt TEXT,
  why_didnt TEXT,
  three_good_things TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  day_rating INTEGER,
  journal_entry TEXT,
  tomorrow_preview TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Idea Folders (user created)
CREATE TABLE idea_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ideas (stored in folders)
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  folder_id UUID NOT NULL REFERENCES idea_folders(id),
  content TEXT NOT NULL,
  is_voice BOOLEAN DEFAULT FALSE,
  voice_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Special Dates (birthdays, anniversaries)
CREATE TABLE special_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date_value DATE NOT NULL,
  date_type TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Settings
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  why_reminder_frequency TEXT DEFAULT '1h',
  ai_voice_choice TEXT DEFAULT 'nova',
  morning_routine_enabled BOOLEAN DEFAULT TRUE,
  evening_routine_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Health Sessions (meditation, breathwork, exercise)
CREATE TABLE health_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER,
  file_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_daily_goals_user_date ON daily_goals(user_id, goal_date);
CREATE INDEX idx_gratitude_user_date ON gratitude_entries(user_id, entry_date);
CREATE INDEX idx_reflection_user_date ON reflection_entries(user_id, entry_date);
CREATE INDEX idx_ideas_folder ON ideas(folder_id);
CREATE INDEX idx_time_blocks_user ON time_blocks(user_id);
CREATE INDEX idx_health_user ON health_sessions(user_id);
